import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, creditBalances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(6, 'Lösenordet måste vara minst 6 tecken'),
  fullName: z.string().optional(),
  companyName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e: { message: string }) => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { email, password, fullName, companyName } = parsed.data;
    const lowerEmail = email.toLowerCase();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, lowerEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'En användare med denna e-postadress finns redan.' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user and initialize credit balance in a transaction or sequential operations
    const newUserList = await db
      .insert(users)
      .values({
        email: lowerEmail,
        password_hash: passwordHash,
        full_name: fullName || null,
        company_name: companyName || null,
      })
      .returning();

    const newUser = newUserList[0];

    // Create initial credit balance of 0
    await db.insert(creditBalances).values({
      user_id: newUser.id,
      credits: 0,
    });

    return NextResponse.json(
      {
        message: 'Registreringen lyckades!',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Något gick fel vid registreringen.' },
      { status: 500 }
    );
  }
}
