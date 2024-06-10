const express = require("express");
const router = express.Router();

const {
  getReservationGainsByGroupByReservationId,
  createReservationGains,
  updateReservationGains,
} = require("../controllers/reservationGain.controller");

router.get("/:reservationId", getReservationGainsByGroupByReservationId);
router.put("/:reservationId", updateReservationGains);

router.post("/", createReservationGains);

module.exports = router;
