const PayPalStrategy = require("passport-paypal").Strategy;
const db = require("../models/index");
const userprofile = db.UserProfile;
const express = require("express");

const passport = require("passport");

const router = express.Router();

passport.use(
  new PayPalStrategy(
    {
      clientID: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_SECRET_KEY,
      callbackURL: "http://localhost:3001/auth/paypal/callback",
      returnURL: "http://localhost:3001/auth/paypal/return",
      realm: "http://localhost:3001/",
    },
    function (accessToken, refreshToken, profile, done) {
      userprofile
        .findById({
          where: {
            OpenID: profile.id,
          },
        })
        .then((user) => {
          if (user) {
            // Update user or create
            userprofile
              .update(
                { OpenID: profile.id },
                {
                  where: {
                    OpenID: profile.id,
                  },
                }
              )
              .then(() => {
                console.log("Userprofile updated successfully");
                done(null, user);
              })
              .catch((err) => {
                console.error("Error updating user: ", err);
              });

            //done(null, user);
          } else {
            userprofile
              .create({
                OpenID: profile.id,
                email: profile.emails[0].value,
              })
              .then((newUser) => {
                done(null, newUser);
              });
          }
        });
    }
  )
);

router.get("/", passport.authenticate("paypal"));

router.get(
  "/callback",
  passport.authenticate("paypal", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
