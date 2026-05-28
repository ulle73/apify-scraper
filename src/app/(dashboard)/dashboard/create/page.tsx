import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { creditBalances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import CreateClient from './create-client';

export default async function CreateJobPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch user credit balance on the server side
  const balances = await db
    .select({ credits: creditBalances.credits })
    .from(creditBalances)
    .where(eq(creditBalances.user_id, userId as string))
    .limit(1);

  const credits = balances[0]?.credits ?? 0;

  return (
    <CreateClient initialBalance={credits} />
  );
}

export const dynamic = 'force-dynamic';
