const LocalStrategy = require("passport-local").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const db = require("../models/index");
const userprofile = db.UserProfile;
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
    }
  )
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
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_SESSION_JWT,
};

passport.use(
  "userprofile",
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    logger.info("JWT payload received in localMiddleware:", jwt_payload);
    try {
      const user = await userprofile.findOne({
        where: { email: jwt_payload.sub },
      });

      if (user) {
        logger.info(
          "Je suis sur la verification des utilisateurs lambda:",
          user
        );
        return done(null, user);
      } else {
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
      }
    } catch (err) {
      logger.error("Error while finding user:", err);
      return done(err, false);
    }
  })
);

// router.post("/login", function (req, res, next) {
//   passport.authenticate("local-signin-web2", function (err, user, info) {
//     if (err) {
//       return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
//     }
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
//       }
//       const token = jwt.sign({ sub: req.user.email }, jwtOptions.secretOrKey);
//       res.cookie("jwtToken", token);
//       return res.status(200).json({ success: true }); // Connexion réussie
//     });
//   })(req, res, next);
// });

// router.post("/support-login", function (req, res, next) {
//   passport.authenticate("local-signin-admin", function (err, user, info) {
//     if (err) {
//       return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
//     }
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
//       }
//       const token = jwt.sign({ sub: req.user.email }, jwtOptions.secretOrKey);
//       res.cookie("jwtToken", token);
//       return res.status(200).json({ success: true, jwtToken: token }); // Connexion réussie
//     });
//   })(req, res, next);
// });

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
        httpOnly: true,
        secure: false, // Ne pas utiliser sur localhost sans HTTPS
        sameSite: "Lax", // Pour le développement local
        path: "/", // Ne spécifiez pas le domaine ici
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
      }
    )
    .then(() => {
      logger.info("Userprofile updated successfully");
    })
    .catch((err) => {
      logger.error("Error updating user: ", err);
    });

  res.redirect("/");
});

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    // Query the database to retrieve user data
    userprofile
      .findOne({ where: { email: req.user.email } })
      .then((user) => {
        if (!user) {
          res.send(null);
        } else {
          req.user.role = "user";

          res.send(req.user || null);
        }
      })
      .catch((err) => {
        res.send(null);
      });
  } else {
    res.send(null);
  }
});

router.get("/auth/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Création d'un client Stripe et mise à jour de la base de données
router.post(
  "/create-customer",
  passport.authenticate("userprofile", { session: false }),
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
  }
);

// Création d'un compte connecté Stripe et mise à jour de la base de données
router.post(
  "/create-connected-account",
  passport.authenticate("userprofile", { session: false }),
  async (req, res) => {
    const { email } = req.body;
    try {
      // 1. Créer un token de compte
      const accountToken = await stripe.tokens.create({
        account: {
          business_type: "individual", // Spécifiez le type de business ici
          individual: {
            email: email,
            // Ajoutez ici d'autres informations nécessaires sur l'utilisateur
            // par exemple: first_name, last_name, etc.
          },
          tos_shown_and_accepted: true,
        },
      });

      // 2. Utiliser ce token pour créer le compte connecté
      const account = await stripe.accounts.create({
        type: "custom",
        country: "FR",
        account_token: accountToken.id,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      const user = await userprofile.findOne({ where: { email } });

      if (user) {
        user.stripeAccountId = account.id;
        await user.save();
      } else {
        return res.status(404).send({ error: "User not found" });
      }

      res.send(user);
    } catch (error) {
      logger.error("Erreur lors de la création du compte connecté:", error);
      res.status(500).send(error);
    }
  }
);

router.post(
  "/add-card",
  passport.authenticate("userprofile", { session: false }),
  async (req, res) => {
    const { email, token } = req.body;
    try {
      const user = await userprofile.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const card = await stripe.customers.createSource(user.stripeCustomerId, {
        source: token,
      });

      if (user) {
        user.last4 = card.last4;
        user.exp_month = card.exp_month;
        user.exp_year = card.exp_year;
        await user.save();
      }

      res.send(card);
    } catch (error) {
      logger.error("Erreur lors de l'ajout de la carte:", error);
      res.status(500).send(error);
    }
  }
);

router.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
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
  } else {
    res.send(null);
  }
});

router.get("/admin/auth/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid"); // This logs out the user.

  res.redirect("/");
});

router.post("/create-connected-account", async (req, res) => {
  const { email, account_holder_name, account_holder_type, iban } = req.body;

  try {
    // Créer un compte connecté
    const account = await stripe.accounts.create({
      type: "custom",
      country: "DE", // Le pays du compte bancaire
      email: email,
      business_type: "individual", // ou 'company' selon le cas
      individual: {
        first_name: account_holder_name.split(" ")[0],
        last_name: account_holder_name.split(" ")[1],
        email: email,
      },
      business_profile: {
        mcc: "5734", // Code MCC, ajustez selon votre besoin
        product_description: "Custom Transfers",
      },
      capabilities: {
        transfers: { requested: true },
      },
    });

    if (!account || !account.id) {
      throw new Error("Failed to create a connected account.");
    }

    // Ajouter un compte bancaire au compte connecté
    const bankAccount = await stripe.accounts.createExternalAccount(
      "acct_1032D82eZvKYlo2C",
      {
        external_account: "btok_1NAiJy2eZvKYlo2Cnh6bIs9c",
      }
    );

    if (!bankAccount || !bankAccount.id) {
      throw new Error(
        "Failed to add the bank account to the connected account."
      );
    }

    res.json({
      success: true,
      accountId: account.id,
      bankAccountId: bankAccount.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get(
  "/paiements/:userId",
  passport.authenticate("userprofile", { session: false }),
  getPaiementsByUser
);

module.exports = router;
