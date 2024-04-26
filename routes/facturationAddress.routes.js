const express = require("express");
const router = express.Router();

const {
  createFacturationAddress,
  getFacturationAddressById,
  getFacturationAddresss,
  updateFacturationAddress,
} = require("../controllers/facturationAddress.controller");

router.post("/", createFacturationAddress);
router.get("/:id", getFacturationAddressById);
router.get("/", getFacturationAddresss);
router.put("/:id", updateFacturationAddress);

module.exports = router;
