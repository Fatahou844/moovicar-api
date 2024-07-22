const express = require("express");
const router = express.Router();

const {
  getReservationGainsByGroupByReservationId,
  createReservationGains,
  updateReservationGains,
  getReservationGainsByHostId,
} = require("../controllers/reservationGain.controller");

router.get(
  "/reservation/:reservationId",
  getReservationGainsByGroupByReservationId
);
router.get("/host/:hostId", getReservationGainsByHostId);

router.put("/:reservationId", updateReservationGains);

router.post("/", createReservationGains);

module.exports = router;
