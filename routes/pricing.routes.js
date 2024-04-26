const express = require("express");
const router = express.Router();

const {
  createPricing,
  getPricings,
  getPricingByVehiculeId,
} = require("../controllers/pricings.controller");

router.post("/", createPricing);
router.get("/", getPricings);
router.get("/getbyvehiculeid/:vehiculeId", getPricingByVehiculeId);

module.exports = router;
