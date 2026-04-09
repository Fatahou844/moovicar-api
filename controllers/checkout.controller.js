"use strict";
const Stripe = require("stripe");
const db = require("../models");
const Checkout = db.Checkout;
const Reservation = db.Reservation;
const Checkin = db.Checkin;
const VehiculeAnnonce = db.VehiculeAnnonce;
const UserProfile = db.UserProfile;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRICE_PER_EXTRA_KM = parseFloat(process.env.PRICE_PER_EXTRA_KM || "0.13"); // €/km

exports.createCheckout = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const checkout = await Checkout.create({
      reservationId: reservationId,
      kmEnd: req.body.kmEnd,
      fuelEnd: req.body.fuelEnd,
      photos: JSON.stringify(req.body.photos),
      comment: req.body.comment,
    });

    res.status(201).json(checkout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const checkin = await Checkout.findOne({
      where: { reservationId },
    });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in non trouvé" });
    }

    // Convertir les photos JSON en tableau
    const checkinData = {
      ...checkin.toJSON(),
      photos: checkin.photos ? JSON.parse(checkin.photos) : [],
    };

    res.status(200).json(checkinData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.findAll();

    const formattedCheckins = checkouts.map((c) => ({
      ...c.toJSON(),
      photos: c.photos ? JSON.parse(c.photos) : [],
    }));

    res.status(200).json(formattedCheckins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.previewExtraDistance = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByPk(reservationId, {
      include: [{ model: VehiculeAnnonce }],
    });
    const checkout = await Checkout.findOne({ where: { reservationId } });
    const checkin  = await Checkin.findOne({ where: { reservationId } });

    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    const kmEnd   = parseFloat(checkout?.kmEnd);
    const kmStart = parseFloat(checkin?.kmStart);
    const freeKm  = parseFloat(reservation.VehiculeAnnonce?.distanceOutMin || 0);
    const pricePerKm = PRICE_PER_EXTRA_KM;

    if (isNaN(kmEnd) || isNaN(kmStart)) {
      return res.json({ hasExtra: false, kmStart: kmStart || null, kmEnd: kmEnd || null, freeKm, pricePerKm });
    }

    const distanceParcourue = kmEnd - kmStart;
    const kmExcess = Math.max(0, distanceParcourue - freeKm);
    const extraAmount = kmExcess > 0 ? Math.round(kmExcess * pricePerKm * 100) / 100 : 0;

    res.json({
      hasExtra: kmExcess > 0 && extraAmount >= 0.50,
      kmStart,
      kmEnd,
      freeKm,
      distanceParcourue,
      kmExcess,
      pricePerKm,
      extraAmount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateCheckout = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByPk(reservationId, {
      include: [{ model: VehiculeAnnonce }],
    });
    const checkout = await Checkout.findOne({ where: { reservationId } });
    const checkin  = await Checkin.findOne({ where: { reservationId } });

    if (!checkout)
      return res.status(404).json({ message: "Données introuvables" });

    checkout.validatedAt = new Date();
    await checkout.save();

    reservation.status = "completed";

    /* ── Paiement supplémentaire km ── */
    let extraChargeResult = null;
    const kmEnd   = parseFloat(checkout.kmEnd);
    const kmStart = parseFloat(checkin?.kmStart);
    const freeKm  = parseFloat(reservation.VehiculeAnnonce?.distanceOutMin || 0);

    if (!isNaN(kmEnd) && !isNaN(kmStart)) {
      const distanceParcourue = kmEnd - kmStart;
      const kmExcess = Math.max(0, distanceParcourue - freeKm);

      // Snapshot des données de distance sur la réservation
      reservation.distanceParcourueKm = Math.round(distanceParcourue);
      reservation.distanceMaxKm       = Math.round(freeKm);
      reservation.prixParKmSupp       = PRICE_PER_EXTRA_KM;

      if (kmExcess > 0) {
        const extraAmount = Math.round(kmExcess * PRICE_PER_EXTRA_KM * 100); // centimes

        /* Récupère le moyen de paiement depuis le PaymentIntent d'origine */
        const piId = reservation.PaymentIntentId;
        if (piId && extraAmount >= 50) { // minimum Stripe 0.50€
          try {
            const originalPi = await stripe.paymentIntents.retrieve(piId);
            const paymentMethodId = originalPi.payment_method;
            const customerId      = originalPi.customer;

            if (paymentMethodId && customerId) {
              const extraPi = await stripe.paymentIntents.create({
                amount:               extraAmount,
                currency:             "eur",
                customer:             customerId,
                payment_method:       paymentMethodId,
                confirm:              true,
                off_session:          true,
                description:          `Frais km supplémentaires — résa #${reservationId} (${kmExcess} km × ${PRICE_PER_EXTRA_KM}€)`,
                metadata: { reservationId: String(reservationId), kmExcess: String(kmExcess) },
              });
              reservation.extraDistancePaymentIntentId = extraPi.id;
              reservation.extraDistancePaid            = extraPi.status === "succeeded";
              extraChargeResult = {
                charged: true,
                kmExcess,
                amount: extraAmount / 100,
                currency: "eur",
                paymentIntentId: extraPi.id,
              };
            }
          } catch (stripeErr) {
            console.error("[validateCheckout] Erreur paiement km extra :", stripeErr.message);
            extraChargeResult = { charged: false, reason: stripeErr.message, kmExcess, amount: extraAmount / 100 };
          }
        }
      }
    }

    await reservation.save();

    res.json({ message: "Checkout validé", extraCharge: extraChargeResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/// ===============================
/// REFUSE CHECKOUT (propriétaire)
/// ===============================
exports.refuseCheckout = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const userId = req.user.id;

    const reservation = await Reservation.findByPk(reservationId);
    const checkout = await Checkout.findOne({ where: { reservationId } });

    if (!checkout)
      return res.status(404).json({ message: "Données introuvables" });

    // if (reservation.ownerId !== userId)
    //   return res.status(403).json({ message: "Non autorisé" });

    await Dispute.create({
      reservationId,
      reportedBy: userId,
      description: req.body.reason,
      status: "open",
    });

    reservation.status = "dispute_open";
    await reservation.save();

    res.json({ message: "Checkout refusé, litige ouvert" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
