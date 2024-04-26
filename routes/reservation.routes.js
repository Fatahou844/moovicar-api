const express = require("express");
const router = express.Router();

const {
  createreservation,
  getReservationById,
  getreservations,
  getReservationByDriverHoteId,
  getReservationByDriverInviteId,
  updateReservation,
  updateReservationsByDriverInviteIdAndDates,
} = require("../controllers/reservation.controller");

router.post("/", createreservation);
router.get("/getbyid/:id", getReservationById);
router.put("/:id", updateReservation);
router.get("/", getreservations);
router.get("/getbydriverid/:driverHoteId", getReservationByDriverHoteId);
router.get("/getbyInviteid/:driverInviteId", getReservationByDriverInviteId);
router.put(
  "/updatebyInviteidDates/:driverInviteId",
  updateReservationsByDriverInviteIdAndDates
);

//getReservationByDriverHoteId

module.exports = router;
