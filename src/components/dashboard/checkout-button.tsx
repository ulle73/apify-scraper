'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  planId: string;
  price: number;
  label: string;
  className?: string;
}

export default function CheckoutButton({ planId, price, label, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte skapa betalningssession.');
      }

      if (data.url) {
        // Redirect user to Stripe Checkout panel
        window.location.href = data.url;
      } else {
        throw new Error('Url saknas i svaret.');
      }
    } catch (err: any) {
      console.error('Checkout button error:', err);
      setError(err.message || 'Ett fel uppstod.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {error && (
        <p className="text-[10px] text-rose-400 font-bold text-center">{error}</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Öppnar Stripe...
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
