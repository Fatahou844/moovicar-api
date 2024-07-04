"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const UserProfile = db.UserProfile;

exports.createUserProfile = async function (req, res) {
  UserProfile.create(req.body)
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
      console.log("modeleId from request:", req.body);
      res.status(500).json({ error: "UserProfiles Internal server error" });
    });
};

exports.getUserProfiles = function (req, res) {
  UserProfile.findAll()
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
