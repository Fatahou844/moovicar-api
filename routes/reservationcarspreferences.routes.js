const express = require("express");
const router = express.Router();

const {
  createReservationCarPreferencess,
  getReservationCarPreferencesByVehiculeId,
  getReservationCarPreferencess,
  updateReservationCarPreferences,
} = require("../controllers/reservationsCarPreferences.controller");

router.post("/", createReservationCarPreferencess);
router.put("/:vehiculeId", updateReservationCarPreferences);
router.get(
  "/getbyvehiculeid/:vehiculeId",
  getReservationCarPreferencesByVehiculeId
);
router.get("/", getReservationCarPreferencess);

module.exports = router;
