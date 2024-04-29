"use strict";

const db = require("../models/index");
const { Op, col } = require("sequelize");
const Sequelize = require("sequelize");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const reservation = db.Reservation;
const VehiculeAnnonce = db.VehiculeAnnonce;

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
  reservation
    .create(req.body)
    .then((reserv) => {
      console.log(reserv);
      if (reserv) {
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

exports.updateReservation = function (req, res) {
  const { id } = req.params; // Récupère l'ID de la réservation à mettre à jour depuis les paramètres de la requête
  const updateData = req.body; // Récupère les données de mise à jour depuis le corps de la requête

  // Recherche la réservation par son ID et met à jour les données
  reservation
    .update(updateData, {
      where: { reservationId: id }, // Spécifiez la condition pour la mise à jour
    })
    .then((rowsUpdated) => {
      // Vérifie si des lignes ont été mises à jour avec succès
      if (rowsUpdated > 0) {
        // Si la mise à jour est réussie, renvoie les réservations mises à jour
        reservation
          .findOne({ where: { reservationId: id } })
          .then((updatedReservation) => {
            res.status(200).json(updatedReservation);
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ error: "Error fetching updated reservation" });
          });
      } else {
        // Si l'ID fourni ne correspond à aucune réservation dans la base de données, renvoie une réponse avec un code d'état 404 (Non trouvé)
        res.status(404).json({ error: "Reservation not found" });
      }
    })
    .catch((error) => {
      // Gère les erreurs potentielles
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
        status: "2",
      },
      {
        where: {
          driverInviteId: driverInviteId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reservationId: { [Op.ne]: reservationIdToExclude },
        },
      }
    )
    .then((result) => {
      if (result > 0) {
        res
          .status(200)
          .json({ message: `${result} reservations updated successfully` });
      } else {
        res.status(404).json({ message: "No reservations found to update" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
