"use strict";

const db = require("../models/index");
const Sequelize = require("sequelize");

const HoteAvailabilities = db.HoteAvailabilities;
const UserProfile = db.UserProfile;
const CustomAvailability = db.CustomAvailability;

exports.getHoteAvailabilitiess = function (req, res) {
  HoteAvailabilities.findAll({
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
        error: "HoteAvailabilitiess Internal server error select find all",
      });
    });
};

exports.getAvailabilityByUserId = function (req, res) {
  const userId = req.params.userId;

  HoteAvailabilities.findAll({
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

exports.createHoteAvailabilities = function (req, res) {
  const { userId, Weekday, ModeAvailability } = req.body;

  // Recherche d'une disponibilité existante avec le même userId et Weekday
  HoteAvailabilities.findOne({ where: { userId, Weekday, ModeAvailability } })
    .then((existingAvailability) => {
      if (existingAvailability) {
        // Si une disponibilité existe déjà pour cet hôte et ce Weekday, mettez à jour
        return existingAvailability.update(req.body);
      } else {
        // Si aucune disponibilité n'existe pour cet hôte et ce Weekday, créez-en une nouvelle
        return HoteAvailabilities.create(req.body);
      }
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
      res.status(500).json({ error: "Internal server error" });
    });
};

// exports.createHoteAvailabilities = function (req, res) {
//   HoteAvailabilities.create(req.body)
//     .then((response) => {
//       console.log(response);
//       if (response) {
//         res.status(200).json(response);
//       } else {
//         res.status(400).json(-1);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "HoteAvailabilitiess Internal server error" });
//     });
// };

exports.updateHoteAvailabilitiesByWeedDayAndUserId = function (req, res) {
  HoteAvailabilities.findOne({
    where: {
      userId: parseInt(req.params.userId),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      HoteAvailabilities.update(req.body, {
        where: {
          Weekday: parseInt(req.params.Weekday),
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

exports.updateHoteAvailabilitiesByUserId = function (req, res) {
  HoteAvailabilities.findAll({
    where: {
      userId: parseInt(req.params.userId),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      HoteAvailabilities.update(req.body, {
        where: {
          userId: parseInt(req.params.userId),
          ModeAvailability: req.body.ModeAvailability,
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

exports.updateHoteAvailabilitiesByUserId2 = function (req, res) {
  // Convertissez chaque entier en jour de la semaine avec la fonction convertToWeekdays
  HoteAvailabilities.findAll({
    where: {
      userId: parseInt(req.params.userId),
      ModeAvailability: req.body.ModeAvailability,
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        HoteAvailabilities.update(
          {
            ModeAvailability: req.body.ModeAvailability,
            startTime: req.body.startTime || "00:00",
            endTime: req.body.endTime || "23:59",
          },
          {
            where: {
              userId: parseInt(req.params.userId),
              ModeAvailability: req.body.ModeAvailability,
              Weekday: {
                [Sequelize.Op.in]: req.body.Weekday,
              },
            },
          }
        ).then((p) => {
          console.log(p);
          if (p) {
            res.status(200).json(p);
          }
          // Si la mise à jour échoue, envoyer une erreur
          else {
            res.status(400).send("Error updating data");
          }
        });
      }
      // Si aucun produit correspondant n'est trouvé, envoyer une erreur
      else {
        res.status(400).send("No data found for the given user ID");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
};

exports.updateHoteAvailabilitiesByUserId3 = function (req, res) {
  // Convertissez chaque entier en jour de la semaine avec la fonction convertToWeekdays
  HoteAvailabilities.findAll({
    where: {
      userId: parseInt(req.params.userId),
      ModeAvailability: req.body.ModeAvailability,
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        HoteAvailabilities.update(
          {
            startTime: req.body.startTime,
            endTime: req.body.endTime,
          },
          {
            where: {
              userId: parseInt(req.params.userId),
              ModeAvailability: req.body.ModeAvailability,
              Weekday: req.body.Weekday,
            },
          }
        ).then((p) => {
          console.log(p);
          if (p) {
            res.status(200).json(p);
          }
          // Si la mise à jour échoue, envoyer une erreur
          else {
            res.status(400).send("Error updating data");
          }
        });
      }
      // Si aucun produit correspondant n'est trouvé, envoyer une erreur
      else {
        res.status(400).send("No data found for the given user ID");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
};

/**
 * GET /hoteavailabilities/:userId/for-date?date=YYYY-MM-DD&mode=0
 * Returns effective availability window for a date (custom > weekly > default).
 */
exports.getForDate = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { date, mode = "0" } = req.query;
  if (!date) return res.status(400).json({ message: "Paramètre date requis (YYYY-MM-DD)" });

  try {
    if (CustomAvailability) {
      const custom = await CustomAvailability.findOne({ where: { userId, specificDate: date } });
      if (custom) {
        return res.json({ startTime: custom.startTime.slice(0,5), endTime: custom.endTime.slice(0,5), label: custom.label, source: "custom" });
      }
    }
    const d = new Date(date + "T12:00:00Z");
    const jsDay = d.getUTCDay();
    const weekday = String(jsDay === 0 ? 6 : jsDay - 1);
    const weekly = await HoteAvailabilities.findOne({ where: { userId, Weekday: weekday, ModeAvailability: mode } });
    if (!weekly) return res.json({ startTime: "00:00", endTime: "23:30", source: "none" });
    if (weekly.alwaysAvailable) return res.json({ startTime: "00:00", endTime: "23:30", source: "always" });
    return res.json({ startTime: (weekly.startTime||"00:00:00").slice(0,5), endTime: (weekly.endTime||"23:30:00").slice(0,5), source: "weekly" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /hoteavailabilities/:userId/weekly?mode=0
 * Full weekly schedule for display on listing page.
 */
exports.getWeeklySchedule = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { mode = "0" } = req.query;
  try {
    const rows = await HoteAvailabilities.findAll({ where: { userId, ModeAvailability: mode }, order: [["Weekday","ASC"]] });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
