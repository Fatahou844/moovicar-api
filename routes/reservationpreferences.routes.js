const express = require("express");
const router = express.Router();

const {
  createReservationPreferencess,
  getReservationPreferencesByVehiculeId,
  getReservationPreferencess,
  updateReservationPreferences,
} = require("../controllers/reservationpreferences.controller");

router.post("/", createReservationPreferencess);
router.put("/:vehiculeId", updateReservationPreferences);
router.get(
  "/getbyvehiculeid/:vehiculeId",
  getReservationPreferencesByVehiculeId
);
router.get("/", getReservationPreferencess);

module.exports = router;
