const LocalStrategy = require("passport-local").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const db = require("../models/index");
const userprofile = db.UserProfile;
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

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
      return res.status(200).json({ success: true }); // Connexion réussie
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
      console.log("Userprofile updated successfully");
    })
    .catch((err) => {
      console.error("Error updating user: ", err);
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
        }

        res.send(req.user || null);
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

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid"); // This logs out the user.

  res.redirect("/");
});

module.exports = router;
