import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (userList.length === 0) {
          return null;
        }

        const user = userList[0];
        const passwordsMatch = await bcrypt.compare(
          String(credentials.password),
          user.password_hash
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
};
