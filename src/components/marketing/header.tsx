'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <svg className="h-6.5 w-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(91, 139, 245, 0.15)" />
                <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Leadify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#popular-scrapers"
              className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-semibold"
            >
              Scrapers
            </Link>
            <Link
              href="/pricing"
              className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-semibold"
            >
              Pricing
            </Link>
            <Link
              href="/#how-it-works"
              className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-semibold"
            >
              How it works
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-5">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
                >
                  <LayoutDashboard className="h-4 w-4 text-blue-500" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.01] transition-all duration-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 py-5 px-6 shadow-lg animate-float-3">
          <nav className="flex flex-col gap-3 mb-5">
            <Link
              href="/#popular-scrapers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-slate-900 py-1.5 text-base font-semibold"
            >
              Scrapers
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-slate-900 py-1.5 text-base font-semibold"
            >
              Pricing
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-slate-900 py-1.5 text-base font-semibold"
            >
              How it works
            </Link>
          </nav>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-base font-semibold bg-blue-50 text-blue-600"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Gå till Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-base font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-base font-semibold bg-slate-50 text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-base font-bold bg-blue-600 text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
