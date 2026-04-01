const express = require("express");
const router = express.Router();
const db = require("../models/index");
const userprofile = db.UserProfile;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const {
  createNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
  getNotificationByUserId,
  deleteNotificationById,
} = require("../controllers/notifications.controller");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_SESSION_JWT,
};

passport.use(
  "user-jwt",
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    console.log("JWT payload received in notifications routes:", jwt_payload);
    try {
      const user = await userprofile.findOne({
        where: { email: jwt_payload.sub },
      });

      if (user) {
        console.log("User found:", user);
        return done(null, user);
      } else {
        console.log("User not found for email:", jwt_payload.sub);
        return done(null, false);
      }
    } catch (err) {
      console.error("Error while finding user:", err);
      return done(err, false);
    }
  })
);

router.post("/", createNotification);
router.get("/searchbyid/:id", getNotificationById);
router.get(
  "/searchbyuserid/:userId",
  passport.authenticate("user-jwt", { session: false }),
  getNotificationByUserId
);
router.get("/", getNotifications);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotificationById);

// Marquer une notification comme lue
router.put("/:id/read", async (req, res) => {
  const db = require("../models/index");
  try {
    await db.Notification.update({ isRead: true }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Marquer toutes les notifications d'un user comme lues
router.put("/user/:userId/read-all", passport.authenticate("user-jwt", { session: false }), async (req, res) => {
  const db = require("../models/index");
  try {
    await db.Notification.update({ isRead: true }, { where: { userId: req.params.userId, isRead: false } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
