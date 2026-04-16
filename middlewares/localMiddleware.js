const LocalStrategy = require("passport-local").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const db = require("../models/index");
const userprofile = db.UserProfile;
const Reservation = db.Reservation;
const Transaction = db.Transaction;
const MoovicarUsers = db.MoovicarUsers;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const express = require("express");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getPaiementsByUser } = require("../controllers/paiements.controller");
const { sendVerificationEmail } = require("../utils/emailService");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth.controller");

dotenv.config();

const router = express.Router();

passport.use(
  "local-signin-web2",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email

      usernameField: "email",

      passwordField: "password",

      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        const user = await userprofile.findOne({
          where: {
            [Op.and]: [{ email: email }, { email: email }],
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  "local-signin-admin",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email

      usernameField: "email",

      passwordField: "password",

      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        const user = await MoovicarUsers.findOne({
          where: {
            [Op.and]: [{ email: email }, { email: email }],
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_SESSION_JWT,
};

passport.use(
  "user-jwt",
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    logger.info("JWT payload received:", jwt_payload);
    try {
      const user = await userprofile.findOne({
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
  }),
);

// Stratégie spécifique pour les admins
passport.use(
  "admin-jwt", // Donne un nom unique à cette stratégie
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    logger.info("JWT payload received for admin:", jwt_payload);
    try {
      const user = await MoovicarUsers.findOne({
        where: { email: jwt_payload.sub }, // Vérifie si l'utilisateur est un admin
      });

      if (user) {
        logger.info("Admin found:", user);
        return done(null, user);
      } else {
        logger.info("Admin not found for email:", jwt_payload.sub);
        return done(null, false); // Refuser l'accès si l'utilisateur n'est pas admin
      }
    } catch (err) {
      logger.error("Error while finding admin:", err);
      return done(err, false);
    }
  }),
);

router.post("/login", function (req, res, next) {
  passport.authenticate("local-signin-web2", function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
      }
      const token = jwt.sign({ sub: req.user.email }, jwtOptions.secretOrKey);
      res.cookie("jwtToken", token, {
        maxAge: 86400 * 1000,
        // domain: ".app.moovicar.com",
        path: "/",
        secure: false,
        httpOnly: false,
        sameSite: "Lax",
      });
      return res.status(200).json({ success: true }); // Connexion réussie
    });
  })(req, res, next);
});

router.post("/support-login", function (req, res, next) {
  passport.authenticate("local-signin-admin", function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
      }
      const token = jwt.sign({ sub: req.user.email }, jwtOptions.secretOrKey);
      res.cookie("jwtToken", token);
      return res.status(200).json({ success: true, jwtToken: token }); // Connexion réussie
    });
  })(req, res, next);
});

router.post("/data/user-data", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userprofile.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuid.v4();

    const newUser = await merchantuser.create({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    await sendVerificationEmail(newUser, verificationToken);

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({ message: "Signup successful" });
    });
  } catch (err) {
    next(err);
  }
});

router.get("/verify", (req, res) => {
  userprofile
    .update(
      {
        verified: true,
      },
      {
        where: {
          verification_token: req.query.token,
        },
      },
    )
    .then(() => {
      logger.info("Userprofile updated successfully");
    })
    .catch((err) => {
      logger.error("Error updating user: ", err);
    });

  res.redirect("/");
});

// page "forgot password"
router.post("/forgot-password", requestPasswordReset);

// reset password (token en query comme ton /verify)
router.post("/reset-password", resetPassword);
//
router.get(
  "/",
  passport.authenticate("user-jwt", { session: false }),
  (req, res) => {
    // Query the database to retrieve user data
    userprofile
      .findOne({
        where: { email: req.user.email },
        attributes: {
          exclude: [
            "password",
            "verification_token",
            "token",
            "password_reset_token",
            "password_reset_expires",
            "googleId",
            "facebookId",
            "OpenID",
            "stripeCustomerId",
            "stripeAccountId",
            "access_tokenPaypal",
            "last4",
            "exp_month",
            "exp_year",
          ],
        },
      })
      .then((user) => {
        if (!user) {
          res.send(null);
        } else {
          req.user = { ...req.user.toJSON(), role: "user" };

          res.send(req.user || null);
        }
      })
      .catch((err) => {
        res.send(null);
      });
  },
);

router.get(
  "/auth/check-auth",
  passport.authenticate("user-jwt", { session: false }),
  (req, res) => {
    res.json({ isAuthenticated: true });
  },
);

// Création d'un client Stripe et mise à jour de la base de données
router.post(
  "/create-customer",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    const { email } = req.body;
    try {
      const customer = await stripe.customers.create({ email });
      const user = await userprofile.findOne({ where: { email } });

      if (user) {
        user.stripeCustomerId = customer.id;
        await user.save();
      } else {
        await userprofile.create({ email, stripeCustomerId: customer.id });
      }

      res.send(user || { email, stripeCustomerId: customer.id });
    } catch (error) {
      logger.error("Erreur lors de la création du client:", error);
      res.status(500).send(error);
    }
  },
);

// Création d'un compte connecté Stripe et mise à jour de la base de données
// router.post(
//   "/create-connected-account",
//   passport.authenticate("user-jwt", { session: false }),
//   async (req, res) => {
//     const { email } = req.body;
//     try {
//       // 1. Créer un token de compte
//       const accountToken = await stripe.tokens.create({
//         account: {
//           business_type: "individual", // Spécifiez le type de business ici
//           individual: {
//             email: email,
//             // Ajoutez ici d'autres informations nécessaires sur l'utilisateur
//             // par exemple: first_name, last_name, etc.
//           },
//           tos_shown_and_accepted: true,
//         },
//       });

//       // 2. Utiliser ce token pour créer le compte connecté
//       const account = await stripe.accounts.create({
//         type: "custom",
//         country: "FR",
//         account_token: accountToken.id,
//         capabilities: {
//           card_payments: { requested: true },
//           transfers: { requested: true },
//         },
//       });

//       const user = await userprofile.findOne({ where: { email } });

//       if (user) {
//         user.stripeAccountId = account.id;
//         await user.save();
//       } else {
//         return res.status(404).send({ error: "User not found" });
//       }

//       res.send(user);
//     } catch (error) {
//       logger.error("Erreur lors de la création du compte connecté:", error);
//       res.status(500).send(error);
//     }
//   },
// );

router.post(
  "/create-connected-account",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await userprofile.findOne({
        where: { id: req.user.id },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      // 1️⃣ Créer un account token (obligatoire pour plateformes FR)
      const accountToken = await stripe.tokens.create({
        account: {
          individual: {
            first_name: user.firstName || "Prénom",
            last_name: user.lastName || "Nom",
            email: user.email,
          },
          business_type: "individual",
          tos_shown_and_accepted: true,
        },
      });

      // 2️⃣ Créer un compte Stripe Custom avec le token
      const account = await stripe.accounts.create({
        type: "custom",
        country: "FR",
        email: user.email,
        account_token: accountToken.id,
        capabilities: {
          transfers: { requested: true },
        },
      });

      // 3️⃣ Sauvegarder l'id Stripe
      user.stripeAccountId = account.id;
      await user.save();

      // 4️⃣ Créer le lien d'onboarding Stripe
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:3000/stripe/refresh",
        return_url: "https://localhost:3000/stripe/success",
        type: "account_onboarding",
      });

      res.json({
        stripeAccountId: account.id,
        onboardingUrl: accountLink.url,
      });
    } catch (error) {
      logger.error("Erreur création compte Stripe:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Transférer de l'argent vers le compte bancaire d'un propriétaire
// Body: { amount, currency, destinationUserId, description }
router.post(
  "/transfer-to-owner",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    try {
      const {
        amount,
        currency = "eur",
        destinationUserId,
        reservationId,
        description,
      } = req.body;

      if (!amount || !destinationUserId) {
        return res
          .status(400)
          .json({ error: "amount et destinationUserId sont requis" });
      }

      const owner = await userprofile.findOne({
        where: { id: destinationUserId },
      });

      if (!owner) {
        return res.status(404).json({ error: "Propriétaire introuvable" });
      }

      if (!owner.stripeAccountId) {
        return res
          .status(400)
          .json({ error: "Le propriétaire n'a pas de compte Stripe connecté" });
      }

      // Transférer depuis le solde de la plateforme vers le compte connecté
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100), // en centimes
        currency,
        destination: owner.stripeAccountId,
        description:
          description || `Paiement location - propriétaire ${owner.id}`,
      });

      // Déclencher manuellement le virement vers l'IBAN
      const payout = await stripe.payouts.create(
        {
          amount: Math.round(amount * 100),
          currency,
        },
        {
          stripeAccount: owner.stripeAccountId,
        },
      );

      await Transaction.create({
        type: "payout",
        reservationId: reservationId || null,
        hostId: owner.id,
        amount,
        currency,
        stripeTransferId: transfer.id,
        stripePayoutId: payout.id,
        status: payout.status === "paid" ? "paid" : "pending",
        arrivalDate: payout.arrival_date
          ? new Date(payout.arrival_date * 1000)
          : null,
      });

      res.json({
        transferId: transfer.id,
        payoutId: payout.id,
        amount,
        currency,
        status: payout.status,
        arrivalDate: new Date(payout.arrival_date * 1000).toISOString(),
      });
    } catch (error) {
      logger.error("Erreur transfert vers propriétaire:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// Crée un SetupIntent pour sauvegarder un moyen de paiement sans débit immédiat
router.post(
  "/create-setup-intent",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) return res.status(404).send({ error: "User not found" });

      // Créer le customer Stripe si absent
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
          metadata: { userId: String(user.id) },
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: user.stripeCustomerId,
        payment_method_types: ["card"],
        usage: "off_session",
      });

      res.send({ clientSecret: setupIntent.client_secret });
    } catch (error) {
      logger.error("Erreur lors de la création du SetupIntent:", error);
      res.status(500).send(error);
    }
  },
);

// Confirme que la carte a été sauvegardée et met à jour le profil
router.post(
  "/confirm-card-setup",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    const { email, paymentMethodId } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) return res.status(404).send({ error: "User not found" });

      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
      if (pm.card) {
        user.last4 = pm.card.last4;
        user.exp_month = String(pm.card.exp_month);
        user.exp_year = String(pm.card.exp_year);
        await user.save();
      }

      res.send({ success: true, last4: user.last4 });
    } catch (error) {
      logger.error("Erreur lors de la confirmation de la carte:", error);
      res.status(500).send(error);
    }
  },
);

//
router.get(
  "/admin",
  passport.authenticate("admin-jwt", { session: false }),
  (req, res) => {
    // Query the database to retrieve user data
    MoovicarUsers.findOne({
      where: { email: req.user.email },
    })
      .then((user) => {
        if (!user) {
          res.send(null);
        } else {
          const userdata = {
            email: user.email,
            first_name: user.firstName,
            id: user.id,
            last_name: user.lastName,
            role: "administrator",
          };
          res.send(userdata || null);
        }
      })
      .catch((err) => {
        res.send(null);
      });
  },
);

//

router.get(
  "/admin/auth/check-auth",
  passport.authenticate("admin-jwt", { session: false }),
  (req, res) => {
    res.json({ isAuthenticated: true });
  },
);

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid"); // This logs out the user.
  res.clearCookie("jwtToken"); // This logs out the user.

  res.redirect("/");
});

// router.post("/create-connected-account", async (req, res) => {
//   const { email, account_holder_name, account_holder_type, iban } = req.body;

//   try {
//     // Créer un compte connecté
//     const account = await stripe.accounts.create({
//       type: "custom",
//       country: "DE", // Le pays du compte bancaire
//       email: email,
//       business_type: "individual", // ou 'company' selon le cas
//       individual: {
//         first_name: account_holder_name.split(" ")[0],
//         last_name: account_holder_name.split(" ")[1],
//         email: email,
//       },
//       business_profile: {
//         mcc: "5734", // Code MCC, ajustez selon votre besoin
//         product_description: "Custom Transfers",
//       },
//       capabilities: {
//         transfers: { requested: true },
//       },
//     });

//     if (!account || !account.id) {
//       throw new Error("Failed to create a connected account.");
//     }

//     // Ajouter un compte bancaire au compte connecté
//     const bankAccount = await stripe.accounts.createExternalAccount(
//       "acct_1032D82eZvKYlo2C",
//       {
//         external_account: "btok_1NAiJy2eZvKYlo2Cnh6bIs9c",
//       },
//     );

//     if (!bankAccount || !bankAccount.id) {
//       throw new Error(
//         "Failed to add the bank account to the connected account.",
//       );
//     }

//     res.json({
//       success: true,
//       accountId: account.id,
//       bankAccountId: bankAccount.id,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// POST /reservation/payout
router.post("/reservation/payout", async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation || !reservation.PaymentIntentId) {
      return res.status(404).json({ error: "Réservation introuvable" });
    }

    if (reservation.isPaidOut) {
      return res.status(400).json({ error: "Déjà payé" });
    }

    const account = await stripe.accounts.retrieve();

    if (account.capabilities.transfers !== "active") {
      return res.status(400).json({
        error: "Le compte Stripe du host n'est pas encore activé",
      });
    }

    // 1️⃣ Récupérer le PaymentIntent depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      reservation.PaymentIntentId,
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        error: "Paiement non confirmé",
      });
    }

    const totalAmount = paymentIntent.amount_received; // en centimes

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // 2️⃣ Récupérer le host
    const hostProfile = await userprofile.findOne({
      where: { id: reservation.driverHoteId },
    });

    if (!hostProfile || !hostProfile.stripeAccountId) {
      return res.status(404).json({ error: "Compte Stripe hôte introuvable" });
    }

    // --- AJOUTE CE BLOC ICI ---
    const hostStripeAccount = await stripe.accounts.retrieve(
      hostProfile.stripeAccountId,
    );

    console.log("Capabilities de l'HÔTE:", hostStripeAccount.capabilities);
    console.log(
      "Requirements de l'HÔTE:",
      hostStripeAccount.requirements.currently_due,
    );

    if (hostStripeAccount.capabilities.transfers !== "active") {
      return res.status(400).json({
        error: `Le compte de l'hôte n'est pas prêt. Status transfers: ${hostStripeAccount.capabilities.transfers}`,
        details: hostStripeAccount.requirements.currently_due, // Te dira ce qu'il manque
      });
    }
    // --------------------------

    // 3️⃣ Calcul 80%
    const payoutAmount = Math.floor(totalAmount * 0.8);

    // 4️⃣ Créer le transfert
    const transfer = await stripe.transfers.create({
      amount: payoutAmount,
      currency: paymentIntent.currency,
      destination: hostProfile.stripeAccountId,
    });

    // 5️⃣ Marquer comme payé
    await reservation.update({
      isPaidOut: true,
      payoutId: transfer.id,
    });

    res.json({
      success: true,
      payoutId: transfer.id,
      paidAmount: payoutAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/reservation/refund", async (req, res) => {
  try {
    const { reservationId, reason, type } = req.body; // type: 'annulation', 'carburant', 'force_majeure'

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation || !reservation.PaymentIntentId) {
      return res.status(404).json({ error: "Réservation introuvable" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      reservation.PaymentIntentId,
    );
    const totalAmount = paymentIntent.amount_received;

    let refundAmount = 0;
    const now = new Date();
    const createdAt = new Date(reservation.createdAt);
    const startDate = new Date(reservation.startDate);

    // --- LOGIQUE DE CALCUL SELON MOOVICAR ---

    if (type === "annulation") {
      const diffInHoursSinceBooking = (now - createdAt) / (1000 * 60 * 60);
      const diffInHoursBeforeStart = (startDate - now) / (1000 * 60 * 60);

      if (diffInHoursSinceBooking <= 1 || diffInHoursBeforeStart >= 48) {
        // Cas 1 & 2 : 100% Remboursement
        refundAmount = totalAmount;
      } else if (diffInHoursBeforeStart > 0 && diffInHoursBeforeStart < 48) {
        // Cas 3 : Remboursement partiel (ex: 50% ou frais fixes)
        refundAmount = Math.floor(totalAmount * 0.5);
      } else {
        // Cas 4 : Après le début
        return res
          .status(400)
          .json({ error: "Annulation après le début : aucun remboursement." });
      }
    } else if (type === "carburant") {
      // Logique carburant (ex: calcul via litres manquants envoyé dans le body)
      const { litresManquants } = req.body;
      refundAmount = litresManquants * 90; // 0.90€ en centimes
    }

    // --- EXECUTION DU REMBOURSEMENT SUR STRIPE ---
    if (refundAmount > 0) {
      const refund = await stripe.refunds.create({
        payment_intent: reservation.PaymentIntentId,
        amount: refundAmount, // Montant calculé en centimes
        reason: "requested_by_customer",
        metadata: { reason_detail: reason },
      });

      // Mettre à jour la base de données
      await reservation.update({
        status:
          refundAmount === totalAmount ? "refunded" : "partially_refunded",
        refundId: refund.id,
      });

      return res.json({ success: true, refunded: refundAmount });
    }

    res.status(400).json({ error: "Aucun montant à rembourser calculé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/stripe/refill-balance", async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      amount: 5000000, // 500.00 € (en centimes)
      currency: "eur",
      source: "tok_bypassPending", // Token magique Stripe pour ignorer le délai de 7 jours
      description: "Recharge immédiate du solde DISPONIBLE pour tests",
    });

    res.json({
      success: true,
      message: "500€ ajoutés à ton solde disponible !",
      chargeId: charge.id,
    });
  } catch (error) {
    console.error("Erreur recharge:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/delete-card", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userprofile.findOne({ where: { email } });

    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    // 1️⃣ Récupérer les cartes
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    // 2️⃣ Détacher la carte si elle existe
    if (paymentMethods.data.length > 0) {
      await stripe.paymentMethods.detach(paymentMethods.data[0].id);
    }

    // 3️⃣ Nettoyer la base
    await user.update({
      last4: null,
      exp_month: null,
      exp_year: null,
      stripeCustomerId: null, // si tu veux complètement dissocier
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Attacher un IBAN au compte Stripe connecté de l'utilisateur
router.post(
  "/add-bank-account",
  passport.authenticate("user-jwt", { session: false }),
  async (req, res) => {
    const { iban } = req.body;

    if (!iban) {
      return res.status(400).json({ error: "IBAN requis" });
    }

    try {
      const user = await userprofile.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      if (!user.stripeAccountId) {
        return res.status(400).json({
          error:
            "Compte Stripe connecté introuvable. Veuillez d'abord créer votre compte Stripe.",
        });
      }

      // 1️⃣ Créer un token bancaire depuis l'IBAN
      const bankToken = await stripe.tokens.create({
        bank_account: {
          country: "FR",
          currency: "eur",
          account_holder_name: `${user.firstName} ${user.lastName}`,
          account_holder_type: "individual",
          account_number: iban,
        },
      });

      // 2️⃣ Attacher le compte bancaire au compte Stripe connecté
      const bankAccount = await stripe.accounts.createExternalAccount(
        user.stripeAccountId,
        { external_account: bankToken.id },
      );

      // 3️⃣ Sauvegarder stripeBankAccountId et bankLast4
      await user.update({
        stripeBankAccountId: bankAccount.id,
        bankLast4: bankAccount.last4,
      });

      return res.json({
        success: true,
        stripeBankAccountId: bankAccount.id,
        bankLast4: bankAccount.last4,
      });
    } catch (error) {
      logger.error("Erreur lors de l'ajout du compte bancaire:", error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get(
  "/paiements/:userId",
  passport.authenticate("user-jwt", { session: false }),
  getPaiementsByUser,
);

module.exports = router;
