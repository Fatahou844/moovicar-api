"use strict";

const express = require("express");
const router  = express.Router();
const { runPayoutBatch } = require("../services/nodeCronPayoutHotes");

/**
 * POST /api/admin/payout-batch
 * Déclenche manuellement le virement en masse des hôtes.
 * À protéger par authentification admin en production.
 */
router.post("/", async (req, res) => {
  try {
    const report = await runPayoutBatch();
    res.json({
      message: "Batch de virements terminé",
      report,
    });
  } catch (err) {
    console.error("[Payout Batch Route] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
