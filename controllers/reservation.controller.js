"use strict";

const db = require("../models/index");
const { Op, col } = require("sequelize");
const Sequelize = require("sequelize");
const { createNotification } = require("../services/notificationService");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const reservation = db.Reservation;
const VehiculeAnnonce = db.VehiculeAnnonce;
const ReservationGains = db.ReservationGains;
const Paiements = db.Paiements;

exports.getreservations = function (req, res) {
  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
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
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
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

exports.createreservation = async function (req, res) {
  try {
    const reserv = await reservation.create(req.body);
    if (!reserv) return res.status(400).json(-1);

    res.status(200).json(reserv);

    // Notify host about new reservation request
    if (reserv.driverHoteId) {
      createNotification({
        userId: reserv.driverHoteId,
        titre: "Nouvelle demande de réservation",
        message: "Un voyageur souhaite louer votre véhicule. Consultez votre espace hôte.",
        type: "reservation_new",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    }
  } catch (error) {
    console.error(error);
    console.log("modeleId from request:", req.body);
    res.status(500).json({ error: "reservations Internal server error" });
  }
};

exports.getReservationById = function (req, res) {
  const reservationId = req.params.id;

  reservation
    .findOne({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
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
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
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

exports.getReservationByDriverHoteId = function (req, res) {
  const driverHoteId = req.params.driverHoteId;

  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
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
          // where: { id: col("reservation.driverInviteId") }, // Filtrer par driverHoteId
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
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          // where: { id: col("reservation.driverHoteId") }, // Filtrer par driverHoteId
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        driverHoteId: driverHoteId,
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

exports.getReservationByDriverInviteId = function (req, res) {
  const driverInviteId = req.params.driverInviteId;

  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
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
          // where: { id: col("reservation.driverInviteId") }, // Filtrer par driverHoteId
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
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          // where: { id: col("reservation.driverHoteId") }, // Filtrer par driverHoteId
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        driverInviteId: driverInviteId,
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

exports.updateReservation = async function (req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const [rowsUpdated] = await reservation.update(updateData, {
      where: { reservationId: id },
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const updatedReservation = await reservation.findOne({
      where: { reservationId: id },
    });

    res.status(200).json(updatedReservation);

    // Push notifications based on status transition
    const status = updateData.status;
    const guestId = updatedReservation?.driverInviteId;
    const hostId  = updatedReservation?.driverHoteId;

    if (status === "accepted" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Réservation acceptée !",
        message: "Votre demande de réservation a été acceptée par l'hôte. Bon voyage !",
        type: "reservation_accepted",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "rejected" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Réservation refusée",
        message: "L'hôte n'a pas pu accepter votre demande. Essayez un autre véhicule.",
        type: "reservation_cancelled",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "cancelled" && hostId) {
      createNotification({
        userId: hostId,
        titre: "Réservation annulée",
        message: "Le voyageur a annulé sa réservation.",
        type: "reservation_cancelled",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "paid" && hostId) {
      createNotification({
        userId: hostId,
        titre: "Paiement reçu",
        message: "Le paiement de votre voyageur a bien été validé.",
        type: "reservation_paid",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "completed" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Location terminée",
        message: "Votre location est terminée. N'oubliez pas de laisser un avis !",
        type: "system",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    }

    return;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getReservationByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  reservation
    .findAll({
      include: [
        {
          model: vehicle,
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel,
              attributes: ["id", "marque", "modele"],
            },
          ],
        },
        {
          model: UserProfile,
          as: "Host",
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
          // where: { id: col("reservation.driverInviteId") },
        },
        {
          model: UserProfile,
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverHoteId") },
        },
        {
          model: VehiculeAnnonce,
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ],
        },
      ],
      where: {
        driverInviteId: driverInviteId,
        startDate: startDate,
        endDate: endDate,
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
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getReservationByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  reservation
    .findAll({
      include: [
        {
          model: vehicle,
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel,
              attributes: ["id", "marque", "modele"],
            },
          ],
        },
        {
          model: UserProfile,
          as: "Host",
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
          // where: { id: col("reservation.driverInviteId") },
        },
        {
          model: UserProfile,
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverHoteId") },
        },
        {
          model: VehiculeAnnonce,
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ],
        },
      ],
      where: {
        driverInviteId: driverInviteId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.updateReservationsByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const reservationIdToExclude = req.query.reservationIdToExclude;

  reservation
    .update(
      {
        status: "rejected",
      },
      {
        where: {
          driverInviteId: driverInviteId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reservationId: { [Op.ne]: reservationIdToExclude },
        },
      },
    )
    .then((result) => {
      res
        .status(200)
        .json({ message: `${result} reservations updated successfully` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
