import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import PaymentForm from '../../components/PaymentForm';

// Make sure to load Stripe outside of a component’s render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TSWruLh33I3O63vpXg234324f2f32f3f');

const Payments = () => {
  const { backendUrl, token, userData } = useAppContext();
  const [clientSecret, setClientSecret] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/payment/create-setup-intent`,
          { userId: userData?._id },
          { headers: { token } }
        );

        if (response.data.success) {
          setClientSecret(response.data.clientSecret);
        } else {
          setError(response.data.message || "Failed to initialize payment setup.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (token && userData) {
      fetchClientSecret();
    } else {
      setError("Please log in to save a payment method.");
    }
  }, [backendUrl, token, userData]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#0f172a',
      colorText: '#f8fafc',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-md mx-auto mt-12 glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-glow">Save Payment Method</h2>
        
        {error && (
          <div className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Card Saved Successfully!</h3>
            <p className="text-muted-foreground">Your payment method has been securely saved for future bookings.</p>
          </div>
        ) : (
          clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm onSuccess={() => setSuccess(true)} />
            </Elements>
          )
        )}
      </div>
    </div>
  );
};

export default Payments;
