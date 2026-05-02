import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Using redirect: "if_required" handles the success internally if no extra auth is needed
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (setupIntent && setupIntent.status === 'succeeded') {
      setErrorMessage(null);
      if (onSuccess) onSuccess(setupIntent);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="text-destructive text-sm text-center">
          {errorMessage}
        </div>
      )}
      
      <button
        disabled={!stripe || isProcessing}
        type="submit"
        className="w-full btn-primary"
      >
        {isProcessing ? "Processing..." : "Save Card"}
      </button>
    </form>
  );
};

export default PaymentForm;
