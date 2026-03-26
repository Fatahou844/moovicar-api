const db = require("../models");
const Checkin = db.Checkin;
const Reservation = db.Reservation;
const Dispute = db.Dispute;

exports.createCheckin = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const checkin = await Checkin.create({
      reservationId: reservationId,
      kmStart: req.body.kmStart,
      fuelStart: req.body.fuelStart,
      photos: JSON.stringify(req.body.photos),
      driverSignature: req.body.driverSignature,
    });

    const reservation = await Reservation.findByPk(reservationId);
    reservation.status = "checkin_pending_validation";
    await reservation.save();

    res.status(201).json(checkin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCheckin = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const checkin = await Checkin.findOne({
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

exports.getAllCheckins = async (req, res) => {
  try {
    const checkins = await Checkin.findAll();

    const formattedCheckins = checkins.map((c) => ({
      ...c.toJSON(),
      photos: c.photos ? JSON.parse(c.photos) : [],
    }));

    res.status(200).json(formattedCheckins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/// ===============================
/// VALIDATE CHECKIN (propriétaire)
/// ===============================
exports.validateCheckin = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;

    const reservation = await Reservation.findByPk(reservationId);
    const checkin = await Checkin.findOne({ where: { reservationId } });

    if (!reservation || !checkin)
      return res.status(404).json({ message: "Données introuvables" });

    // if (reservation.ownerId !== userId)
    //   return res.status(403).json({ message: "Non autorisé" });

    // checkin.validated = true;
    checkin.validatedAt = new Date();
    await checkin.save();

    reservation.status = "in_progress";
    await reservation.save();

    res.json({ message: "Check-in validé, location démarrée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/// ===============================
/// REFUSE CHECKIN (propriétaire)
/// ===============================
exports.refuseCheckin = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const userId = req.user.id;

    const reservation = await Reservation.findByPk(reservationId);
    const checkin = await Checkin.findOne({ where: { reservationId } });

    if (!reservation || !checkin)
      return res.status(404).json({ message: "Données introuvables" });

    // if (reservation.ownerId !== userId)
    //   return res.status(403).json({ message: "Non autorisé" });

    await Dispute.create({
      reservationId,
      reportedBy: userId,
      description: req.body.reason,
      status: "open",
    });

    reservation.status = "checkin_refused";
    await reservation.save();

    res.json({ message: "Check-in refusé, litige ouvert" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
