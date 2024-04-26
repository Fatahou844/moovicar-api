const express = require("express");
const router = express.Router();

const {
  createUnavailability,
  getUnavailabilityByVehiculeId,
  getUnavailabilitys,
  getUnavailabilityByVehiculeIdandDate,
} = require("../controllers/unavailability.controller");

router.post("/", createUnavailability);
router.get("/", getUnavailabilitys);
router.get("/getbyvehiculeid/:vehiculeId", getUnavailabilityByVehiculeId);
router.get(
  "/getbyvehiculeid-date/:vehiculeId",
  getUnavailabilityByVehiculeIdandDate
);

module.exports = router;
