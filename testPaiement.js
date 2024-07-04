const express = require("express");
const stripe = require("stripe")("your_stripe_secret_key");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

// Création d'un client Stripe et mise à jour de la base de données
app.post("/create-customer", async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({ email });
    const result = await pool.query(
      "INSERT INTO userprofiles (email, stripe_customer_id) VALUES ($1, $2) RETURNING *",
      [email, customer.id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    res.status(500).send(error);
  }
});

// Création d'un compte connecté Stripe et mise à jour de la base de données
app.post("/create-connected-account", async (req, res) => {
  const { email } = req.body;
  try {
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    const result = await pool.query(
      "UPDATE userprofiles SET stripe_account_id = $1 WHERE email = $2 RETURNING *",
      [account.id, email]
    );
    res.send(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création du compte connecté:", error);
    res.status(500).send(error);
  }
});

// Création d'une intention de paiement
app.post("/create-payment-intent", async (req, res) => {
  const { email, amount } = req.body;
  try {
    const result = await pool.query(
      "SELECT stripe_customer_id FROM userprofiles WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    const customer = result.rows[0].stripe_customer_id;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      customer: customer,
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'intention de paiement:",
      error
    );
    res.status(500).send(error);
  }
});

// Transfert de fonds à un compte connecté
app.post("/transfer-funds", async (req, res) => {
  const { email, amount } = req.body;
  try {
    const result = await pool.query(
      "SELECT stripe_account_id FROM userprofiles WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    const account = result.rows[0].stripe_account_id;
    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: "usd",
      destination: account,
    });
    res.send({ transferId: transfer.id });
  } catch (error) {
    console.error("Erreur lors du transfert des fonds:", error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
