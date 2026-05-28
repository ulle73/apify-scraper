'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Zap, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

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
          ? 'bg-navy-950/80 backdrop-blur-md border-b border-navy-800 py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg text-navy-950 shadow-md group-hover:scale-105 transition-transform duration-200">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Super<span className="text-brand-400">Scraper</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#how-it-works"
              className="text-navy-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Så fungerar det
            </Link>
            <Link
              href="/pricing"
              className="text-navy-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Priser
            </Link>
            <Link
              href="/compliance"
              className="text-navy-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              GDPR & Användning
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-200 hover:text-white transition-colors duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-navy-800 text-navy-200 hover:bg-navy-700 hover:text-white transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-navy-300 hover:text-white transition-colors duration-200"
                >
                  Logga in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] transition-all duration-200"
                >
                  Kom igång gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-navy-900 border-b border-navy-800 py-6 px-4 shadow-xl">
          <nav className="flex flex-col gap-4 mb-6">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-navy-300 hover:text-white py-2 text-base font-medium"
            >
              Så fungerar det
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-navy-300 hover:text-white py-2 text-base font-medium"
            >
              Priser
            </Link>
            <Link
              href="/compliance"
              onClick={() => setMobileMenuOpen(false)}
              className="text-navy-300 hover:text-white py-2 text-base font-medium"
            >
              GDPR & Användning
            </Link>
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-navy-800">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-brand-500 to-brand-700 text-white"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Gå till Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-base font-medium bg-navy-800 text-navy-200"
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
                  className="flex items-center justify-center w-full py-2.5 rounded-lg text-base font-medium bg-navy-800 text-navy-200"
                >
                  Logga in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-lg text-base font-medium bg-gradient-to-r from-brand-500 to-brand-700 text-white"
                >
                  Skapa konto gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
