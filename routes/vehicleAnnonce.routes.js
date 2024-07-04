const express = require("express");
const router = express.Router();

const {
  createVehiculeAnnonce,
  getVehiculeAnnonceById,
  getVehiculeAnnonces,
  getVehiculeAnnoncesByCoordCenters,
  getVehiculeAnnonceByVehiculeId,
  updateVehiculeAnnonce,
} = require("../controllers/vehicleAnnonce.controller");

router.post("/", createVehiculeAnnonce);
router.get("/getannoncebyid/:id", getVehiculeAnnonceById);
router.get("/", getVehiculeAnnonces);
router.put("/:id", updateVehiculeAnnonce);
router.get("/search-listing/", getVehiculeAnnoncesByCoordCenters);
router.get("/getbyvehiculeid/:vehiculeId", getVehiculeAnnonceByVehiculeId);

module.exports = router;
