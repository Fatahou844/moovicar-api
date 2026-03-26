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
