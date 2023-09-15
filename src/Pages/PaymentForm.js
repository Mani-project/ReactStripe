import React from "react";
import Stripe from "./Stripe.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const config = require('../config.js');
const stripePromise = loadStripe(config.STRIPE_PUBLISHKEY);
console.log(config.STRIPE_PUBLISHKEY)
const PaymentForm = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <Stripe />
      </Elements>
    </div>
  );
};

export default PaymentForm;
