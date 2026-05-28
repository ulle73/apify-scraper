import { auth } from '@/lib/auth';
import { PLANS } from '@/lib/pricing/plans';
import { createCheckoutSession } from '@/lib/stripe/checkout';
import { NextResponse } from 'next/server';

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id || !req.auth.user.email) {
    return NextResponse.json(
      { error: 'Du måste vara inloggad för att genomföra köp.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { planId } = body;

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Ogiltigt paket valt.' },
        { status: 400 }
      );
    }

    const userId = req.auth.user.id;
    const userEmail = req.auth.user.email;

    // Detect the current host/origin
    const origin = req.headers.get('origin') || (() => {
      const proto = req.headers.get('x-forwarded-proto') || 'http';
      const host = req.headers.get('host') || 'localhost:3000';
      return `${proto}://${host}`;
    })();

    const successUrl = `${origin}/dashboard/billing?status=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/dashboard/billing?status=cancelled`;

    const url = await createCheckoutSession(
      userEmail,
      userId,
      plan,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Kunde inte initiera betalning med Stripe.' },
      { status: 500 }
    );
  }
});
