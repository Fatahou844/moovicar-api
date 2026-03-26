const db = require("../models");
const Reservation = db.Reservation;

exports.isReservationOwnerOrDriver = async (req, res, next) => {
  try {
    const reservationId = req.params.reservationId;
    const userId = req.user.id;

    const resa = await Reservation.findByPk(reservationId);

    if (!resa) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    if (resa.userId !== userId && resa.ownerId !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    req.reservation = resa;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
