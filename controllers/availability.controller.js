"use strict";

const db = require("../models/index");

const Availability = db.Availability;
const Vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;

exports.getAvailabilitys = function (req, res) {
  Availability.findAll({
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
        error: "Availabilitys Internal server error select find all",
      });
    });
};

exports.createAvailability = function (req, res) {
  Availability.create(req.body)
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

exports.getAvailabilityByVehiculeId = function (req, res) {
  const vehiculeId = req.params.vehiculeId;

  Availability.findAll({
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
      res.status(500).json({ error: "Availabilitys Internal server error" });
    });
};

exports.updateCustomAvailability = function (req, res) {
  Availability.findOne({
    where: {
      AvailabilityID: parseInt(req.params.AvailabilityID),
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      Availability.update(req.body, {
        where: {
          AvailabilityID: parseInt(req.params.AvailabilityID),
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

exports.updateCustomAvailabilityByWeekDAY = function (req, res) {
  Availability.findAll({
    where: {
      vehiculeId: parseInt(req.params.vehiculeId),
      WeekDAY: req.body.WeekDAY,
      type: "1",
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      Availability.update(req.body, {
        where: {
          vehiculeId: parseInt(req.params.vehiculeId),
          WeekDAY: req.body.WeekDAY,
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
      Availability.create(req.body)
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
            .json({ error: "Availabilitys Internal server error" });
        });
    }
  });
};

exports.updateDefaultAvailabilityByWeekDAY = function (req, res) {
  Availability.findAll({
    where: {
      vehiculeId: parseInt(req.params.vehiculeId),
      WeekDAY: req.body.WeekDAY,
      type: "0",
    },
  }).then((product) => {
    console.log(product);
    if (product) {
      Availability.update(req.body, {
        where: {
          vehiculeId: parseInt(req.params.vehiculeId),
          WeekDAY: req.body.WeekDAY,
          type: "0",
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
      Availability.create(req.body)
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
            .json({ error: "Availabilitys Internal server error" });
        });
    }
  });
};

exports.updateOrCreateCustomAvailability = function (req, res) {
  Availability.findOne({
    where: {
      vehiculeId: parseInt(req.params.vehiculeId),
      DateCustomise: req.body.DateCustomise,
      type: "1",
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        Availability.update(req.body, {
          where: {
            vehiculeId: parseInt(req.params.vehiculeId),
            DateCustomise: req.body.DateCustomise,
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
        Availability.create(req.body)
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

exports.updatePrincingbyDefaultVehicule = function (req, res) {
  Availability.findAll({
    where: {
      vehiculeId: parseInt(req.params.vehiculeId),
    },
  })
    .then((product) => {
      console.log(product);
      if (product) {
        Availability.update(req.body, {
          where: {
            vehiculeId: parseInt(req.params.vehiculeId),
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
      }
    })
    .catch((findError) => {
      console.error(findError);
      res.status(500).json({ error: "Internal server error" });
    });
};
