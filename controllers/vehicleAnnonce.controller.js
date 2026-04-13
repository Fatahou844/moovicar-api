"use strict";

const db = require("../models/index");
const { Op, literal } = require("sequelize");
const { sendConfirmation } = require("../services/sendConfirmation");
const { sendPushToUser } = require("../utils/sendPushToUser");

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
          "CertificatImmatriculation",
          "Assurance",
          "ControleTechnique",
          "AutorizationProprietaire",
          "principalPhotos",
          "lateralPhotos",
          "interiorPhotos",
          "IsUtilitaire",
          "CertificatImmatriculationDoc",
          "AssuranceDoc",
          "ControleTechniqueDoc",
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
              "email",
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
            req.body.EmailData.email,
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
          "CertificatImmatriculation",
          "Assurance",
          "ControleTechnique",
          "AutorizationProprietaire",
          "IsUtilitaire",
          "CertificatImmatriculationDoc",
          "AssuranceDoc",
          "ControleTechniqueDoc",
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
              "email",
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
          "CertificatImmatriculation",
          "Assurance",
          "ControleTechnique",
          "AutorizationProprietaire",
          "IsUtilitaire",
          "CertificatImmatriculationDoc",
          "AssuranceDoc",
          "ControleTechniqueDoc",
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
              "email",
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
  const radius = 100;

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
          "IsUtilitaire",
          "CertificatImmatriculationDoc",
          "AssuranceDoc",
          "ControleTechniqueDoc",
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
              "email",
            ], // Sélectionnez les attributs que vous souhaitez inclure
          },
          {
            model: VehicleModel, // Remplacez VehicleModel par le nom de votre modèle de véhicule
            attributes: ["id", "marque", "modele"], // Sélectionnez les attributs du modèle de véhicule
          },
        ],
      },
    ],
    where: literal(
      `6371 * acos(cos(radians(${centerLatitude})) * cos(radians(SUBSTRING_INDEX(locationCoordinates, ',', 1))) * cos(radians(SUBSTRING_INDEX(locationCoordinates, ',', -1)) - radians(${centerLongitude})) + sin(radians(${centerLatitude})) * sin(radians(SUBSTRING_INDEX(locationCoordinates, ',', 1)))) < ${radius}`,
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

/* ── Admin — actions sur une annonce avec notification push ── */
exports.approveAnnonce = async (req, res) => {
  try {
    const annonce = await VehiculeAnnonce.findOne({
      where: { vehiculeAnnonceId: req.params.id },
      include: [{ model: Vehicle, attributes: ["userId"] }],
    });
    if (!annonce) return res.status(404).json({ error: "Annonce introuvable" });

    await annonce.update({ status: "1" });

    const ownerId = annonce.Vehicle?.userId;
    if (ownerId) {
      await sendPushToUser(
        ownerId,
        {
          title: "Annonce approuvée",
          body: "Votre annonce est maintenant en ligne sur Moovicar !",
          link: `/account/voitures`,
        },
        req.io,
        req.userConnections
      );
    }

    res.json({ message: "Annonce approuvée", annonce });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectAnnonce = async (req, res) => {
  try {
    const annonce = await VehiculeAnnonce.findOne({
      where: { vehiculeAnnonceId: req.params.id },
      include: [{ model: Vehicle, attributes: ["userId"] }],
    });
    if (!annonce) return res.status(404).json({ error: "Annonce introuvable" });

    const reason = req.body.reason || "";
    await annonce.update({ status: "0" });

    const ownerId = annonce.Vehicle?.userId;
    if (ownerId) {
      await sendPushToUser(
        ownerId,
        {
          title: "Annonce refusée",
          body: reason
            ? `Votre annonce a été refusée : ${reason}`
            : "Votre annonce n'a pas été approuvée. Vérifiez les documents requis.",
          link: `/account/voitures`,
        },
        req.io,
        req.userConnections
      );
    }

    res.json({ message: "Annonce refusée", annonce });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.disableAnnonce = async (req, res) => {
  try {
    const annonce = await VehiculeAnnonce.findOne({
      where: { vehiculeAnnonceId: req.params.id },
      include: [{ model: Vehicle, attributes: ["userId"] }],
    });
    if (!annonce) return res.status(404).json({ error: "Annonce introuvable" });

    await annonce.update({ status: "2" });

    const ownerId = annonce.Vehicle?.userId;
    if (ownerId) {
      await sendPushToUser(
        ownerId,
        {
          title: "Annonce désactivée",
          body: "Votre annonce a été temporairement désactivée par un administrateur.",
          link: `/account/voitures`,
        },
        req.io,
        req.userConnections
      );
    }

    res.json({ message: "Annonce désactivée", annonce });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVehiculeAnnonce = function (req, res) {
  const vehiculeAnnonceId = req.params.id; // Supposons que l'identifiant est passé comme paramètre URL
  const updatedData = req.body; // Les nouvelles données de l'annonce

  VehiculeAnnonce.findOne({
    where: {
      vehiculeAnnonceId: vehiculeAnnonceId,
    },
  })
    .then((vehiculeAnnonce) => {
      if (vehiculeAnnonce) {
        return vehiculeAnnonce.update(updatedData);
      } else {
        res.status(404).json({ error: "VehiculeAnnonce not found" });
      }
    })
    .then((updatedAnnonce) => {
      if (updatedAnnonce) {
        res.status(200).json(updatedAnnonce);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
