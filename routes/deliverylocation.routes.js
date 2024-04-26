const express = require("express");
const router = express.Router();

const {
  createDeleveryLocation,
  getDeliveryLocationByAnnonceId,
  getDeliveryLocations,
  getDeliveryLocationsByCoordCenters,
  updateDeliveryLocation,
} = require("../controllers/deliverylocation.controller");

router.post("/", createDeleveryLocation);
router.put("/:annonceId", updateDeliveryLocation);
router.get("/getannoncebyid/:annonceId", getDeliveryLocationByAnnonceId);
router.get("/", getDeliveryLocations);
router.get("/search-listing/", getDeliveryLocationsByCoordCenters);

module.exports = router;
