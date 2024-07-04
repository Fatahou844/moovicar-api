import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import React, { useState } from 'react';
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("your_public_stripe_key");

const CreateCustomer = () => {
  const [email, setEmail] = useState("");

  const createCustomer = async () => {
    const response = await axios.post("http://localhost:3000/create-customer", {
      email,
    });
    console.log("Customer created:", response.data);
  };

  return (
    <div>
      <h2>Create Customer</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={createCustomer}>Create Customer</button>
    </div>
  );
};

const CreateConnectedAccount = () => {
  const [email, setEmail] = useState("");

  const createAccount = async () => {
    const response = await axios.post(
      "http://localhost:3000/create-connected-account",
      { email }
    );
    console.log("Connected Account created:", response.data);
  };

  return (
    <div>
      <h2>Create Connected Account</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={createAccount}>Create Account</button>
    </div>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data: clientSecret } = await axios.post(
      "http://localhost:3000/create-payment-intent",
      { email, amount }
    );

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email,
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", result.paymentIntent);
        // Here you can add logic to inform the support team
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const TransferFunds = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);

  const transferFunds = async () => {
    const response = await axios.post("http://localhost:3000/transfer-funds", {
      email,
      amount,
    });
    console.log("Funds transferred:", response.data);
  };

  return (
    <div>
      <h2>Transfer Funds</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <button onClick={transferFunds}>Transfer</button>
    </div>
  );
};

const App = () => (
  <div>
    <h1>Payment System</h1>
    <CreateCustomer />
    <CreateConnectedAccount />
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
    <TransferFunds />
  </div>
);

export default App;
