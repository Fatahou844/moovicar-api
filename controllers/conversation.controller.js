"use strict";

const db = require("../models/index");
const { Op, col } = require("sequelize");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const reservation = db.Reservation;
const Conversation = db.Conversation;

exports.getConversations = function (req, res) {
  Conversation.findAll({
    include: [
      {
        model: UserProfile,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "city",
          "country",
          "immatriculation",
        ],
      },
      {
        model: reservation,
        attributes: [
          "reservationId",
          "status",
          "driverInviteId",
          "driverHoteId",
          "startDate",
          "endDate",
        ],
        include: [
          {
            model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
            attributes: ["id", "description", "images"],
            include: [
              {
                model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
                attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
              },
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
          {
            model: UserProfile,
            as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "immatriculation",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],
  })
    .then((demandes) => {
      console.log(demandes);
      if (demandes) {
        res.status(200).json(demandes);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.createConversation = async function (req, res) {
  try {
    const conv = await Conversation.create(req.body);
    if (!conv) return res.status(400).json(-1);

    const reservationId = conv.reservationId;

    // Envoie le message uniquement aux participants de cette réservation
    // .toJSON() indispensable — socket.io ne sérialise pas les instances Sequelize correctement
    req.io.to(`room:${reservationId}`).emit("new-message", conv.toJSON());

    // Notification pour l'autre participant
    const resa = await reservation.findByPk(reservationId);
    if (resa) {
      const authorRole = parseInt(conv.authorDriverRole, 10);
      const recipientId = authorRole === 0 ? resa.driverInviteId : resa.driverHoteId;
      const notifPayload = {
        title: "Nouveau message",
        body: (conv.message || "").substring(0, 100),
        link: authorRole === 0
          ? `/guest/chatbox/${reservationId}`          // invité → sa page chat
          : `/inbox/messages/thread/${reservationId}`, // hôte → sa page chat
      };

      // ① Socket temps réel (si onglet ouvert)
      const recipientSocketId = req.userConnections[String(recipientId)];
      if (recipientSocketId) {
        req.io.to(recipientSocketId).emit("push-notification", notifPayload);
      }

      // ② Web Push (même si navigateur en arrière-plan / onglet fermé)
      const PushSubscription = require("../models").PushSubscription;
      const subs = await PushSubscription.findAll({ where: { userId: recipientId } });
      for (const sub of subs) {
        try {
          await req.webpush.sendNotification(
            JSON.parse(sub.subscription),
            JSON.stringify(notifPayload)
          );
        } catch (e) {
          // Subscription expirée ou invalide → on la supprime
          if (e.statusCode === 410 || e.statusCode === 404) await sub.destroy();
          else console.error("web-push error:", e.message);
        }
      }
    }

    res.status(200).json(conv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "conversations Internal server error" });
  }
};

exports.getConversationByReservationId = function (req, res) {
  const reservationId = req.params.reservationId;

  Conversation.findAll({
    include: [
      {
        model: UserProfile,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "city",
          "country",
          "immatriculation",
          "profile_url",
        ],
      },
      {
        model: reservation,
        attributes: [
          "reservationId",
          "status",
          "driverInviteId",
          "driverHoteId",
          "startDate",
          "endDate",
        ],
        include: [
          {
            model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
            attributes: ["id", "description", "images"],
            include: [
              {
                model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
                attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
              },
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
          {
            model: UserProfile,
            as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "immatriculation",
              "profile_url",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],
    where: {
      reservationId: reservationId,
    },
  })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.getConversationByGroupByReservationId = function (req, res) {
  const reservationId = req.params.reservationId;

  Conversation.findAll({
    include: [
      {
        model: UserProfile,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "city",
          "country",
          "immatriculation",
        ],
      },
      {
        model: reservation,
        attributes: [
          "reservationId",
          "status",
          "driverInviteId",
          "driverHoteId",
          "startDate",
          "endDate",
        ],
        include: [
          {
            model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
            attributes: ["id", "description", "images"],
            include: [
              {
                model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
                attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
              },
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
          {
            model: UserProfile,
            as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "immatriculation",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "PermisConduireDoc",
              "PieceIdentityDoc",
              "ImmatriculationDoc",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],
    where: {
      reservationId: reservationId,
    },
  })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};
