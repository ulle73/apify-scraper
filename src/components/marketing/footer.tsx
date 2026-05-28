import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-navy-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-brand-500 to-brand-700 rounded text-white">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Super<span className="text-brand-400">Scraper</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4 text-navy-400 leading-relaxed">
              SuperScraper är den nordiska B2B-plattformen för automatiserad leadsgenerering och datainsamling från öppna källor på nätet.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Plattform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Så fungerar det
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Prissättning
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-white transition-colors">
                  GDPR & Riktlinjer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Juridiskt
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Användarvillkor
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="hover:text-white transition-colors">
                  Acceptabel Användning
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-navy-500">
            &copy; {currentYear} SuperScraper. Alla rättigheter förbehållna. Byggd för nordiska B2B-företag.
          </p>
          <p className="text-navy-600">
            Datan samlas in från publika källor. Kunden ansvarar själv för användning enligt marknadsföringslagen.
          </p>
        </div>
      </div>
    </footer>
  );
}
