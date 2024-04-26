"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const VehicleOption = db.VehicleOption;

exports.getVehicleOptions = function (req, res) {
  VehicleOption.findAll()
    .then((VehicleOption) => {
      console.log(VehicleOption);
      if (VehicleOption) {
        res.status(200).json(VehicleOption);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({
          error: "VehicleOptions Internal server error select find all",
        });
    });
};

exports.createVehicleOption = function (req, res) {
  VehicleOption.create(req.body)
    .then((VehicleOption) => {
      console.log(VehicleOption);
      if (VehicleOption) {
        res.status(200).json(VehicleOption);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleOptions Internal server error" });
    });
};

exports.getVehicleOptionById = function (req, res) {
  const VehicleOption_id = req.params.id;

  VehicleOption.findOne({
    where: {
      vehiculeOptionId: VehicleOption_id,
    },
  })
    .then((VehicleOption) => {
      console.log(VehicleOption);
      if (VehicleOption) {
        res.status(200).json(VehicleOption);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VehicleOptions Internal server error" });
    });
};
