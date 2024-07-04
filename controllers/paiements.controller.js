const db = require("../models/index");
const { Op, col } = require("sequelize");
const Sequelize = require("sequelize");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const reservation = db.Reservation;
const VehiculeAnnonce = db.VehiculeAnnonce;
const Paiements = db.Paiements;

exports.getPaiements = function (req, res) {
  Paiements.findAll({
    include: [
      {
        model: reservation,
        attributes: [
          "reservationId",
          "vehiculeId",
          "status",
          "PaymentIntentId",
        ],
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
              "email",
              "stripeAccountId",
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
              "email",
              "stripeAccountId",
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

exports.updatePaiement = function (req, res) {
  const { id } = req.params; // Récupère l'ID de la réservation à mettre à jour depuis les paramètres de la requête
  const updateData = req.body; // Récupère les données de mise à jour depuis le corps de la requête

  // Recherche la réservation par son ID et met à jour les données
  Paiements.update(updateData, {
    where: { id: id }, // Spécifiez la condition pour la mise à jour
  })
    .then((rowsUpdated) => {
      // Vérifie si des lignes ont été mises à jour avec succès
      if (rowsUpdated > 0) {
        // Si la mise à jour est réussie, renvoie les réservations mises à jour
        Paiements.findOne({ where: { id: id } })
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
