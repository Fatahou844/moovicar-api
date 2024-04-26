const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversations,
  getConversationByReservationId,
} = require("../controllers/conversation.controller");

router.post("/", createConversation);
router.get("/:reservationId", getConversationByReservationId);
router.get("/", getConversations);

module.exports = router;
