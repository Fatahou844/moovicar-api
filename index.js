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
const vehicleModelRoutes = require("./routes/vehicleModel.routes");
const vehicleOptionsRoutes = require("./routes/vehicleOption.routes");
const vehicleOptionRecordsRoutes = require("./routes/vehicleOptionRecord.routes");
const vehicleAnnoncesRoutes = require("./routes/vehicleAnnonce.routes");
const facturationAddressRoutes = require("./routes/facturationAddress.routes");
const availabilityRoutes = require("./routes/availability.routes");
const unavailabilityRoutes = require("./routes/unavailability.routes");
const pricingsRoutes = require("./routes/pricing.routes");
const discountRoutes = require("./routes/discount.routes");
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

const startCronJob = require("./services/nodeCronHotePerformances");

const path = require("path");

const userprofile = db.UserProfile;

const cors = require("cors");
const reservationpreferences = require("./models/reservationpreferences");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, // Permet l'envoi de cookies
  },
});
// Utilisez le middleware body-parser pour traiter le corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.db = db;

const PORT = process.env.PORT || 3001;

const stripe = require("stripe")(
  "sk_test_51NkmmiEcnL0rILcw6efLdctPVKtl7LIyweqzpfXJvwZQpcLU1E1IPlXNvtz5IETOoob7Wm0YHGxk6bmHZZOkpu5G00V1LDfuua"
);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_fe3b1cc259b5bb1fed0bc747ef1cceefa7b0f2e7d523260e87e327bd9ebcb27e";
app.use(
  session({
    secret: "xR7Fb2#z!5G8LmN@e6T9p$WqK3vHsYcU4jXo&1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Assurez-vous que c'est `true` si vous utilisez HTTPS
      sameSite: "none", // Permet de partager les cookies entre différents domaines
    },
  })
);

// Utilisation du middleware nocache pour désactiver le cache HTTP
app.use(nocache());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userprofile.findByPk(id).then((user) => {
    done(null, user);
  });
});

app.db.sequelize
  .authenticate({
    logging: false,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
// Active le middleware cors pour toutes les routes
app.use(
  cors({
    origin: "*",
  })
);
// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Objet pour stocker les connexions utilisateur
const userConnections = {};

io.on("connection", (socket) => {
  console.log("New client connected");

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
    console.log("Client disconnected");
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.userConnections = userConnections;
  next();
});

//Definitions des routes
app.use("/api/vehicles", vehicleRoutes);
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

app.use("/api", localMiddlewareAuth);
app.use("/api/auth/google", googleMiddlewareAuth);

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
        console.log("Paiement réussi :", paymentIntent);
        response.status(200).json({ message: "Paiement réussi." });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
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

app.get("*", (req, res) => {
  req.lang = req.params.lang;
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.listen(PORT, (error) => {
//   if (!error)
//     console.log(
//       "Server is Successfully Running, and App is listening on port " + PORT
//     );
//   else console.log("Error occurred, server can't start", error);
// });

// Importer et exécuter le cron job
require("./services/nodeCronJobsCancelledCondititions");

// Socket.io pour les notifications en temps réel

server.listen(PORT, () => {
  console.log("Serveur backend lancé sur le port " + PORT);
  startCronJob();
});
