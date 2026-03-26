const express = require("express");
const router = express.Router();
const db = require("../models/index");
const userprofile = db.UserProfile;
const Paiements = db.Paiements;
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

// DEV ONLY — Active un compte connecté test sans passer par l'onboarding
router.post("/activate-test-account/:stripeAccountId", async (req, res) => {
  try {
    const { stripeAccountId } = req.params;

    // 1️⃣ Créer un account token avec toutes les infos KYC
    const accountToken = await stripe.tokens.create({
      account: {
        business_type: "individual",
        individual: {
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
          dob: { day: 1, month: 1, year: 1990 },
          address: {
            line1: "1 rue de la Paix",
            city: "Paris",
            postal_code: "75001",
            country: "FR",
          },
          id_number: "000000000",
          phone: "+33600000000",
        },
        tos_shown_and_accepted: true,
      },
    });

    // 2️⃣ Mettre à jour le compte avec le token + business_profile
    const account = await stripe.accounts.update(stripeAccountId, {
      account_token: accountToken.id,
      business_profile: {
        url: "https://moovicar.com",
        mcc: "7512",
      },
    });

    res.json({
      id: account.id,
      capabilities: account.capabilities,
      payouts_enabled: account.payouts_enabled,
      charges_enabled: account.charges_enabled,
      requirements: account.requirements.currently_due,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Diagnostiquer l'état d'un compte connecté (capabilities + requirements)
router.get("/account-status/:stripeAccountId", async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve(req.params.stripeAccountId);
    res.json({
      id: account.id,
      capabilities: account.capabilities,
      requirements: {
        currently_due: account.requirements.currently_due,
        eventually_due: account.requirements.eventually_due,
        pending_verification: account.requirements.pending_verification,
        disabled_reason: account.requirements.disabled_reason,
      },
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer les détails d'un PaymentIntent depuis Stripe
router.get("/payment-intent/:id", async (req, res) => {
  try {
    const pi = await stripe.paymentIntents.retrieve(req.params.id, {
      expand: ["charges.data.payment_method_details"],
    });
    res.json(pi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rembourser un locataire via paymentIntentId
router.post("/refund", async (req, res) => {
  const { paymentIntentId, amount, reason, paiementId } = req.body;
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(parseFloat(amount) * 100) }),
      reason, // "requested_by_customer" | "duplicate" | "fraudulent"
    });
    if (paiementId) {
      await Paiements.update(
        { paiementStatus: "4", refundId: refund.id },
        { where: { id: paiementId } },
      );
    }
    res.json({ refundId: refund.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Transfert de fonds à un compte connecté
router.post(
  "/transfer-funds",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, amount, paymentIntentId, paiementId } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const transfer = await stripe.transfers.create({
        amount: Math.round(parseFloat(amount) * 100),
        currency: "eur",
        destination: user.stripeAccountId,
      });
      logger.info("Transfer data", transfer);
      res.send({ transferId: transfer.id, source_type: transfer.source_type });
    } catch (error) {
      logger.error("Erreur lors du transfert des fonds:", error);

      /* Marquer le paiement comme échoué en base si on connaît l'id */
      if (paiementId) {
        try {
          await Paiements.update(
            { paiementStatus: "2", notes: `Échec virement manuel : ${error.message}` },
            { where: { id: paiementId } },
          );
        } catch (dbErr) {
          logger.error("Impossible de mettre à jour le statut du paiement:", dbErr.message);
        }
      }

      res.status(500).send({ error: error.message });
    }
  },
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
