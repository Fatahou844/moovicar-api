const express = require("express");
const router = express.Router();
const db = require("../models");
const PushSubscription = db.PushSubscription;

// Clé publique VAPID à exposer au frontend
router.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: req.VAPID_PUBLIC_KEY });
});

// Enregistrer ou mettre à jour une subscription push pour l'utilisateur
router.post("/subscribe", async (req, res) => {
  const { userId, subscription } = req.body;
  if (!userId || !subscription?.endpoint) {
    return res.status(400).json({ error: "userId et subscription requis" });
  }
  try {
    await PushSubscription.upsert({
      userId,
      endpoint: subscription.endpoint,
      subscription: JSON.stringify(subscription),
    });
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur enregistrement subscription" });
  }
});

// Supprimer une subscription (désabonnement)
router.post("/unsubscribe", async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ error: "endpoint requis" });
  try {
    await PushSubscription.destroy({ where: { endpoint } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erreur suppression subscription" });
  }
});

module.exports = router;
