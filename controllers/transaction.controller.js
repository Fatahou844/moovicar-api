"use strict";

const db = require("../models/index");
const Transaction = db.Transaction;
const Reservation = db.Reservation;
const UserProfile = db.UserProfile;

// GET /api/transactions — toutes les transactions (admin)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Reservation, as: "Reservation" },
        { model: UserProfile, as: "Host", attributes: ["id", "firstName", "lastName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/transactions/host/:hostId — historique d'un propriétaire
exports.getTransactionsByHost = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { hostId: req.params.hostId },
      include: [{ model: Reservation, as: "Reservation" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/transactions/:id — une transaction
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Reservation, as: "Reservation" },
        { model: UserProfile, as: "Host", attributes: ["id", "firstName", "lastName", "email"] },
      ],
    });
    if (!transaction) return res.status(404).json({ error: "Transaction introuvable" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/transactions — créer manuellement une transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, reservationId, hostId, amount, currency, stripeTransferId, stripePayoutId, status, arrivalDate } = req.body;

    if (!type || !reservationId || !hostId || !amount) {
      return res.status(400).json({ error: "type, reservationId, hostId et amount sont requis" });
    }

    const transaction = await Transaction.create({
      type,
      reservationId,
      hostId,
      amount,
      currency: currency || "eur",
      stripeTransferId: stripeTransferId || null,
      stripePayoutId: stripePayoutId || null,
      status: status || "pending",
      arrivalDate: arrivalDate || null,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/transactions/:id — mettre à jour le statut d'une transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction introuvable" });

    const { status, stripePayoutId, arrivalDate } = req.body;

    await transaction.update({
      ...(status && { status }),
      ...(stripePayoutId && { stripePayoutId }),
      ...(arrivalDate && { arrivalDate }),
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
