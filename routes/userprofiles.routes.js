const express = require("express");
const router = express.Router();

const {
  createUserProfile,
  updateUserProfile,
  getUserProfiles,
  getUserProfileById,
} = require("../controllers/userprofiles.controller");

router.post("/", createUserProfile);
router.get("/searchbyid/:id", getUserProfileById);
router.get("/", getUserProfiles);
router.put("/:id", updateUserProfile);

module.exports = router;
