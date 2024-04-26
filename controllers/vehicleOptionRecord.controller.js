"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const VehicleOptionRecord = db.VehicleOptionRecord;
const VehicleOption = db.VehicleOption;
const vehicle = db.Vehicle;

exports.getVehicleOptionRecords = function (req, res) {
  VehicleOptionRecord.findAll({
    include: [
      {
        model: VehicleOption, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["vehiculeOptionId", "name"], // Sélectionnez les attributs que vous souhaitez inclure
      },
      {
        model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["vehiculeId", "description"], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
  })
    .then((VehicleOptionRecord) => {
      console.log(VehicleOptionRecord);
      if (VehicleOptionRecord) {
        res.status(200).json(VehicleOptionRecord);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "VehicleOptionRecords Internal server error select find all",
      });
    });
};

exports.createVehicleOptionRecord = function (req, res) {
  VehicleOptionRecord.create(req.body)
    .then((VehicleOptionRecord) => {
      console.log(VehicleOptionRecord);
      if (VehicleOptionRecord) {
        res.status(200).json(VehicleOptionRecord);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "VehicleOptionRecords Internal server error" });
    });
};

exports.getVehicleOptionRecordById = function (req, res) {
  const VehicleOptionRecord_id = req.params.id;

  VehicleOptionRecord.findOne({
    where: {
      vehiculeOptionId: VehicleOptionRecord_id,
    },
  })
    .then((VehicleOptionRecord) => {
      console.log(VehicleOptionRecord);
      if (VehicleOptionRecord) {
        res.status(200).json(VehicleOptionRecord);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "VehicleOptionRecords Internal server error" });
    });
};

exports.getVehicleOptionRecordByVehicleId = function (req, res) {
  const VehicleId = req.params.vehicleId;

  VehicleOptionRecord.findAll({
    include: [
      {
        model: VehicleOption, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["vehiculeOptionId", "name"], // Sélectionnez les attributs que vous souhaitez inclure
      },
      {
        model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: ["vehiculeId", "description"], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
    where: {
      vehiculeId: VehicleId,
    },
    distinct: true,
  })
    .then((VehicleOptionRecord) => {
      console.log(VehicleOptionRecord);
      if (VehicleOptionRecord) {
        res.status(200).json(VehicleOptionRecord);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "VehicleOptionRecords Internal server error" });
    });
};
