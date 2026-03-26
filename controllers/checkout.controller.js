const db = require("../models");
const Checkout = db.Checkout;
const Reservation = db.Reservation;

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

exports.validateCheckout = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByPk(reservationId);
    const checkout = await Checkout.findOne({ where: { reservationId } });

    if (!checkout)
      return res.status(404).json({ message: "Données introuvables" });

    // if (reservation.ownerId !== userId)
    //   return res.status(403).json({ message: "Non autorisé" });

    checkout.validatedAt = new Date();
    await checkout.save();

    reservation.status = "completed";
    await reservation.save();

    res.json({ message: "Checkout validé" });
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
