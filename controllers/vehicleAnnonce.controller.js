"use strict";

const db = require("../models/index");
const { Op, literal } = require("sequelize");
const { sendConfirmation } = require("../services/sendConfirmation");

const VehiculeAnnonce = db.VehiculeAnnonce;
const Vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getVehiculeAnnonces = function (req, res) {
  VehiculeAnnonce.findAll({
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
              "AcceptanceRate",
              "ResponseRate",
              "EngagementRate",
              "EvaluationNumber",
              "Finalizedtrips",
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
        error: "VehiculeAnnonces Internal server error select find all",
      });
    });
};

exports.createVehiculeAnnonce = function (req, res) {
  VehiculeAnnonce.create(req.body.Annonce)
    .then((response) => {
      console.log(response);
      if (response) {
        const fetchSendEmail = async () => {
          sendConfirmation(
            req.body.EmailData.nom,
            req.body.EmailData.prenom,
            req.body.EmailData.Linkurl,
            req.body.EmailData.email
          );
        };
        fetchSendEmail();

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

exports.getVehiculeAnnonceById = function (req, res) {
  const VehiculeAnnonce_id = req.params.id;

  VehiculeAnnonce.findOne({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "vehiculeId",
          "description",
          "images",
          "principalPhotos",
          "lateralPhotos",
          "interiorPhotos",
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
              "AcceptanceRate",
              "ResponseRate",
              "EngagementRate",
              "EvaluationNumber",
              "Finalizedtrips",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],

    where: {
      vehiculeAnnonceId: VehiculeAnnonce_id,
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

exports.getVehiculeAnnonceByVehiculeId = function (req, res) {
  const vehiculeId = req.params.vehiculeId;

  VehiculeAnnonce.findAll({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "vehiculeId",
          "description",
          "images",
          "principalPhotos",
          "lateralPhotos",
          "interiorPhotos",
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
              "AcceptanceRate",
              "ResponseRate",
              "EngagementRate",
              "EvaluationNumber",
              "Finalizedtrips",
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

exports.getVehiculeAnnoncesByCoordCenters = function (req, res) {
  const centerLatitude = req.query.latitude;
  const centerLongitude = req.query.longitude;
  const radius = 20;

  VehiculeAnnonce.findAll({
    include: [
      {
        model: Vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
        attributes: [
          "id",
          "vehiculeId",
          "description",
          "images",
          "principalPhotos",
          "lateralPhotos",
          "interiorPhotos",
          "modeleId",
          "userId",
          "kilometrage",
        ], // Sélectionnez les attributs que vous souhaitez inclure
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
              "AcceptanceRate",
              "ResponseRate",
              "EngagementRate",
              "EvaluationNumber",
              "Finalizedtrips",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
        ],
      },
    ],
    where: literal(
      `6371 * acos(cos(radians(${centerLatitude})) * cos(radians(SUBSTRING_INDEX(locationCoordinates, ',', 1))) * cos(radians(SUBSTRING_INDEX(locationCoordinates, ',', -1)) - radians(${centerLongitude})) + sin(radians(${centerLatitude})) * sin(radians(SUBSTRING_INDEX(locationCoordinates, ',', 1)))) < ${radius}`
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
