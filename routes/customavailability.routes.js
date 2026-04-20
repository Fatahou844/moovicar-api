const express = require("express");
const router = express.Router();

const {
  getByUserId,
  create,
  remove,
  getFutureByUserId,
} = require("../controllers/customavailability.controller");

router.get("/:userId",         getByUserId);
router.get("/:userId/future",  getFutureByUserId);
router.post("/",               create);
router.delete("/:id",          remove);

module.exports = router;
