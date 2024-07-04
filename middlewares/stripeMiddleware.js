const express = require("express");
const router = express.Router();
const db = require("../models/index");
const userprofile = db.UserProfile;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const MoovicarUsers = db.MoovicarUsers;
const logger = require("../logger");

const dotenv = require("dotenv");
dotenv.config();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // L'utilisateur est authentifié, continuez avec la prochaine étape de la route

    if (req.params.userId != req.user.id) {
      // L'utilisateur authentifié ne peut pas accéder aux données d'autres utilisateurs
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  }

  // L'utilisateur n'est pas authentifié, renvoyez une erreur ou redirigez-le vers la page de connexion
  res.status(401).json({ error: "Unauthorized" });
};

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_SESSION_JWT,
};

passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    logger.info("JWT payload received in stripe middleware:", jwt_payload);
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

// Transfert de fonds à un compte connecté
router.post(
  "/transfer-funds",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, amount } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const transfer = await stripe.transfers.create({
        amount: amount * 100,
        currency: "eur",
        destination: user.stripeAccountId,
      });
      logger.info("Transfer data", transfer);
      res.send({ transferId: transfer.id, source_type: transfer.source_type });
    } catch (error) {
      logger.error("Erreur lors du transfert des fonds:", error);
      res.status(500).send(error);
    }
  }
);

router.post(
  "/account-link",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, refresh_url, return_url } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const accountLink = await stripe.accountLinks.create({
        account: user.stripeAccountId,
        refresh_url: refresh_url,
        return_url: return_url,
        type: "account_onboarding",
      });

      res.send({ url: accountLink.url });
    } catch (error) {
      logger.error("Erreur lors de la création du lien d'intégration:", error);
      res.status(500).send(error);
    }
  }
);

// Création d'une intention de paiement
router.post(
  "/create-payment-intent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, amount } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        customer: user.stripeCustomerId,
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      logger.error(
        "Erreur lors de la création de l'intention de paiement:",
        error
      );
      res.status(500).send(error);
    }
  }
);

// Endpoint pour charger des fonds de test sur le compte Stripe
router.post(
  "/add-test-funds",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, amount } = req.body;
    try {
      // 1. Créez une charge en utilisant une carte de test
      const charge = await stripe.charges.create({
        amount: amount * 100, // Montant en cents
        currency: "eur",
        source: "tok_1PY3jnJ2jKVL4e9fpHdaV6kD", // Utilisez un token de carte de test de Stripe
        description: `Adding test funds for ${email}`,
      });

      res.send({ chargeId: charge.id });
    } catch (error) {
      logger.error("Erreur lors de l'ajout de fonds de test:", error);
      res.status(500).send(error);
    }
  }
);
module.exports = router;
