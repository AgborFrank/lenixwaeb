"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

interface StripeCardFormProps {
  amountUsd: number;
  walletAddress: string;
  onSuccess?: () => void;
}

function CardFormInner({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!stripe || !elements) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card },
        });
      if (confirmError) {
        setError(confirmError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError("Payment not completed");
      }
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-green-400 text-sm">
        Payment successful. Tokens will be delivered shortly.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-gray-700 rounded-lg p-3">
        <CardElement
          options={{ style: { base: { color: "#fff", fontSize: "16px" } } }}
        />
      </div>
      {error && <div className="text-red-400 text-xs">{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !stripe}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? "Processing..." : "Confirm Card Payment"}
      </button>
    </div>
  );
}

export default function StripeCardForm({
  amountUsd,
  walletAddress,
  onSuccess,
}: StripeCardFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stripePromise = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) return null;
    return loadStripe(key);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function createIntent() {
      setError(null);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress, usdAmount: amountUsd }),
        });
        if (!res.ok)
          throw new Error(`Failed to create payment intent (${res.status})`);
        const data = await res.json();
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unable to start payment");
      }
    }
    if (amountUsd > 0 && walletAddress) {
      createIntent();
    }
    return () => {
      cancelled = true;
    };
  }, [amountUsd, walletAddress]);

  if (!stripePromise) {
    return (
      <div className="text-red-400 text-xs">
        Stripe publishable key not configured.
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-xs">{error}</div>;
  }

  if (!clientSecret) {
    return (
      <div className="text-gray-400 text-xs">Preparing secure card form...</div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CardFormInner clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}
