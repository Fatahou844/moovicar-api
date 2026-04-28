"use strict";

const db = require("../models/index");
const { Op, col } = require("sequelize");
const Sequelize = require("sequelize");
const { createNotification } = require("../services/notificationService");

const PREAVIS_HOURS = [1, 2, 3, 6, 12, 24, 48];
const MIN_DAYS_MAP = [0, 1, 2, 3, 5];
const MAX_DAYS_MAP = [5, 7, 14, 30, 90, Infinity];

const vehicle = db.Vehicle;
const VehicleModel = db.VehicleModel;
const UserProfile = db.UserProfile;
const reservation = db.Reservation;
const VehiculeAnnonce = db.VehiculeAnnonce;
const ReservationGains = db.ReservationGains;
const Paiements = db.Paiements;

exports.getreservations = function (req, res) {
  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
              attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
            },
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: UserProfile,
          as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
        },
        {
          model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
    })
    .then((demandes) => {
      console.log(demandes);
      if (demandes) {
        res.status(200).json(demandes);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.createreservation = async function (req, res) {
  try {
    // ── Validate against host reservation preferences ──
    const { vehiculeAnnonceId, startDate, endDate } = req.body;
    if (vehiculeAnnonceId && startDate && endDate) {
      const annonce = await db.VehiculeAnnonce.findOne({
        where: { vehiculeAnnonceId },
      });
      if (annonce?.vehiculeId) {
        const prefs = await db.ReservationCarPreferences.findOne({
          where: { vehiculeId: annonce.vehiculeId },
        });
        if (prefs) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const now = new Date();
          const durationDays = Math.round((end - start) / 86400000);
          const hoursUntil = (start - now) / 3600000;

          const preavisHours = PREAVIS_HOURS[parseInt(prefs.home_preavis)] ?? 1;
          if (hoursUntil < preavisHours) {
            return res.status(422).json({
              error: `Préavis insuffisant. L'hôte demande au moins ${preavisHours}h d'avance.`,
            });
          }

          const minDays =
            MIN_DAYS_MAP[parseInt(prefs.home_minDureeVoyage)] ?? 0;
          if (minDays > 0 && durationDays < minDays) {
            return res.status(422).json({
              error: `Durée minimum : ${minDays} jour(s).`,
            });
          }

          const maxDays =
            MAX_DAYS_MAP[parseInt(prefs.home_maxDureeVoyage)] ?? Infinity;
          if (durationDays > maxDays) {
            return res.status(422).json({
              error: `Durée maximum : ${maxDays} jour(s).`,
            });
          }
        }
      }
    }

    // ── Blocage chevauchement de réservation active ──
    if (vehiculeAnnonceId && startDate && endDate) {
      const annonce = await db.VehiculeAnnonce.findOne({
        where: { vehiculeAnnonceId },
      });
      if (annonce?.vehiculeId) {
        const BLOCKING = [
          "accepted",
          "paid",
          "checkin_pending_validation",
          "in_progress",
        ];
        const conflict = await reservation.findOne({
          where: {
            vehiculeId: annonce.vehiculeId,
            status: { [Op.in]: BLOCKING },
            startDate: { [Op.lt]: new Date(endDate) },
            endDate: { [Op.gt]: new Date(startDate) },
          },
        });
        if (conflict) {
          return res.status(409).json({
            error:
              "Ce véhicule est déjà réservé sur cette période. Veuillez choisir d'autres dates.",
          });
        }
      }
    }

    const reserv = await reservation.create(req.body);
    if (!reserv) return res.status(400).json(-1);

    res.status(200).json(reserv);

    // Notify host about new reservation request
    if (reserv.driverHoteId) {
      createNotification({
        userId: reserv.driverHoteId,
        titre: "Nouvelle demande de réservation",
        message:
          "Un voyageur souhaite louer votre véhicule. Consultez votre espace hôte.",
        type: "reservation_new",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    }
  } catch (error) {
    console.error(error);
    console.log("modeleId from request:", req.body);
    res.status(500).json({ error: "reservations Internal server error" });
  }
};

// GET /reservations/check-availability/:vehiculeId?startDate=...&endDate=...
exports.checkAvailability = async function (req, res) {
  try {
    const { vehiculeId } = req.params;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate et endDate sont requis." });
    }

    const BLOCKING = [
      "accepted",
      "paid",
      "checkin_pending_validation",
      "in_progress",
    ];
    const conflict = await reservation.findOne({
      where: {
        vehiculeId: parseInt(vehiculeId),
        status: { [Op.in]: BLOCKING },
        startDate: { [Op.lt]: new Date(endDate) },
        endDate: { [Op.gt]: new Date(startDate) },
      },
      attributes: ["reservationId", "startDate", "endDate", "status"],
    });

    if (conflict) {
      return res.json({
        available: false,
        conflict: {
          startDate: conflict.startDate,
          endDate: conflict.endDate,
          status: conflict.status,
        },
      });
    }
    return res.json({ available: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationById = function (req, res) {
  const reservationId = req.params.id;

  reservation
    .findOne({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
              attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
            },
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: UserProfile,
          as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
        },
        {
          model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        reservationId: reservationId,
      },
    })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.getReservationByDriverHoteId = function (req, res) {
  const driverHoteId = req.params.driverHoteId;

  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
              attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
            },
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: UserProfile,
          as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverInviteId") }, // Filtrer par driverHoteId
        },
        {
          model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          // where: { id: col("reservation.driverHoteId") }, // Filtrer par driverHoteId
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        driverHoteId: driverHoteId,
      },
    })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.getReservationByDriverInviteId = function (req, res) {
  const driverInviteId = req.params.driverInviteId;

  reservation
    .findAll({
      include: [
        {
          model: vehicle, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel, // Remplacez Vehicule par le nom de votre modèle de véhicule
              attributes: ["id", "marque", "modele"], // Sélectionnez les attributs que vous souhaitez inclure
            },
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: UserProfile,
          as: "Host", // Remplacez Vehicule par le nom de votre modèle de véhicu
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverInviteId") }, // Filtrer par driverHoteId
        },
        {
          model: UserProfile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          // where: { id: col("reservation.driverHoteId") }, // Filtrer par driverHoteId
        },

        {
          model: VehiculeAnnonce, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ], // Sélectionnez les attributs que vous souhaitez inclure
        },
      ],
      where: {
        driverInviteId: driverInviteId,
      },
    })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "vehicles Internal server error" });
    });
};

exports.updateReservation = async function (req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const [rowsUpdated] = await reservation.update(updateData, {
      where: { reservationId: id },
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const updatedReservation = await reservation.findOne({
      where: { reservationId: id },
    });

    res.status(200).json(updatedReservation);

    // Push notifications based on status transition
    const status = updateData.status;
    const guestId = updatedReservation?.driverInviteId;
    const hostId = updatedReservation?.driverHoteId;

    if (status === "accepted" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Réservation acceptée !",
        message:
          "Votre demande de réservation a été acceptée par l'hôte. Bon voyage !",
        type: "reservation_accepted",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "rejected" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Réservation refusée",
        message:
          "L'hôte n'a pas pu accepter votre demande. Essayez un autre véhicule.",
        type: "reservation_cancelled",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "cancelled" && hostId) {
      createNotification({
        userId: hostId,
        titre: "Réservation annulée",
        message: "Le voyageur a annulé sa réservation.",
        type: "reservation_cancelled",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "paid" && hostId) {
      createNotification({
        userId: hostId,
        titre: "Paiement reçu",
        message: "Le paiement de votre voyageur a bien été validé.",
        type: "reservation_paid",
        link: `/host/reservations`,
        io: req.io,
      }).catch(console.error);
    } else if (status === "completed" && guestId) {
      createNotification({
        userId: guestId,
        titre: "Location terminée",
        message:
          "Votre location est terminée. N'oubliez pas de laisser un avis !",
        type: "system",
        link: `/reservations`,
        io: req.io,
      }).catch(console.error);
    }

    return;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getReservationByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  reservation
    .findAll({
      include: [
        {
          model: vehicle,
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel,
              attributes: ["id", "marque", "modele"],
            },
          ],
        },
        {
          model: UserProfile,
          as: "Host",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverInviteId") },
        },
        {
          model: UserProfile,
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverHoteId") },
        },
        {
          model: VehiculeAnnonce,
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ],
        },
      ],
      where: {
        driverInviteId: driverInviteId,
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getReservationByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  reservation
    .findAll({
      include: [
        {
          model: vehicle,
          attributes: ["id", "description", "images", "principalPhotos"],
          include: [
            {
              model: VehicleModel,
              attributes: ["id", "marque", "modele"],
            },
          ],
        },
        {
          model: UserProfile,
          as: "Host",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "immatriculation",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverInviteId") },
        },
        {
          model: UserProfile,
          as: "Invite",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "city",
            "country",
            "profile_url",
            "PermisConduireDoc",
            "PieceIdentityDoc",
            "ImmatriculationDoc",
          ],
          // where: { id: col("reservation.driverHoteId") },
        },
        {
          model: VehiculeAnnonce,
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "vehiculeId",
            "minDistanceInclus",
            "distanceOutMin",
            "locationAddress",
            "locationCoordinates",
            "status",
          ],
        },
      ],
      where: {
        driverInviteId: driverInviteId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })
    .then((demande) => {
      console.log(demande);
      if (demande) {
        res.status(200).json(demande);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.updateReservationsByDriverInviteIdAndDates = function (req, res) {
  const driverInviteId = req.params.driverInviteId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const reservationIdToExclude = req.query.reservationIdToExclude;

  reservation
    .update(
      {
        status: "rejected",
      },
      {
        where: {
          driverInviteId: driverInviteId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reservationId: { [Op.ne]: reservationIdToExclude },
        },
      },
    )
    .then((result) => {
      res
        .status(200)
        .json({ message: `${result} reservations updated successfully` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};
