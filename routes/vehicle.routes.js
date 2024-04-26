const express = require("express");
const router = express.Router();

const {
  createvehicle,
  getvehicleById,
  getvehicles,
  updatevehicle,
  getvehicleByUserId,
  deleteVehicleById,
} = require("../controllers/vehicle.controller");

router.post("/", createvehicle);
router.get("/searchbyid/:id", getvehicleById);
router.get("/searchbyuserid/:userId", getvehicleByUserId);
router.get("/", getvehicles);
router.put("/:id", updatevehicle);
router.delete("/:id", deleteVehicleById);

module.exports = router;
