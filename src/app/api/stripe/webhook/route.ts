import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creditBalances, creditTransactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: '2024-12-22.accredited' as any,
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return new NextResponse('Stripe är inte konfigurerat på servern.', { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Stripe webhook signaturverifiering misslyckades: ${err.message}`);
    return new NextResponse(`Stripe Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id;
      const credits = parseInt(session.metadata?.credits || '0', 10);
      const planId = session.metadata?.planId || 'unknown';

      if (!userId) {
        console.error('Stripe webhook error: client_reference_id (userId) saknas i session.');
        return new NextResponse('userId saknas.', { status: 400 });
      }

      if (credits <= 0) {
        console.warn('Stripe webhook warning: Credits i session är <= 0.');
        return NextResponse.json({ received: true, warning: 'Inga credits krediterade' });
      }

      await db.transaction(async (tx) => {
        // Fetch current user credit balance
        const balances = await tx
          .select()
          .from(creditBalances)
          .where(eq(creditBalances.user_id, userId))
          .limit(1);

        if (balances.length === 0) {
          // If balance does not exist for some reason, create it
          await tx.insert(creditBalances).values({
            user_id: userId,
            credits: credits,
            created_at: new Date(),
            updated_at: new Date(),
          });
        } else {
          // Increment existing credits
          const currentCredits = balances[0].credits;
          await tx
            .update(creditBalances)
            .set({
              credits: currentCredits + credits,
              updated_at: new Date(),
            })
            .where(eq(creditBalances.user_id, userId));
        }

        // Add to transactions log
        await tx.insert(creditTransactions).values({
          user_id: userId,
          amount: credits,
          type: 'purchase',
          reference_id: session.id,
          metadata: {
            planId,
            stripe_session_id: session.id,
          },
          created_at: new Date(),
        });
      });

      console.log(`Krediterade ${credits} credits till användare: ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    return new NextResponse('Stripe Webhook Processing Error', { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
