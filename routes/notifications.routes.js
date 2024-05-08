const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
  getNotificationByUserId,
  deleteNotificationById,
} = require("../controllers/notifications.controller");

router.post("/", createNotification);
router.get("/searchbyid/:id", getNotificationById);
router.get("/searchbyuserid/:userId", getNotificationByUserId);
router.get("/", getNotifications);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotificationById);

module.exports = router;
