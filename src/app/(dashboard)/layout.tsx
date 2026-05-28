import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { creditBalances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { 
  Zap, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  CreditCard, 
  LogOut, 
  Coins 
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id;
  
  // Fetch the user's credits balance for displaying in the sidebar
  const balances = await db
    .select({ credits: creditBalances.credits })
    .from(creditBalances)
    .where(eq(creditBalances.user_id, userId as string))
    .limit(1);

  const credits = balances[0]?.credits ?? 0;

  // Sign out server action
  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <div className="flex h-screen bg-navy-950 text-slate-100 overflow-hidden">
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-navy-850 bg-navy-900/60 backdrop-blur-sm shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-navy-850">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded text-navy-950 shadow-md">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Super<span className="text-brand-400">Scraper</span>
            </span>
          </Link>
        </div>

        {/* Credit Display Card */}
        <div className="p-4 mx-4 my-4 rounded-xl border border-navy-800 bg-navy-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-navy-400 font-medium">Ditt saldo</div>
              <div className="text-sm font-black text-white">{credits} credits</div>
            </div>
          </div>
          <Link 
            href="/dashboard/billing" 
            className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-navy-950 text-xs font-bold uppercase transition"
          >
            Köp
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-navy-200 hover:text-white hover:bg-navy-850/50 transition-colors"
          >
            <LayoutDashboard className="h-4.5 w-4.5 text-navy-400" />
            Översikt
          </Link>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-navy-200 hover:text-white hover:bg-navy-850/50 transition-colors"
          >
            <PlusCircle className="h-4.5 w-4.5 text-navy-400" />
            Skapa leadlista
          </Link>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-navy-200 hover:text-white hover:bg-navy-850/50 transition-colors"
          >
            <History className="h-4.5 w-4.5 text-navy-400" />
            Mina sökjobb
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-navy-200 hover:text-white hover:bg-navy-850/50 transition-colors"
          >
            <CreditCard className="h-4.5 w-4.5 text-navy-400" />
            Fakturering & Credits
          </Link>
        </nav>

        {/* Footer / User Details */}
        <div className="p-4 border-t border-navy-850 bg-navy-950/20">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{session.user.name || 'Användare'}</div>
              <div className="text-[10px] text-navy-400 truncate">{session.user.email}</div>
            </div>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-navy-300 hover:text-white border border-navy-800 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-navy-850 bg-navy-900">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-brand-400 to-brand-600 rounded text-navy-950">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <span className="text-base font-bold text-white">SuperScraper</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded bg-navy-800 text-xs font-semibold text-brand-400">
              {credits} cr
            </div>
            <Link href="/dashboard/create" className="p-1 rounded bg-brand-500 text-navy-950">
              <PlusCircle className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* 2. MAIN PANELS */}
        <main className="flex-grow overflow-y-auto bg-navy-950 p-6 md:p-10 relative">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
