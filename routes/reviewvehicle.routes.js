const express = require("express");
const router = express.Router();

const {
  createReviewVehicle,
  getReviewVehicles,
  getReviewVehicleByDriverInviteId,
  getReviewVehicleById,
  getReviewVehicleByVehicleId,
  updateReviewVehicle,
} = require("../controllers/reviewvehicle.controller");

router.post("/", createReviewVehicle);
router.get("/getbyid/:id", getReviewVehicleById);
router.put("/:id", updateReviewVehicle);
router.get("/", getReviewVehicles);
router.get("/getbyUserId/:userId", getReviewVehicleByDriverInviteId);
router.get("/getbyvehiculeId/:vehiculeId", getReviewVehicleByVehicleId);

//getReservationByDriverHoteId

module.exports = router;
