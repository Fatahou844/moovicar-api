const express = require("express");
const router = express.Router();

const {
  createUserProfile,
  updateUserProfile,
  getUserProfiles,
  getUserProfileById,
  getPerformanceRates,
} = require("../controllers/userprofiles.controller");

router.post("/", createUserProfile);
router.get("/searchbyid/:id", getUserProfileById);
router.get("/:id/performance", getPerformanceRates);
router.get("/", getUserProfiles);
router.put("/:id", updateUserProfile);
router.delete("/:id/unlink-google", async (req, res) => {
  try {
    const { UserProfile } = require("../models");
    const user = await UserProfile.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await user.update({ googleId: null });
    res.json({ message: "Compte Google délié avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
