"use strict";
const Stripe = require("stripe");
const db = require("../models");
const Checkout = db.Checkout;
const Reservation = db.Reservation;
const Checkin = db.Checkin;
const VehiculeAnnonce = db.VehiculeAnnonce;
const UserProfile = db.UserProfile;
const { createNotification } = require("../services/notificationService");

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

    // Notifier le propriétaire qu'un check-out est soumis
    const reservation = await Reservation.findByPk(reservationId);
    if (reservation) {
      await createNotification({
        userId: reservation.driverHoteId,
        titre: "Retour soumis",
        message: "Le conducteur a soumis le retour du véhicule. Veuillez le valider.",
        type: "checkout_submitted",
        link: `/host/reservation/${reservationId}`,
        io: req.io,
      });
    }

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
    const checkin = await Checkin.findOne({ where: { reservationId } });

    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    const kmEnd = parseFloat(checkout?.kmEnd);
    const kmStart = parseFloat(checkin?.kmStart);
    const freeKm = parseFloat(reservation.VehiculeAnnonce?.distanceOutMin || 0);
    const pricePerKm = PRICE_PER_EXTRA_KM;

    if (isNaN(kmEnd) || isNaN(kmStart)) {
      return res.json({
        hasExtra: false,
        kmStart: kmStart || null,
        kmEnd: kmEnd || null,
        freeKm,
        pricePerKm,
      });
    }

    const distanceParcourue = kmEnd - kmStart;
    const kmExcess = Math.max(0, distanceParcourue - freeKm);
    const extraAmount =
      kmExcess > 0 ? Math.round(kmExcess * pricePerKm * 100) / 100 : 0;

    res.json({
      hasExtra: kmExcess > 0 && extraAmount >= 0.5,
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
    const checkin = await Checkin.findOne({ where: { reservationId } });

    if (!checkout)
      return res.status(404).json({ message: "Données introuvables" });

    checkout.validatedAt = new Date();
    await checkout.save();

    reservation.status = "completed";

    /* ── Paiement supplémentaire km ── */
    let extraChargeResult = null;
    const kmEnd = parseFloat(checkout.kmEnd);
    const kmStart = parseFloat(checkin?.kmStart);
    const freeKm = parseFloat(reservation.VehiculeAnnonce?.distanceOutMin || 0);

    if (!isNaN(kmEnd) && !isNaN(kmStart)) {
      const distanceParcourue = kmEnd - kmStart;
      const kmExcess = Math.max(0, distanceParcourue - freeKm);

      // Snapshot des données de distance sur la réservation
      reservation.distanceParcourueKm = Math.round(distanceParcourue);
      reservation.distanceMaxKm = Math.round(freeKm);
      reservation.prixParKmSupp = PRICE_PER_EXTRA_KM;

      if (kmExcess > 0) {
        const extraAmount = Math.round(kmExcess * PRICE_PER_EXTRA_KM * 100); // centimes

        /* Récupère le moyen de paiement depuis le PaymentIntent d'origine */
        const piId = reservation.PaymentIntentId;
        if (piId && extraAmount >= 50) {
          // minimum Stripe 0.50€
          try {
            const originalPi = await stripe.paymentIntents.retrieve(piId);
            const paymentMethodId = originalPi.payment_method;
            let customerId = originalPi.customer;

            // Fallback : customer absent sur le PI → récupérer depuis le profil conducteur
            if (paymentMethodId && !customerId) {
              const driver = await UserProfile.findByPk(reservation.driverInviteId);
              if (driver) {
                if (!driver.stripeCustomerId) {
                  const customer = await stripe.customers.create({
                    email: driver.email,
                    name: `${driver.firstName || ""} ${driver.lastName || ""}`.trim() || undefined,
                    metadata: { userId: String(driver.id) },
                  });
                  driver.stripeCustomerId = customer.id;
                  await driver.save();
                }
                customerId = driver.stripeCustomerId;
                const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
                if (pm.customer !== customerId) {
                  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
                }
              }
            }

            if (paymentMethodId && customerId) {
              const extraPi = await stripe.paymentIntents.create({
                amount: extraAmount,
                currency: "eur",
                customer: customerId,
                payment_method: paymentMethodId,
                confirm: true,
                off_session: true,
                description: `Frais km supplémentaires — résa #${reservationId} (${kmExcess} km × ${PRICE_PER_EXTRA_KM}€)`,
                metadata: {
                  reservationId: String(reservationId),
                  kmExcess: String(kmExcess),
                },
              });
              reservation.extraDistancePaymentIntentId = extraPi.id;
              reservation.extraDistancePaid = extraPi.status === "succeeded";
              extraChargeResult = {
                charged: true,
                kmExcess,
                amount: extraAmount / 100,
                currency: "eur",
                paymentIntentId: extraPi.id,
              };
            }
          } catch (stripeErr) {
            console.error(
              "[validateCheckout] Erreur paiement km extra :",
              stripeErr.message,
            );
            extraChargeResult = {
              charged: false,
              reason: stripeErr.message,
              kmExcess,
              amount: extraAmount / 100,
            };
          }
        }
      }
    }

    await reservation.save();

    // Notifier le conducteur
    let checkoutMsg = "Votre retour a été validé par le propriétaire. La location est terminée.";
    if (extraChargeResult?.charged) {
      checkoutMsg += ` Un supplément de ${extraChargeResult.amount.toFixed(2)} € a été prélevé pour ${extraChargeResult.kmExcess} km supplémentaires.`;
    } else if (extraChargeResult && !extraChargeResult.charged) {
      checkoutMsg += ` Un supplément de ${extraChargeResult.amount.toFixed(2)} € pour km supplémentaires n'a pas pu être prélevé.`;
    }
    await createNotification({
      userId: reservation.driverInviteId,
      titre: "Retour validé",
      message: checkoutMsg,
      type: extraChargeResult?.charged ? "extra_charge" : "checkout_validated",
      link: `/guest/reservation/${reservationId}`,
      io: req.io,
    });

    res.json({ message: "Checkout validé", extraCharge: extraChargeResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/// ===============================
/// RETRY EXTRA DISTANCE CHARGE
/// ===============================
exports.retryExtraCharge = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByPk(reservationId, {
      include: [{ model: VehiculeAnnonce }],
    });

    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    if (reservation.extraDistancePaid)
      return res
        .status(400)
        .json({ message: "Frais km supplémentaires déjà encaissés" });

    const kmExcessRaw =
      (reservation.distanceParcourueKm || 0) - (reservation.distanceMaxKm || 0);
    const kmExcess = Math.max(0, kmExcessRaw);

    if (kmExcess === 0)
      return res
        .status(400)
        .json({ message: "Aucun km supplémentaire à facturer" });

    const pricePerKm = reservation.prixParKmSupp || PRICE_PER_EXTRA_KM;
    const extraAmount = Math.round(kmExcess * pricePerKm * 100);

    if (extraAmount < 50)
      return res
        .status(400)
        .json({ message: "Montant inférieur au minimum Stripe (0.50 €)" });

    const piId = reservation.PaymentIntentId;
    if (!piId)
      return res
        .status(400)
        .json({ message: "PaymentIntent d'origine introuvable" });

    const originalPi = await stripe.paymentIntents.retrieve(piId);
    const paymentMethodId = originalPi.payment_method;
    let customerId = originalPi.customer;

    if (!paymentMethodId)
      return res.status(400).json({ message: "Aucun moyen de paiement trouvé sur ce PaymentIntent." });

    // Si customer absent sur le PI (PI créé avant la mise à jour),
    // on le récupère depuis le profil du conducteur et on attache le PM
    if (!customerId) {
      const driver = await UserProfile.findByPk(reservation.driverInviteId);

      if (!driver)
        return res.status(400).json({ message: "Profil conducteur introuvable." });

      // Créer le customer Stripe si absent
      if (!driver.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: driver.email,
          name: `${driver.firstName || ""} ${driver.lastName || ""}`.trim() || undefined,
          metadata: { userId: String(driver.id) },
        });
        driver.stripeCustomerId = customer.id;
        await driver.save();
      }

        customerId = driver.stripeCustomerId;

      // Attacher le payment method au customer s'il ne l'est pas déjà
      try {
        const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (pm.customer !== customerId) {
          await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        }
      } catch (_) {
        // PM inutilisable — on passera par les cartes sauvegardées ou un lien de paiement
      }
    }

    // Chercher une carte valide attachée au customer (PM sauvegardé via setup_future_usage)
    let resolvedPaymentMethodId = null;
    if (customerId) {
      const savedPMs = await stripe.paymentMethods.list({ customer: customerId, type: "card" });
      if (savedPMs.data.length > 0) {
        resolvedPaymentMethodId = savedPMs.data[0].id;
      }
    }

    // Aucune carte utilisable → générer un lien de paiement Stripe
    if (!resolvedPaymentMethodId) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer: customerId || undefined,
        line_items: [{
          price_data: {
            currency: "eur",
            unit_amount: extraAmount,
            product_data: {
              name: `Frais km supplémentaires — résa #${reservationId}`,
              description: `${kmExcess} km × ${pricePerKm} €/km`,
            },
          },
          quantity: 1,
        }],
        metadata: { reservationId: String(reservationId), kmExcess: String(kmExcess) },
        success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/guest/reservation/${reservationId}?extra_paid=1`,
        cancel_url:  `${process.env.CLIENT_URL || "http://localhost:3000"}/guest/reservation/${reservationId}`,
      });

      return res.status(402).json({
        charged: false,
        requiresAction: true,
        paymentUrl: session.url,
        kmExcess,
        amount: extraAmount / 100,
        message: "Aucune carte enregistrée. Un lien de paiement a été généré.",
      });
    }

    const extraPi = await stripe.paymentIntents.create({
      amount: extraAmount,
      currency: "eur",
      customer: customerId,
      payment_method: resolvedPaymentMethodId,
      confirm: true,
      off_session: true,
      description: `[RETRY] Frais km supplémentaires — résa #${reservationId} (${kmExcess} km × ${pricePerKm}€)`,
      metadata: {
        reservationId: String(reservationId),
        kmExcess: String(kmExcess),
        retry: "true",
      },
    });

    reservation.extraDistancePaymentIntentId = extraPi.id;
    reservation.extraDistancePaid = extraPi.status === "succeeded";
    await reservation.save();

    if (extraPi.status === "succeeded") {
      await createNotification({
        userId: reservation.driverInviteId,
        titre: "Supplément km débité",
        message: `Un supplément de ${(extraAmount / 100).toFixed(2)} € a été prélevé pour ${kmExcess} km supplémentaires.`,
        type: "extra_charge",
        link: `/guest/reservation/${reservationId}`,
        io: req.io,
      });
    }

    res.json({
      charged: extraPi.status === "succeeded",
      kmExcess,
      amount: extraAmount / 100,
      currency: "eur",
      paymentIntentId: extraPi.id,
      status: extraPi.status,
    });
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

    // Notifier le conducteur que le checkout est refusé
    await createNotification({
      userId: reservation.driverInviteId,
      titre: "Retour refusé",
      message: "Le propriétaire a refusé votre retour. Un litige a été ouvert.",
      type: "checkout_refused",
      link: `/guest/reservation/${reservationId}`,
      io: req.io,
    });

    res.json({ message: "Checkout refusé, litige ouvert" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
