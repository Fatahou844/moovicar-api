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
const checkinRoutes = require("./routes/checkin.routes");
const checkoutRoutes = require("./routes/checkout.routes");
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
const askupdateresa = require("./routes/askupdatereservation.routes.js");
const transactionRoutes = require("./routes/transaction.routes");
const payoutBatchRoutes = require("./routes/payoutBatch.routes");
const localMiddlewareAuth = require("./middlewares/localMiddleware");
const googleMiddlewareAuth = require("./middlewares/googleMiddleware");
const stripeMiddleware = require("./middlewares/stripeMiddleware.js");
const startCronJob = require("./services/nodeCronHotePerformances");
const {
  sendReservationAcceptedEmail,
} = require("./utils/sendReservationAcceptedEmail");
const {
  sendPaymentConfirmationEmail,
  sendPayoutNotificationEmail,
} = require("./utils/sendPaymentConfirmationEmail");
const {
  sendIdentityDocumentsReminder,
} = require("./utils/sendIdentityDocumentsReminder");
const {
  sendVehicleDocumentsReminder,
} = require("./utils/sendVehicleDocumentsReminder");

const path = require("path");

const userprofile    = db.UserProfile;
const MoovicarUsers  = db.MoovicarUsers;
const Reservation    = db.Reservation;
const Transaction    = db.Transaction;
const Paiements      = db.Paiements;
const ReservationGain = db.ReservationGain;

const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    secure: false,
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
  "sk_test_51NkmmiEcnL0rILcw6efLdctPVKtl7LIyweqzpfXJvwZQpcLU1E1IPlXNvtz5IETOoob7Wm0YHGxk6bmHZZOkpu5G00V1LDfuua",
);
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_fe3b1cc259b5bb1fed0bc747ef1cceefa7b0f2e7d523260e87e327bd9ebcb27e";

const cron = require("node-cron");

// Configuration de la session avec attributs SameSite et Secure

app.use(
  session({
    secret: "RETFFFXDSERGp38uY8EZlKEoGLWhgs0-rX0-p6vtpE72HHz9XqizGgHHNZ",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "Lax", // Nécessaire pour permettre les cookies cross-domain
      httpOnly: false,
      secure: false,
      // domain: "app.moovicar.com", // Protège le cookie d'un accès JavaScript
      maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (1 jour, par exemple)
    },
  }),
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
    origin: "http://localhost:3000",
    credentials: true,
  }),
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
      userConnections,
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
app.use("/api/admin/payout-batch", payoutBatchRoutes);
app.use("/api", localMiddlewareAuth);
app.use("/api/auth/google", googleMiddlewareAuth);
app.use("/api/stripe", stripeMiddleware);
app.use("/api/askupdateresa", askupdateresa);
app.use("/api/askupdateresa", askupdateresa);
app.use("/api/checkin", checkinRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/transactions", transactionRoutes);

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
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      logger.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    logger.info(`[Webhook] Received: ${event.type}`);

    try {
      switch (event.type) {

        /* ─────────────────────────────────────────────
           Paiement invité confirmé par Stripe
        ───────────────────────────────────────────── */
        case "payment_intent.succeeded": {
          const pi = event.data.object;
          const paymentIntentId = pi.id;
          const amountEur = pi.amount_received / 100;

          // 1. Trouver la réservation liée
          const reservation = await Reservation.findOne({
            where: { PaymentIntentId: paymentIntentId },
            include: [
              { model: userprofile, as: "Host",   attributes: ["id","firstName","lastName","email"] },
              { model: userprofile, as: "Invite", attributes: ["id","firstName","lastName","email"] },
              { model: db.Vehicle, attributes: ["id","principalPhotos"],
                include: [{ model: db.VehicleModel, attributes: ["marque","modele"] }] },
            ],
          });

          if (!reservation) {
            logger.warn(`[Webhook] payment_intent.succeeded — aucune résa pour PI ${paymentIntentId}`);
            break;
          }

          // 2. Mettre à jour reservationsGain type "0" → "2" (confirmé)
          await ReservationGain.update(
            { type: "2" },
            { where: { reservationId: reservation.reservationId, type: "0" } }
          );

          // 3. Créer l'entrée Paiements si elle n'existe pas encore
          const existing = await Paiements.findOne({
            where: { reservationId: reservation.reservationId },
          });
          if (!existing) {
            await Paiements.create({
              reservationId:   reservation.reservationId,
              userId:          reservation.driverInviteId,
              amount:          amountEur,
              paiementStatus:  "0",
              paiement_method: pi.payment_method_types?.[0] || "card",
              paymentIntentId: paymentIntentId,
              paiementData:    new Date(),
            });
          } else if (!existing.paymentIntentId) {
            await existing.update({ paymentIntentId, amount: amountEur });
          }

          // 4. Email confirmation invité
          const vehicleLabel = reservation.Vehicle
            ? `${reservation.Vehicle.VehicleModel?.marque} ${reservation.Vehicle.VehicleModel?.modele}`
            : "Véhicule";

          if (reservation.Invite?.email) {
            await sendPaymentConfirmationEmail({
              guest:       reservation.Invite,
              host:        reservation.Host,
              reservation: reservation,
              amount:      amountEur,
              vehicle:     vehicleLabel,
            }).catch(e => logger.error("[Webhook] Email confirmation error:", e.message));
          }

          logger.info(`[Webhook] ✅ PI ${paymentIntentId} traité — Resa #${reservation.reservationId}`);
          break;
        }

        /* ─────────────────────────────────────────────
           Litige ouvert par le porteur de carte
        ───────────────────────────────────────────── */
        case "charge.dispute.created": {
          const dispute = event.data.object;
          const piId    = dispute.payment_intent;
          if (piId) {
            await Paiements.update(
              { paiementStatus: "3" },
              { where: { paymentIntentId: piId } }
            );
            logger.info(`[Webhook] Litige ouvert — PI ${piId}`);
          }
          break;
        }

        /* ─────────────────────────────────────────────
           Litige résolu en faveur de l'hôte
        ───────────────────────────────────────────── */
        case "charge.dispute.closed": {
          const dispute = event.data.object;
          const piId    = dispute.payment_intent;
          if (piId) {
            const newStatus = dispute.status === "won" ? "1" : "4";
            await Paiements.update(
              { paiementStatus: newStatus },
              { where: { paymentIntentId: piId } }
            );
            logger.info(`[Webhook] Litige clôturé (${dispute.status}) — PI ${piId}`);
          }
          break;
        }

        /* ─────────────────────────────────────────────
           Remboursement effectué
        ───────────────────────────────────────────── */
        case "charge.refunded": {
          const charge = event.data.object;
          const piId   = charge.payment_intent;
          if (piId) {
            await Paiements.update(
              { paiementStatus: "4" },
              { where: { paymentIntentId: piId } }
            );
            logger.info(`[Webhook] Remboursement confirmé — PI ${piId}`);
          }
          break;
        }

        /* ─────────────────────────────────────────────
           Virement hôte arrivé
        ───────────────────────────────────────────── */
        case "transfer.paid": {
          const transfer = event.data.object;
          const paiement = await Paiements.findOne({
            where: { transactionID: transfer.id },
            include: [{
              model: Reservation,
              attributes: ["reservationId","startDate","endDate","driverHoteId"],
            }],
          });
          if (paiement && paiement.Reservation) {
            const host = await userprofile.findOne({
              where: { id: paiement.Reservation.driverHoteId },
              attributes: ["id","firstName","lastName","email"],
            });
            if (host?.email) {
              await sendPayoutNotificationEmail({
                host,
                amount:      transfer.amount / 100,
                transferId:  transfer.id,
                reservation: paiement.Reservation,
                vehicle:     `Réservation #${paiement.Reservation.reservationId}`,
              }).catch(e => logger.error("[Webhook] Email payout error:", e.message));
            }
          }
          logger.info(`[Webhook] Transfer paid — ${transfer.id}`);
          break;
        }

        /* ─────────────────────────────────────────────
           Virement IBAN hôte confirmé par la banque
        ───────────────────────────────────────────── */
        case "payout.paid": {
          const payout = event.data.object;
          await Transaction.update(
            { status: "paid" },
            { where: { stripePayoutId: payout.id } }
          );
          logger.info(`[Webhook] ✅ Payout paid — ${payout.id}`);
          break;
        }

        /* ─────────────────────────────────────────────
           Virement IBAN hôte échoué
        ───────────────────────────────────────────── */
        case "payout.failed": {
          const payout = event.data.object;
          await Transaction.update(
            { status: "failed" },
            { where: { stripePayoutId: payout.id } }
          );
          logger.warn(`[Webhook] ❌ Payout failed — ${payout.id} — raison: ${payout.failure_message}`);
          break;
        }

        default:
          logger.info(`[Webhook] Event ignoré: ${event.type}`);
      }
    } catch (err) {
      logger.error(`[Webhook] Erreur traitement ${event.type}:`, err.message);
      return res.status(500).send("Internal error");
    }

    res.json({ received: true });
  },
);

/* ─────────────────────────────────────────────────────────────────
   DEV ONLY — Génère des réservations fictives avec de vraies données
───────────────────────────────────────────────────────────────── */
app.post("/api/seed/reservations", async (req, res) => {
  try {
    const INVITE_ID = 2; // locataire fixe

    // 1️⃣ Récupérer toutes les annonces actives avec leur hôte
    const annonces = await db.VehiculeAnnonce.findAll({
      where: { status: "1" },
      include: [{ model: db.Vehicle, attributes: ["id", "userId"] }],
      limit: 10,
    });

    if (!annonces.length) {
      return res.status(404).json({ error: "Aucune annonce active trouvée en base." });
    }

    const statuses = [
      "pending", "accepted", "paid", "in_progress", "completed", "cancelled", "refunded",
    ];

    const created = [];

    for (const annonce of annonces) {
      const hoteId = annonce.Vehicle?.userId;
      if (!hoteId || hoteId === INVITE_ID) continue;

      // Dates aléatoires dans les 60 derniers jours
      const daysAgo   = Math.floor(Math.random() * 50) + 5;
      const duration  = Math.floor(Math.random() * 5) + 1;
      const startDate = new Date(Date.now() - daysAgo * 86400000);
      const endDate   = new Date(startDate.getTime() + duration * 86400000);
      const amount    = parseFloat(annonce.reservationPrice || 80) * duration;
      const status    = statuses[Math.floor(Math.random() * statuses.length)];

      const resa = await db.Reservation.create({
        driverHoteId:     hoteId,
        driverInviteId:   INVITE_ID,
        vehiculeId:       annonce.vehiculeId,
        vehiculeAnnonceId: annonce.vehiculeAnnonceId,
        startDate,
        endDate,
        startEmplacement: annonce.locationAddress || "Paris, France",
        endEmplacement:   annonce.locationAddress || "Paris, France",
        status,
        isPaidOut: status === "completed" || status === "closed",
      });

      // Créer un ReservationGain + Paiement si statut avancé
      if (["paid", "in_progress", "completed", "closed"].includes(status)) {
        const gain = await db.ReservationGains.create({
          reservationId: resa.reservationId,
          amount: String(amount),
          type: "1",
        });

        await db.Paiements.create({
          reservationId:   resa.reservationId,
          userId:          INVITE_ID,
          amount,
          paiementStatus:  status === "completed" ? "2" : "1",
          paiement_method: "card",
          paiementData:    new Date(),
          TransactionDate: new Date(),
        });
      }

      created.push({ reservationId: resa.reservationId, status, amount, hoteId });
    }

    res.json({ created: created.length, reservations: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=train_station|airport&key=${apiKey}&language=fr&components=country:fr`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/autocomplete/mapbox", async (req, res) => {
  const { input } = req.query;
  const apiKey =
    "sk.eyJ1IjoiYWhhbWFkaSIsImEiOiJjbTlpZHJoOWswMTV4MmlxdjNvMjllN2FvIn0.L5XqZDCk_aWwOSog5FVB7g";
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${input}&limit=10&access_token=${apiKey}&country=fr`,
    );
    const data = await response.json();
    res.json(data?.features || []);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/details", async (req, res) => {
  const { place_id } = req.query;
  const apiKey = "AIzaSyCohDl0FgnpiYEtbTE1EURv4WYEaM_Xtow";
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ask-documents-invite", async (req, res) => {
  const data = await sendIdentityDocumentsReminder(req.body);
  res.json({ message: "success" });
});

app.post("/api/ask-documents-vevicule", async (req, res) => {
  await sendVehicleDocumentsReminder(req.body);
  res.json({ message: "success" });
});

app.use(express.static(path.join(__dirname, "public")));

// app.get("*", (req, res) => {
//   req.lang = req.params.lang;
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Importer et exécuter les cron jobs
require("./services/nodeCronJobsCancelledCondititions");
require("./services/nodeCronPayoutHotes");

// Socket.io pour les notifications en temps réel

server.listen(PORT, () => {
  logger.info("Serveur backend lancé sur le port " + PORT);
  // startCronJob();
});

// Planification : S'exécute par exemple toutes les nuits à minuit (0 0 * * *)
// Pour tes tests, tu peux mettre '* * * * *' (toutes les minutes)
cron.schedule("*/1 * * * *", async () => {
  console.log("--- Lancement du traitement automatique des payouts ---");

  try {
    // 1. Trouver les réservations terminées, non payées, avec un PaymentIntent
    const pendingReservations = await Reservation.findAll({
      where: {
        isPaidOut: false,
        status: "completed", // Assure-toi d'avoir un statut "terminé"
      },
    });

    for (const reser of pendingReservations) {
      try {
        // Logique de transfert (identique à ton routeur)
        const host = await userprofile.findOne({
          where: { id: reser.driverHoteId },
        });

        if (host && host.stripeAccountId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            reser.PaymentIntentId,
          );
          const payoutAmount = Math.floor(paymentIntent.amount_received * 0.8);

          const transfer = await stripe.transfers.create({
            amount: payoutAmount,
            currency: paymentIntent.currency,
            destination: host.stripeAccountId,
            description: `Paiement location - propriétaire ${host.id}`,
          });

          // Déclencher le virement vers l'IBAN du propriétaire
          const payout = await stripe.payouts.create(
            { amount: payoutAmount, currency: paymentIntent.currency },
            { stripeAccount: host.stripeAccountId },
          );

          await reser.update({ isPaidOut: true, payoutId: payout.id });

          // Enregistrer la transaction dans l'historique
          await Transaction.create({
            type: "payout",
            reservationId: reser.reservationId,
            hostId: host.id,
            amount: payoutAmount / 100,
            currency: paymentIntent.currency,
            stripeTransferId: transfer.id,
            stripePayoutId: payout.id,
            status: payout.status === "paid" ? "paid" : "pending",
            arrivalDate: payout.arrival_date
              ? new Date(payout.arrival_date * 1000)
              : null,
          });

          console.log(`✅ Payout réussi pour Resa ID: ${reser.reservationId}`);
        }
      } catch (innerError) {
        console.error(
          `❌ Échec payout pour Resa ID ${reser.reservationId}:`,
          innerError.message,
        );
      }
    }
  } catch (error) {
    console.error("Erreur globale tâche cron:", error);
  }
});
