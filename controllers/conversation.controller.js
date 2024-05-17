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
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: ["id", "firstName", "lastName", "city", "country"], // Sélectionnez les attributs que vous souhaitez inclure
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
  Conversation.create(req.body)
    .then((reserv) => {
      console.log(reserv);
      if (reserv) {
        const reservationId = reserv.reservationId;
        const SocketReservationId = req.userConnections[reservationId];

        if (reservationId) {
          req.io.emit("conversation", reserv);
        }
        res.status(200).json(reserv);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      console.log("modeleId from request:", req.body);
      res.status(500).json({ error: "reservations Internal server error" });
    });
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
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: ["id", "firstName", "lastName", "city", "country"], // Sélectionnez les attributs que vous souhaitez inclure
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
            ],
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            as: "Invite",
            attributes: ["id", "firstName", "lastName", "city", "country"], // Sélectionnez les attributs que vous souhaitez inclure
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
