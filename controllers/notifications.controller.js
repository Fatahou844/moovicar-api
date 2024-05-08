"use strict";

const db = require("../models/index");

const Notification = db.Notification;

const UserProfile = db.UserProfile;

exports.getNotifications = function (req, res) {
  Notification.findAll({
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
          "profile_url",
        ], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
  })
    .then((Notification) => {
      console.log(Notification);
      if (Notification) {
        res.status(200).json(Notification);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Notifications Internal server error" });
    });
};

exports.createNotification = async function (req, res) {
  Notification.create(req.body)
    .then((Notification) => {
      console.log(Notification);
      if (Notification) {
        res.status(200).json(Notification);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      console.log("modeleId from request:", req.body);
      res.status(500).json({ error: "Notifications Internal server error" });
    });
};

exports.getNotificationById = function (req, res) {
  const Notification_id = req.params.id;
  Notification.findOne({
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
          "profile_url",
        ], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
    where: {
      id: Notification_id,
    },
  })
    .then((Notification) => {
      console.log(Notification);
      if (Notification) {
        res.status(200).json(Notification);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Notifications Internal server error" });
    });
};

exports.updateNotification = function (req, res) {
  Notification.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      Notification.update(req.body, {
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

exports.getNotificationByUserId = function (req, res) {
  const userId = req.params.userId;

  Notification.findAll({
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
          "profile_url",
        ], // Sélectionnez les attributs que vous souhaitez inclure
      },
    ],
    where: {
      userId: userId,
    },
  })
    .then((Notification) => {
      console.log(Notification);
      if (Notification) {
        res.status(200).json(Notification);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Notifications Internal server error" });
    });
};

exports.deleteNotificationById = function (req, res) {
  const Notification_id = req.params.id;

  Notification.destroy({
    where: {
      id: Notification_id,
    },
  })
    .then((deletedRows) => {
      if (deletedRows > 0) {
        res.status(200).json({ message: "Notification deleted successfully" });
      } else {
        res.status(404).json({ error: "Notification not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
