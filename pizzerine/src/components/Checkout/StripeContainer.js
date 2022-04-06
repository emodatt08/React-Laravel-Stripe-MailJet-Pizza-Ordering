import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import settings from '../../Helpers/Url'
import Checkout from './Checkout';


export default function StripeContainer() {
    const PUBLIC_KEY = settings.stripePublicKey;
    const stripeTestPromise = loadStripe(PUBLIC_KEY);

  return (
    <Elements stripe={stripeTestPromise}>
        <Checkout />
    </Elements>
  )
}
