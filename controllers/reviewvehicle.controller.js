"use strict";

const db = require("../models/index");
const { Op, col } = require("sequelize");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const ReviewVehicle = db.ReviewVehicle;

exports.getReviewVehicles = function (req, res) {
  ReviewVehicle.findAll({
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

exports.createReviewVehicle = async function (req, res) {
  ReviewVehicle.create(req.body)
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
      res.status(500).json({ error: "ReviewVehicles Internal server error" });
    });
};

exports.getReviewVehicleById = function (req, res) {
  const ReviewVehicleId = req.params.reviewVehicleId;

  ReviewVehicle.findOne({
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
    ],
    where: {
      reviewVehicleId: ReviewVehicleId,
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

exports.getReviewVehicleByVehicleId = function (req, res) {
  const vehiculeId = req.params.vehiculeId;

  ReviewVehicle.findAll({
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
    ],
    where: {
      vehiculeId: vehiculeId,
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

exports.getReviewVehicleByDriverInviteId = function (req, res) {
  const userId = req.params.userId;

  ReviewVehicle.findAll({
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
    ],
    where: {
      userId: userId,
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

exports.updateReviewVehicle = function (req, res) {
  const { reviewVehicleId } = req.params; // Récupère l'ID de la réservation à mettre à jour depuis les paramètres de la requête
  const updateData = req.body; // Récupère les données de mise à jour depuis le corps de la requête

  // Recherche la réservation par son ID et met à jour les données
  ReviewVehicle.update(updateData, {
    where: { reviewVehicleId: reviewVehicleId }, // Spécifiez la condition pour la mise à jour
  })
    .then((rowsUpdated) => {
      // Vérifie si des lignes ont été mises à jour avec succès
      if (rowsUpdated > 0) {
        // Si la mise à jour est réussie, renvoie les réservations mises à jour
        res.status(200).json(rowsUpdated);
      } else {
        // Si l'ID fourni ne correspond à aucune réservation dans la base de données, renvoie une réponse avec un code d'état 404 (Non trouvé)
        res.status(404).json({ error: "ReviewVehicle not found" });
      }
    })
    .catch((error) => {
      // Gère les erreurs potentielles
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
