const express = require("express");
const router = express.Router();

const {
  createVehicleModel,
  getVehicleModelById,
  getVehicleModels,
  getVehicleModelByBrandName,
} = require("../controllers/vehiclemodel.controller");

router.post("/", createVehicleModel);
router.get("/:marque", getVehicleModelByBrandName);
router.get("/", getVehicleModels);

module.exports = router;
