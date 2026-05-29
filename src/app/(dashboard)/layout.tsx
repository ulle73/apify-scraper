import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { creditBalances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { 
  Layers, 
  LogOut, 
  PlusCircle,
  User
} from 'lucide-react';
import SidebarNav from '@/components/dashboard/sidebar-nav';

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
    <div className="flex h-screen bg-[#F8F9FA] text-slate-800 overflow-hidden font-sans">
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E2E8F0] bg-white shrink-0">
        {/* Brand/Logo - Leadify style */}
        <div className="p-6 border-b border-[#F1F5F9]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Leadify
            </span>
          </Link>
        </div>

        {/* Navigation - SidebarNav Client Component */}
        <SidebarNav credits={credits} />

        {/* Footer / User Details - matching mockup */}
        <div className="p-4 border-t border-[#F1F5F9] bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-[#E2E8F0] flex items-center justify-center text-slate-700 font-bold text-sm shrink-0 border border-white shadow-sm overflow-hidden">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{session.user.name || 'John Doe'}</div>
              <div className="text-[10px] text-slate-400 truncate">{session.user.email}</div>
            </div>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-white shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold text-slate-900">Leadify</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
              {credits} cr
            </div>
            <Link href="/dashboard/create" className="p-1.5 rounded-lg bg-blue-600 text-white">
              <PlusCircle className="h-4.5 w-4.5" />
            </Link>
          </div>
        </header>

        {/* 2. MAIN PANELS */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-[1700px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
