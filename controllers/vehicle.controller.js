"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getvehicles = function (req, res) {
  vehicle
    .findAll({
      include: [
        {
          model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
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
            "profile_url",
            "AcceptanceRate",
            "EvaluationNumber",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
    })
    .then((vehicle) => {
      console.log(vehicle);
      if (vehicle) {
        res.status(200).json(vehicle);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.createvehicle = async function (req, res) {
  vehicle
    .create(req.body)
    .then((vehicle) => {
      console.log(vehicle);
      if (vehicle) {
        res.status(200).json(vehicle);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      console.log("modeleId from request:", req.body);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.getvehicleById = function (req, res) {
  const vehicle_id = req.params.id;

  vehicle
    .findOne({
      include: [
        {
          model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
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
            "profile_url",
            "AcceptanceRate",
            "EvaluationNumber",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        id: vehicle_id,
      },
    })
    .then((vehicle) => {
      console.log(vehicle);
      if (vehicle) {
        res.status(200).json(vehicle);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.updatevehicle = function (req, res) {
  vehicle
    .findOne({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((product) => {
      console.log(product);
      if (product) {
        vehicle
          .update(req.body, {
            where: {
              id: parseInt(req.params.id),
            },
          })
          .then((p) => {
            console.log(p);
            if (p) {
              res.status(200).json(p);
            }
            //if user not created, send error
            else {
              res.status(400).send("error updated data");
            }
          });
      }
      //if user not created, send error
      else {
        res.status(400).send("error updated data");
      }
    });
};

exports.getvehicleByUserId = function (req, res) {
  const userId = req.params.userId;

  vehicle
    .findAll({
      include: [
        {
          model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
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
            "profile_url",
            "AcceptanceRate",
            "EvaluationNumber",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        userId: userId,
      },
    })
    .then((vehicle) => {
      console.log(vehicle);
      if (vehicle) {
        res.status(200).json(vehicle);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.deleteVehicleById = function (req, res) {
  const vehicle_id = req.params.id;

  vehicle
    .destroy({
      where: {
        id: vehicle_id,
      },
    })
    .then((deletedRows) => {
      if (deletedRows > 0) {
        res.status(200).json({ message: "Vehicle deleted successfully" });
      } else {
        res.status(404).json({ error: "Vehicle not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.updateVehicleById = function (req, res) {
  const vehicle_id = req.params.id;
  const updatedData = req.body; // Les données de mise à jour sont envoyées dans le corps de la requête

  vehicle
    .findOne({
      where: {
        id: vehicle_id,
      },
    })
    .then((vehicle) => {
      if (vehicle) {
        return vehicle.update(updatedData);
      } else {
        res.status(404).json({ error: "Vehicle not found" });
      }
    })
    .then((updatedVehicle) => {
      res.status(200).json(updatedVehicle);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
