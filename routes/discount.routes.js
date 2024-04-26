const express = require("express");
const router = express.Router();

const {
  createDiscounts,
  getDiscountss,
  getDiscountsByVehiculeId,

  updateOrCreateDiscounts,
} = require("../controllers/discount.controller");

router.post("/", createDiscounts);
router.get("/", getDiscountss);
router.get("/getbyvehiculeid/:vehiculeId", getDiscountsByVehiculeId);

router.put("/updateOrCreateDiscounts/:vehiculeId", updateOrCreateDiscounts);

module.exports = router;
