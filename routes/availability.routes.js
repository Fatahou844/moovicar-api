const express = require("express");
const router = express.Router();

const {
  createAvailability,
  getAvailabilitys,
  getAvailabilityByVehiculeId,
  updateCustomAvailability,
  updateCustomAvailabilityByWeekDAY,
  updateDefaultAvailabilityByWeekDAY,
  updateOrCreateCustomAvailability,
  updatePrincingbyDefaultVehicule,
} = require("../controllers/availability.controller");

router.post("/", createAvailability);
router.get("/", getAvailabilitys);
router.get("/getbyvehiculeid/:vehiculeId", getAvailabilityByVehiculeId);
router.put(
  "/updateCustomAvailabilty/:AvailabilityID",
  updateCustomAvailability
);

router.put(
  "/updateCustomAvailabilityByWeekDAY/:vehiculeId",
  updateCustomAvailabilityByWeekDAY
);

router.put(
  "/updateDefaultAvailabilityByWeekDAY/:vehiculeId",
  updateDefaultAvailabilityByWeekDAY
);

router.put(
  "/updateOrCreateCustomAvailability/:vehiculeId",
  updateOrCreateCustomAvailability
);

router.put(
  "/updatePrincingbyDefaultVehicule/:vehiculeId",
  updatePrincingbyDefaultVehicule
);

module.exports = router;
