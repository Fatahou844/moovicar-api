"use strict";

const db = require("../models/index");

const ReservationCarPreferences = db.ReservationCarPreferences;
const Vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getReservationCarPreferencess = function (req, res) {
  ReservationCarPreferences.findAll({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "vehiculeId",
          "description",
          "images",
          "modeleId",
          "userId",
          "kilometrage",
          "carburantType",
          "vitesseType",
          "porteNumber",
          "siegeNumber",
          "createdAt",
        ], // Sélectionnez les attributs que vous souhaitez inclure
        include: [
          {
            model: VehicleModel, // Remplacez VehicleModel par le nom de votre modèle de véhicule
            attributes: ["id", "marque", "modele"], // Sélectionnez les attributs du modèle de véhicule
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "immatriculation",
              "createdAt",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],
  })
    .then((veh) => {
      console.log(veh);
      if (veh) {
        res.status(200).json(veh);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Delivrery Internal server error select find all",
      });
    });
};

exports.createReservationCarPreferencess = function (req, res) {
  ReservationCarPreferences.create(req.body)
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "ReservationCarPreferences Internal server error" });
    });
};

exports.getReservationCarPreferencesByVehiculeId = function (req, res) {
  const vehiculeId = req.params.vehiculeId;

  ReservationCarPreferences.findOne({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "vehiculeId",
          "description",
          "images",
          "modeleId",
          "userId",
          "kilometrage",
          "carburantType",
          "vitesseType",
          "porteNumber",
          "siegeNumber",
          "createdAt",
        ], // Sélectionnez les attributs que vous souhaitez inclure
        include: [
          {
            model: VehicleModel, // Remplacez VehicleModel par le nom de votre modèle de véhicule
            attributes: ["id", "marque", "modele"], // Sélectionnez les attributs du modèle de véhicule
          },
          {
            model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
            attributes: [
              "id",
              "firstName",
              "lastName",
              "city",
              "country",
              "immatriculation",
              "createdAt",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],

    where: {
      vehiculeId: vehiculeId,
    },
  })
    .then((response) => {
      console.log(response);
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehiculeAnnonces Internal server error" });
    });
};

// exports.updateReservationCarPreferences = function (req, res) {
//   ReservationCarPreferences.findOne({
//     where: {
//       vehiculeId: parseInt(req.params.vehiculeId),
//     },
//   })
//     .then((product) => {
//       console.log(product);
//       if (product) {
//         ReservationCarPreferences.update(req.body, {
//           where: {
//             vehiculeId: parseInt(req.params.vehiculeId),
//           },
//         })
//           .then((updatedRows) => {
//             console.log(updatedRows);
//             if (updatedRows > 0) {
//               res.status(200).json({ message: "Data updated successfully" });
//             } else {
//               res.status(400).send("Error updating data");
//             }
//           })
//           .catch((updateError) => {
//             console.error(updateError);
//             res.status(500).json({ error: "Internal server error" });
//           });
//       }
//     })
//     .catch((findError) => {
//       console.error(findError);
//       res.status(500).json({ error: "Internal server error" });
//     });
// };

exports.updateReservationCarPreferences = function (req, res) {
  const vehiculeId = parseInt(req.params.vehiculeId);

  // Chercher ou créer une nouvelle préférence de réservation de voiture
  ReservationCarPreferences.findOrCreate({
    where: {
      vehiculeId: vehiculeId,
    },
    defaults: req.body, // Utiliser les données du corps de la requête comme valeurs par défaut
  })
    .then(([preference, created]) => {
      if (!created) {
        // Si la préférence existait déjà, la mettre à jour
        preference
          .update(req.body)
          .then((updatedPreference) => {
            console.log(updatedPreference);
            res.status(200).json({ message: "Data updated successfully" });
          })
          .catch((updateError) => {
            console.error(updateError);
            res.status(500).json({ error: "Internal server error" });
          });
      } else {
        console.log("New preference created:", preference);
        res.status(201).json({ message: "New preference created" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
