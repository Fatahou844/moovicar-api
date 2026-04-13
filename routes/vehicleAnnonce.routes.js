const express = require("express");
const router = express.Router();

const {
  createVehiculeAnnonce,
  getVehiculeAnnonceById,
  getVehiculeAnnonces,
  getVehiculeAnnoncesByCoordCenters,
  getVehiculeAnnonceByVehiculeId,
  updateVehiculeAnnonce,
  approveAnnonce,
  rejectAnnonce,
  disableAnnonce,
} = require("../controllers/vehicleAnnonce.controller");

router.post("/", createVehiculeAnnonce);
router.get("/getannoncebyid/:id", getVehiculeAnnonceById);
router.get("/", getVehiculeAnnonces);
router.put("/:id", updateVehiculeAnnonce);
router.get("/search-listing/", getVehiculeAnnoncesByCoordCenters);
router.get("/getbyvehiculeid/:vehiculeId", getVehiculeAnnonceByVehiculeId);
// Admin — actions avec notification push
router.put("/:id/approve",  approveAnnonce);
router.put("/:id/reject",   rejectAnnonce);
router.put("/:id/disable",  disableAnnonce);

module.exports = router;
