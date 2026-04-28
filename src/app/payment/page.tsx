"use client";

import { stripePromise } from "@/stripe/page";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../_component/checkOutForm/page";



export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
       <CheckoutForm />
    </Elements>
  );
}