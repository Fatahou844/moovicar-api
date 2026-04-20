"use strict";

const db = require("../models/index");
const { Op } = require("sequelize");

const CustomAvailability = db.CustomAvailability;

exports.getByUserId = async (req, res) => {
  try {
    const slots = await CustomAvailability.findAll({
      where: { userId: req.params.userId },
      order: [["specificDate", "ASC"], ["startTime", "ASC"]],
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { userId, specificDate, startTime, endTime, label } = req.body;

  if (!userId || !specificDate || !startTime || !endTime) {
    return res.status(400).json({ message: "userId, specificDate, startTime et endTime sont requis" });
  }

  // Prevent exact duplicate on same date + same times
  const existing = await CustomAvailability.findOne({
    where: { userId, specificDate, startTime, endTime },
  });
  if (existing) {
    return res.status(409).json({ message: "Un créneau identique existe déjà pour cette date" });
  }

  try {
    const slot = await CustomAvailability.create({ userId, specificDate, startTime, endTime, label: label || null });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await CustomAvailability.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Créneau introuvable" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Used by reservation flow: get all future custom slots for a user
exports.getFutureByUserId = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const slots = await CustomAvailability.findAll({
      where: {
        userId: req.params.userId,
        specificDate: { [Op.gte]: today },
      },
      order: [["specificDate", "ASC"], ["startTime", "ASC"]],
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
