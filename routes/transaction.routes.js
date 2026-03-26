const express = require("express");
const router = express.Router();

const {
  getTransactions,
  getTransactionsByHost,
  getTransactionById,
  createTransaction,
  updateTransaction,
} = require("../controllers/transaction.controller");

router.get("/", getTransactions);
router.get("/host/:hostId", getTransactionsByHost);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);

module.exports = router;
