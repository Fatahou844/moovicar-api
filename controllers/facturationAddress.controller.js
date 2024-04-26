"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const FacturationAddress = db.FacturationAddress;
const UserProfile = db.UserProfile;

exports.getFacturationAddresss = function (req, res) {
  FacturationAddress.findAll({
    include: [
      {
        model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "firstName",
          "lastName",
          "city",
          "country",
          "immatriculation",
        ], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
  })
    .then((FacturationAddress) => {
      console.log(FacturationAddress);
      if (FacturationAddress) {
        res.status(200).json(FacturationAddress);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "FacturationAddresss Internal server error" });
    });
};

exports.createFacturationAddress = async function (req, res) {
  FacturationAddress.create(req.body)
    .then((FacturationAddress) => {
      console.log(FacturationAddress);
      if (FacturationAddress) {
        res.status(200).json(FacturationAddress);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      console.log("modeleId from request:", req.body);
      res
        .status(500)
        .json({ error: "FacturationAddresss Internal server error" });
    });
};

exports.getFacturationAddressById = function (req, res) {
  const FacturationAddress_id = req.params.id;

  FacturationAddress.findOne({
    include: [
      {
        model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "firstName",
          "lastName",
          "city",
          "country",
          "immatriculation",
        ], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
    where: {
      id: FacturationAddress_id,
    },
  })
    .then((FacturationAddress) => {
      console.log(FacturationAddress);
      if (FacturationAddress) {
        res.status(200).json(FacturationAddress);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "FacturationAddresss Internal server error" });
    });
};

exports.updateFacturationAddress = function (req, res) {
  FacturationAddress.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      FacturationAddress.update(req.body, {
        where: {
          id: parseInt(req.params.id),
        },
      }).then((p) => {
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
