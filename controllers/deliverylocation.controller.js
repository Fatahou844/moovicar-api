"use strict";

const db = require("../models/index");
const { Op, literal } = require("sequelize");

const DeliveryLocation = db.DeliveryLocation;
const VehiculeAnnonce = db.VehiculeAnnonce;
const Vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getDeliveryLocations = function (req, res) {
  DeliveryLocation.findAll({
    include: [
      {
        model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["reservationPrice", "locationMode", "vehiculeId"], // Sélectionnez les attributs que vous souhaitez inclure
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

exports.createDeleveryLocation = function (req, res) {
  DeliveryLocation.create(req.body)
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
      res.status(500).json({ error: "DeliveryLocation Internal server error" });
    });
};

exports.getDeliveryLocationByAnnonceId = function (req, res) {
  const annonceId = req.params.annonceId;

  DeliveryLocation.findAll({
    include: [
      {
        model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["reservationPrice", "locationMode", "vehiculeId"], // Sélectionnez les attributs que vous souhaitez inclure
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
      },
    ],

    where: {
      annonceId: annonceId,
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

exports.getDeliveryLocationsByCoordCenters = function (req, res) {
  const centerLatitude = req.query.latitude;
  const centerLongitude = req.query.longitude;
  const radius = 20;

  DeliveryLocation.findAll({
    include: [
      {
        model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["reservationPrice", "locationMode", "vehiculeId"], // Sélectionnez les attributs que vous souhaitez inclure
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
      },
    ],
    where: literal(
      `6371 * acos(cos(radians(${centerLatitude})) * cos(radians(SUBSTRING_INDEX(locationCoords, ',', 1))) * cos(radians(SUBSTRING_INDEX(locationCoords, ',', -1)) - radians(${centerLongitude})) + sin(radians(${centerLatitude})) * sin(radians(SUBSTRING_INDEX(locationCoords, ',', 1)))) < ${radius}`
    ),
  })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.updateDeliveryLocation = function (req, res) {
  DeliveryLocation.findOne({
    where: {
      annonceId: parseInt(req.params.annonceId),
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        DeliveryLocation.update(req.body, {
          where: {
            annonceId: parseInt(req.params.annonceId),
          },
        })
          .then((updatedRows) => {
            console.log(updatedRows);
            if (updatedRows > 0) {
              res.status(200).json({ message: "Data updated successfully" });
            } else {
              res.status(400).send("Error updating data");
            }
          })
          .catch((updateError) => {
            console.error(updateError);
            res.status(500).json({ error: "Internal server error" });
          });
      }
    })
    .catch((findError) => {
      console.error(findError);
      res.status(500).json({ error: "Internal server error" });
    });
};
