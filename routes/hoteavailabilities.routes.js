const express = require("express");
const router = express.Router();

const {
  createHoteAvailabilities,
  getHoteAvailabilitiess,
  updateHoteAvailabilitiesByUserId,
  updateHoteAvailabilitiesByUserId2,
  updateHoteAvailabilitiesByWeedDayAndUserId,
  getAvailabilityByUserId,
  updateHoteAvailabilitiesByUserId3,
} = require("../controllers/hoteavailabilities.controller");

router.post("/", createHoteAvailabilities);
router.get("/", getHoteAvailabilitiess);
router.get("/:userId", getAvailabilityByUserId);

router.put(
  "/updateHoteAvailabilitiesByUserId/:userId",
  updateHoteAvailabilitiesByUserId
);
router.put(
  "/updateHoteAvailabilitiesByUserId2/:userId",
  updateHoteAvailabilitiesByUserId2
);

router.put(
  "/updateHoteAvailabilitiesByUserId3/:userId",
  updateHoteAvailabilitiesByUserId3
);

router.put(
  "/updateHoteAvailabilitiesByWeedDayAndUserId/:/Weekday/:userId",
  updateHoteAvailabilitiesByWeedDayAndUserId
);

module.exports = router;
