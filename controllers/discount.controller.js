"use strict";

const db = require("../models/index");

const Discounts = db.Discounts;
const Vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getDiscountss = function (req, res) {
  Discounts.findAll({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "vehiculeId",
          "description",
          "images",
          "modeleId",
          "userId",
          "kilometrage",
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
        error: "Discountss Internal server error select find all",
      });
    });
};

exports.createDiscounts = function (req, res) {
  Discounts.create(req.body)
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
      res.status(500).json({ error: "Discountss Internal server error" });
    });
};

exports.getDiscountsByVehiculeId = function (req, res) {
  const vehiculeId = req.params.vehiculeId;

  Discounts.findAll({
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
              "profile_url",
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
      res.status(500).json({ error: "Discountss Internal server error" });
    });
};

exports.updateOrCreateDiscounts = function (req, res) {
  Discounts.findOne({
    where: {
      vehiculeId: parseInt(req.params.vehiculeId),
      reservation_duration: req.body.reservation_duration,
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        Discounts.update(req.body, {
          where: {
            vehiculeId: parseInt(req.params.vehiculeId),
            reservation_duration: req.body.reservation_duration,
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
      } else {
        Discounts.create(req.body)
          .then((createdRow) => {
            console.log(createdRow);
            if (createdRow) {
              res.status(200).json({ message: "Data created successfully" });
            } else {
              res.status(400).json({ error: "Error creating data" });
            }
          })
          .catch((createError) => {
            console.error(createError);
            res.status(500).json({ error: "Internal server error" });
          });
      }
    })
    .catch((findError) => {
      console.error(findError);
      res.status(500).json({ error: "Internal server error" });
    });
};
