const express = require("express");
const router = express.Router();

const {
  getAskUpdateResa,
  getAskUpdateResaByReservationId,
  createAskApdateResa,
  updateAskUpdateResa,
} = require("../controllers/askupdatereservation.controller");

router.get("/reservation/:reservationId", getAskUpdateResaByReservationId);

router.put("/:reservationId", updateAskUpdateResa);

router.post("/", createAskApdateResa);

module.exports = router;
