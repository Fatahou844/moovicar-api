"use strict";
const db = require("../models");
const InsurancePlan = db.InsurancePlan;
const Reservation   = db.Reservation;

/* ── Public: liste des plans actifs ── */
exports.listPlans = async (req, res) => {
  try {
    const plans = await InsurancePlan.findAll({
      where: { isActive: true },
      order: [["sortOrder", "ASC"]],
    });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── Public: un plan par slug ── */
exports.getPlanBySlug = async (req, res) => {
  try {
    const plan = await InsurancePlan.findOne({ where: { slug: req.params.slug } });
    if (!plan) return res.status(404).json({ message: "Plan introuvable" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── Guest: choisir un plan pour une réservation ── */
exports.selectPlanForReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { planId, nombreJours } = req.body;

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    if (!planId) {
      // Retrait de l'assurance
      reservation.insurancePlanId = null;
      reservation.insuranceFee    = null;
      await reservation.save();
      return res.json({ message: "Assurance retirée" });
    }

    const plan = await InsurancePlan.findByPk(planId);
    if (!plan || !plan.isActive) return res.status(404).json({ message: "Plan introuvable ou inactif" });

    const jours = parseFloat(nombreJours) || 1;
    const fee   = Math.round(plan.pricePerDay * jours * 100) / 100;

    reservation.insurancePlanId = plan.id;
    reservation.insuranceFee    = fee;
    await reservation.save();

    res.json({ message: "Plan sélectionné", plan, insuranceFee: fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── Admin: CRUD plans ── */
exports.createPlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan introuvable" });
    await plan.update(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan introuvable" });
    await plan.update({ isActive: false }); // soft delete
    res.json({ message: "Plan désactivé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
