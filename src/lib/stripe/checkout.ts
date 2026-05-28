import Stripe from 'stripe';
import { PricingPlan } from '../pricing/plans';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripeMode = process.env.STRIPE_MODE || 'test';

// Validate that keys match the configured mode
if (stripeKey) {
  const isTestKey = stripeKey.startsWith('sk_test_');
  const isLiveKey = stripeKey.startsWith('sk_live_');

  if (stripeMode === 'test' && isLiveKey) {
    throw new Error(
      '⚠️  STRIPE KONFIGURATIONSFEL: STRIPE_MODE=test men STRIPE_SECRET_KEY är en sk_live_-nyckel!\n' +
      'Använd en sk_test_-nyckel från Stripe Dashboard (Test-läge) för att testa säkert.'
    );
  }
  if (stripeMode === 'live' && isTestKey) {
    throw new Error(
      '⚠️  STRIPE KONFIGURATIONSFEL: STRIPE_MODE=live men STRIPE_SECRET_KEY är en sk_test_-nyckel!\n' +
      'Byt till din sk_live_-nyckel för produktionstrafik.'
    );
  }

  const modeLabel = isTestKey ? '🧪 SANDBOX/TEST' : '🔴 LIVE/PRODUKTION';
  console.log(`[Stripe] Initierad i ${modeLabel}-läge`);
}

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: '2024-12-22.accredited' as any,
    })
  : null;

export async function createCheckoutSession(
  userEmail: string,
  userId: string,
  plan: PricingPlan,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe är inte konfigurerat. Kontrollera STRIPE_SECRET_KEY i din .env-fil.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId: userId,
      planId: plan.id,
      credits: plan.credits.toString(),
    },
    line_items: [
      {
        price_data: {
          currency: 'sek',
          product_data: {
            name: `${plan.name} - ${plan.credits} credits (SuperScraper)`,
            description: `Köp av ${plan.credits} credits för att skapa B2B-leadlistor på SuperScraper.`,
          },
          unit_amount: plan.priceSEK * 100, // Stripe uses cents/öre
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!session.url) {
    throw new Error('Kunde inte generera en checkout-session-url.');
  }

  return session.url;
}
