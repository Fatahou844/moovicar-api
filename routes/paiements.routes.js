const express = require("express");
const router = express.Router();
const db = require("../models/index");
const logger = require("../logger");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const MoovicarUsers = db.MoovicarUsers;
const dotenv = require("dotenv");
dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    "RETFFFXDSERGp38uY8EZlKEoGLvx1LYWhgs0-rX0-p6vtpE72HHz9XqizGgHHNZ",
};

passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    logger.info("JWT payload received in paiement route:", jwt_payload);
    try {
      const user = await MoovicarUsers.findOne({
        where: { email: jwt_payload.sub },
      });

      if (user) {
        logger.info("User found:", user);
        return done(null, user);
      } else {
        logger.info("User not found for email:", jwt_payload.sub);
        return done(null, false);
      }
    } catch (err) {
      logger.error("Error while finding user:", err);
      return done(err, false);
    }
  })
);

const {
  getPaiements,
  updatePaiement,
} = require("../controllers/paiements.controller");

router.get("/", passport.authenticate("jwt", { session: false }), getPaiements);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updatePaiement
);
module.exports = router;
