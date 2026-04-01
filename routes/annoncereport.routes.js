"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../models/index");
const logger = require("../logger");

const auth = passport.authenticate("user-jwt", { session: false });

// POST /api/annonce-reports — signaler une annonce
router.post("/", auth, async (req, res) => {
  try {
    const { annonceId, reason, details } = req.body;
    const reporterId = req.user.id;

    // Empêcher de signaler deux fois la même annonce
    const existing = await db.AnnonceReport.findOne({
      where: { annonceId, reporterId },
    });
    if (existing)
      return res
        .status(409)
        .json({ error: "Vous avez déjà signalé cette annonce." });

    const report = await db.AnnonceReport.create({
      annonceId,
      reporterId,
      reason,
      details,
    });
    logger.info(
      `Annonce ${annonceId} signalée par user ${reporterId} — raison: ${reason}`,
    );
    res.status(201).json(report);
  } catch (err) {
    logger.error("Erreur signalement annonce:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/annonce-reports — liste admin (tous les signalements)
router.get("/", auth, async (req, res) => {
  try {
    const reports = await db.AnnonceReport.findAll({
      include: [
        {
          model: db.VehiculeAnnonce,
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationAddress",
          ],
        },
        {
          model: db.UserProfile,
          as: "Reporter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/annonce-reports/:id — admin : traiter un signalement
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const [updated] = await db.AnnonceReport.update(
      { status, adminNote },
      { where: { id: req.params.id } },
    );
    if (!updated)
      return res.status(404).json({ error: "Signalement introuvable" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
