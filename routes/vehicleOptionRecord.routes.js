const express = require("express");
const router = express.Router();

const {
  createVehicleOptionRecord,
  getVehicleOptionRecordById,
  getVehicleOptionRecords,
  getVehicleOptionRecordByVehicleId,
} = require("../controllers/vehicleOptionRecord.controller");

router.post("/", createVehicleOptionRecord);
router.get("/:vehicleId", getVehicleOptionRecordByVehicleId);
router.get("/", getVehicleOptionRecords);

module.exports = router;
