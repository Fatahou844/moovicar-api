"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");
const uuid = require("uuid");
const UserProfile = db.UserProfile;
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../utils/emailService");

// exports.createUserProfile = async function (req, res) {
//   UserProfile.create(req.body)
//     .then((UserProfile) => {
//       console.log(UserProfile);
//       if (UserProfile) {
//         res.status(200).json(UserProfile);
//       } else {
//         res.status(400).json(-1);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       console.log("modeleId from request:", req.body);
//       res.status(500).json({ error: "UserProfiles Internal server error" });
//     });
// };

exports.createUserProfile = async function (req, res) {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // 🔐 Hash du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = uuid.v4();

    const userProfile = await UserProfile.create({
      ...rest,
      password: hashedPassword,
      verification_token: verificationToken,
      verified: false,
    });

    await sendVerificationEmail(userProfile, verificationToken);

    if (!userProfile) {
      return res.status(400).json(-1);
    }

    // ⚠️ Ne JAMAIS renvoyer le password (même hashé)
    const userResponse = userProfile.toJSON();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    console.log("Payload reçu :", req.body);
    res.status(500).json({ error: "UserProfiles Internal server error" });
  }
};

exports.getUserProfiles = function (req, res) {
  UserProfile.findAll({
    attributes: {
      exclude: [
        "password",
        "verification_token",
        "token",
        "password_reset_token",
        "password_reset_expires",
        "googleId",
        "facebookId",
        "OpenID",

        "access_tokenPaypal",
      ],
    },
  })
    .then((UserProfile) => {
      console.log(UserProfile);
      if (UserProfile) {
        res.status(200).json(UserProfile);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "UserProfiles Internal server error" });
    });
};

exports.getUserProfileById = function (req, res) {
  const UserProfile_id = req.params.id;

  UserProfile.findOne({
    where: {
      id: UserProfile_id,
    },
    attributes: {
      exclude: [
        "password",
        "verification_token",
        "token",
        "password_reset_token",
        "password_reset_expires",
        "googleId",
        "facebookId",
        "OpenID",

        "access_tokenPaypal",
      ],
    },
  })
    .then((UserProfile) => {
      console.log(UserProfile);
      if (UserProfile) {
        res.status(200).json(UserProfile);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "UserProfiles Internal server error" });
    });
};

exports.updateUserProfile = function (req, res) {
  UserProfile.findOne({
    where: {
      id: parseInt(req.params.id),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      UserProfile.update(req.body, {
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

/* ── Calcul dynamique des taux de performance d'un hôte ── */
exports.getPerformanceRates = async function (req, res) {
  const userId = parseInt(req.params.id);
  try {
    const Reservation = db.Reservation;
    const all = await Reservation.findAll({ where: { driverHoteId: userId } });

    const total     = all.length;
    const accepted  = all.filter(r => ["accepted","paid","completed"].includes(r.status)).length;
    const completed = all.filter(r => r.status === "completed").length;
    const responded = all.filter(r => r.status !== "pending").length;

    const acceptanceRate  = total > 0 ? Math.round((accepted  / total)    * 100) : 0;
    const responseRate    = total > 0 ? Math.round((responded / total)    * 100) : 0;
    const engagementRate  = accepted > 0 ? Math.round((completed / accepted) * 100) : 0;
    const finalizedtrips  = completed;

    // Persist updated rates on the profile
    await UserProfile.update(
      { AcceptanceRate: acceptanceRate, ResponseRate: responseRate,
        EngagementRate: engagementRate, Finalizedtrips: finalizedtrips },
      { where: { id: userId } }
    );

    res.json({ acceptanceRate, responseRate, engagementRate, finalizedtrips, total, accepted, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
