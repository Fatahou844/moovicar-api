const express = require("express");
const router = express.Router();

const {
  createVehicleOption,
  getVehicleOptionById,
  getVehicleOptions,
} = require("../controllers/vehicleOption.controller");

router.post("/", createVehicleOption);
router.get("/:id", getVehicleOptionById);
router.get("/", getVehicleOptions);

module.exports = router;
