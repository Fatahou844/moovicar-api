require("dotenv").config();
const express = require("express");
const nocache = require("nocache");
const session = require("express-session");
const passport = require("passport");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const db = require("./models/index");
const vehicleRoutes = require("./routes/vehicle.routes");
const users = require("./routes/userprofiles.routes");
const cookieParser = require("cookie-parser");
const vehicleModelRoutes = require("./routes/vehicleModel.routes");
const vehicleOptionsRoutes = require("./routes/vehicleOption.routes");
const vehicleOptionRecordsRoutes = require("./routes/vehicleOptionRecord.routes");
const vehicleAnnoncesRoutes = require("./routes/vehicleAnnonce.routes");
const facturationAddressRoutes = require("./routes/facturationAddress.routes");
const availabilityRoutes = require("./routes/availability.routes");
const unavailabilityRoutes = require("./routes/unavailability.routes");
const pricingsRoutes = require("./routes/pricing.routes");
const discountRoutes = require("./routes/discount.routes");
const paiementsRoutes = require("./routes/paiements.routes");
const logger = require("./logger");
const deliverylocationRoutes = require("./routes/deliverylocation.routes");
const reservationcarspreferencesRoutes = require("./routes/reservationcarspreferences.routes");
const hoteavailabilitiesRoutes = require("./routes/hoteavailabilities.routes");
const hoteunavailabilitiesRoutes = require("./routes/hoteunaivalabilities.routes");
const reviewRoutes = require("./routes/reviewvehicle.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const reservationsRoutes = require("./routes/reservation.routes");
const conversationsRoutes = require("./routes/conversation.routes");
const reservationsGainRoutes = require("./routes/reservationGain.routes");
const localMiddlewareAuth = require("./middlewares/localMiddleware");
const googleMiddlewareAuth = require("./middlewares/googleMiddleware");
const stripeMiddleware = require("./middlewares/stripeMiddleware.js");
const startCronJob = require("./services/nodeCronHotePerformances");
const path = require("path");

const userprofile = db.UserProfile;
const MoovicarUsers = db.MoovicarUsers;

const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    secure: true,
    credentials: true, // Permet l'envoi de cookies
  },
});
// Utilisez le middleware body-parser pour traiter le corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.db = db;
const PORT = process.env.PORT || 3001;
const stripe = require("stripe")(
  "sk_test_51NkmmiEcnL0rILcw6efLdctPVKtl7LIyweqzpfXJvwZQpcLU1E1IPlXNvtz5IETOoob7Wm0YHGxk6bmHZZOkpu5G00V1LDfuua"
);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_fe3b1cc259b5bb1fed0bc747ef1cceefa7b0f2e7d523260e87e327bd9ebcb27e";

// Configuration de la session avec attributs SameSite et Secure

app.use(
  session({
    secret: "RETFFFXDSERGp38uY8EZlKEoGLWhgs0-rX0-p6vtpE72HHz9XqizGgHHNZ",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((err, req, res, next) => {
  logger.info(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Utilisation du middleware nocache pour désactiver le cache HTTP
// app.use(nocache());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = null;

    // Utilisez l'ID pour récupérer l'utilisateur de la table userprofile
    const userDataUserProfile = await userprofile.findByPk(id);

    if (userDataUserProfile) {
      // L'utilisateur est un utilisateur de l'application
      user = {
        ...userDataUserProfile.toJSON(),
        userRole: "user",
      };
      done(null, user);
    } else {
      // Essayez de récupérer l'utilisateur depuis la table VeritatrustUsers
      const userDataMoovicarUsers = await MoovicarUsers.findByPk(id);

      if (userDataMoovicarUsers) {
        // L'utilisateur est un membre de l'équipe de support
        user = {
          ...userDataMoovicarUsers.toJSON(),
          userRole: "admin",
        };
        done(null, user);
      } else {
        logger.info(`Aucun utilisateur trouvé avec l'ID ${id}`);
        done(null, false); // Signale que l'utilisateur n'a pas été trouvé
      }
    }
  } catch (err) {
    logger.info(err);
    done(err);
  }
});

app.db.sequelize
  .authenticate({
    logging: false,
  })
  .then(() => {
    logger.info("Connected to the database");
  })
  .catch((err) => {
    logger.info("Unable to connect to the database:", err);
  });
// Active le middleware cors pour toutes les routes
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Objet pour stocker les connexions utilisateur
const userConnections = {};

io.on("connection", (socket) => {
  logger.info("New client connected");

  socket.on("register", (userId) => {
    userConnections[userId] = socket.id;
  });

  socket.on("reservation", (reservationId) => {
    userConnections[reservationId] = socket.reservationId;
  });

  socket.on("disconnect", () => {
    for (const [userId, reservationId, socketId] of Object.entries(
      userConnections
    )) {
      if (socketId === socket.id) {
        delete userConnections[userId];
        break;
      }

      if (socketId === socket.id) {
        delete userConnections[reservationId];
        break;
      }
    }
    logger.info("Client disconnected");
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.userConnections = userConnections;
  next();
});

//Definitions des routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", users);
app.use("/api/vehicleModels", vehicleModelRoutes);
app.use("/api/vehicleOptions", vehicleOptionsRoutes);
app.use("/api/vehicleOptionRecords", vehicleOptionRecordsRoutes);
app.use("/api/vehicleAnnonces", vehicleAnnoncesRoutes);
app.use("/api/facturationAddress", facturationAddressRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/availabilities", availabilityRoutes);
app.use("/api/unavailabilities", unavailabilityRoutes);
app.use("/api/pricings", pricingsRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/deliverylocation", deliverylocationRoutes);
app.use("/api/reservationpreferences", reservationcarspreferencesRoutes);
app.use("/api/hoteavailabilities", hoteavailabilitiesRoutes);
app.use("/api/hoteunavailabilities", hoteunavailabilitiesRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reservationsGain", reservationsGainRoutes);
app.use("/api/paiements", paiementsRoutes);
app.use("/api", localMiddlewareAuth);
app.use("/api/auth/google", googleMiddlewareAuth);
app.use("/api/stripe", stripeMiddleware);

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/access-authorisation", (req, res) => {
  const authHeader = req.headers["authorization"];
  let authorizationKey = authHeader && authHeader.split(" ")[1];

  if (authorizationKey.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
    res.json({ message: "success" });
  } else {
    res.json({ message: "No Authorization" });
  }
});

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "eur",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const payload = {
      id: "evt_test_webhook",
      object: "event",
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const secret = endpointSecret;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    let event;

    try {
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        // Then define and call a function to handle the event payment_intent.amount_capturable_updated
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        logger.info("Paiement réussi :", paymentIntent);
        response.status(200).json({ message: "Paiement réussi." });
        break;
      // ... handle other event types
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.post("/api/refund-payment", async (req, res) => {
  const { PaymentIntentId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const refund = await stripe.refunds.create({
    payment_intent: PaymentIntentId,
  });

  res.send({
    refundId: refund,
  });
});

app.get("/api/autocomplete", async (req, res) => {
  const { input } = req.query;
  const apiKey = "AIzaSyCohDl0FgnpiYEtbTE1EURv4WYEaM_Xtow";
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=train_station|airport&key=${apiKey}&language=fr&components=country:fr`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/details", async (req, res) => {
  const { place_id } = req.query;
  const apiKey = "AIzaSyCohDl0FgnpiYEtbTE1EURv4WYEaM_Xtow";
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("*", (req, res) => {
  req.lang = req.params.lang;
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Importer et exécuter le cron job
require("./services/nodeCronJobsCancelledCondititions");

// Socket.io pour les notifications en temps réel

server.listen(PORT, () => {
  logger.info("Serveur backend lancé sur le port " + PORT);
  startCronJob();
});
