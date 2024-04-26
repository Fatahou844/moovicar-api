"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const VehicleModel = db.VehicleModel;

exports.getVehicleModels = function (req, res) {
  VehicleModel.findAll()
    .then((VehicleModel) => {
      console.log(VehicleModel);
      if (VehicleModel) {
        res.status(200).json(VehicleModel);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleModels Internal server error" });
    });
};

exports.createVehicleModel = function (req, res) {
  VehicleModel.create(req.body)
    .then((VehicleModel) => {
      console.log(VehicleModel);
      if (VehicleModel) {
        res.status(200).json(VehicleModel);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleModels Internal server error" });
    });
};

exports.getVehicleModelById = function (req, res) {
  const VehicleModel_id = req.params.id;

  VehicleModel.findOne({
    where: {
      id: VehicleModel_id,
    },
  })
    .then((VehicleModel) => {
      console.log(VehicleModel);
      if (VehicleModel) {
        res.status(200).json(VehicleModel);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleModels Internal server error" });
    });
};

exports.getVehicleModelByBrandName = function (req, res) {
  const Marque = req.params.marque;

  VehicleModel.findAll({
    where: {
      marque: {
        [Op.like]: "%" + Marque + "%",
      },
    },
  })
    .then((vHM) => {
      console.log(vHM);
      if (vHM) {
        res.status(200).json(vHM);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleModels Internal server error" });
    });
};
