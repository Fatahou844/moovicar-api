const GoogleStrategy = require("passport-google-oauth2").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require("../models/index");
const userprofile = db.UserProfile;
const express = require("express");
const session = require("express-session");
const cors = require("cors"); // Importez le module cors
const passport = require("passport");

const router = express.Router();

passport.use(
  new BearerStrategy(function (token, done) {
    userprofile.findOne({ accessToken: token }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user, { scope: "read" });
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config["google"].clientID,
      clientSecret: config["google"].clientSecret,
      callbackURL: config["google"].callbackURL,
      passReqToCallback: true,
      scope: ["profile", "email"],
      proxy: true,
      debug: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in the database
      console.log("profile");
      console.log(profile);
      userprofile
        .findOne({
          where: {
            [Op.or]: [
              { googleId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        })
        .then((user) => {
          if (user) {
            // Update user or create
            userprofile
              .update(
                { googleId: profile.id },
                {
                  where: {
                    email: user.email,
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
            // Create a new user in the database
            const passwordValue = Math.random().toString(36).slice(2, 10);
            const verificationToken = uuid.v4();
            userprofile
              .create({
                googleId: profile.id,
                email: profile.emails[0].value,
                password: passwordValue,
                token: accessToken,
                verification_token: verificationToken,
                verified: 1,
              })
              .then((newUser) => {
                const confirmation_link =
                  "https://api.veritatrust.com/user-changepassword/" +
                  verificationToken;

                done(null, newUser);
              });
          }
        });
    }
  )
);

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    // Renvoie une réponse avec un modèle d'iframe
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Sign-In</title>
      </head>
      <body>
        <iframe src="https://accounts.google.com/gsi/button?click_listener=()%3D%3E%7Bn(%22Button%20Clicked%22%2C%7Bname%3A%22google%22%2Caction%3A%22Google%20authentication%22%7D)%7D&amp;logo_alignment=left&amp;size=large&amp;shape=circle&amp;text=continue_with&amp;theme=outline&amp;type=standard&amp;width=320&amp;client_id=YOUR_CLIENT_ID&amp;iframe_id=gsi_154909_815446&amp;as=3ikm9wxW%2FrHI8CGzQfyHeQ&amp;hl=fr_FR" id="gsi_154909_815446" title="Bouton &quot;Se connecter avec Google&quot;" style="display: block; position: relative; top: 0px; left: 0px; height: 44px; width: 340px; border: 0px; margin: -2px -10px;" tabindex="-1"></iframe>
      </body>
      </html>
    `);
  }
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/account",
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

module.exports = router;
