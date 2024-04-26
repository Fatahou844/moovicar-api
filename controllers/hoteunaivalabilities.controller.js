"use strict";

const db = require("../models/index");

const HoteUnavailabilities = db.HoteUnavailabilities;
const UserProfile = db.UserProfile;

exports.getHoteUnavailabilitiess = function (req, res) {
  HoteUnavailabilities.findAll({
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
        error: "HoteUnavailabilitiess Internal server error select find all",
      });
    });
};

exports.getUnAvailabilityByUserId = function (req, res) {
  const userId = req.params.userId;

  HoteUnavailabilities.findAll({
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
      userId: userId,
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
      res.status(500).json({ error: "Availabilitys Internal server error" });
    });
};

exports.createHoteUnavailabilities = function (req, res) {
  HoteUnavailabilities.create(req.body)
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
        .json({ error: "HoteUnavailabilitiess Internal server error" });
    });
};

exports.updateHoteUnavailabilitiesByUserId = function (req, res) {
  HoteUnavailabilities.findAll({
    where: {
      userId: parseInt(req.params.userId),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      HoteUnavailabilities.update(req.body, {
        where: {
          userId: parseInt(req.params.userId),
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

exports.updateHoteUnavailabilitiesById = function (req, res) {
  HoteUnavailabilities.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      HoteUnavailabilities.update(req.body, {
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
