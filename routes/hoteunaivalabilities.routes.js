const express = require("express");
const router = express.Router();

const {
  createHoteUnavailabilities,
  getHoteUnavailabilitiess,
  updateHoteUnavailabilitiesByUserId,
  updateHoteUnavailabilitiesById,
  getUnAvailabilityByUserId,
} = require("../controllers/hoteunaivalabilities.controller");

router.post("/", createHoteUnavailabilities);
router.get("/", getHoteUnavailabilitiess);
router.get("/:userId", getUnAvailabilityByUserId);

router.put(
  "/updateHoteUnavailabilitiesByUserId/:userId",
  updateHoteUnavailabilitiesByUserId
);

router.put(
  "/updateHoteUnavailabilitiesById/:/id",
  updateHoteUnavailabilitiesById
);

module.exports = router;
