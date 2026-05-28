import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-500 py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="text-violet-600">
                <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(99, 102, 241, 0.15)" />
                  <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Leadify
              </span>
            </Link>
            <p className="text-sm max-w-sm text-slate-500 leading-relaxed">
              Leadify är den ledande B2B-plattformen för automatiserad leadsgenerering och datainsamling från öppna källor på nätet.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">
              Plattform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Så fungerar det
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Prissättning
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-slate-500 hover:text-slate-900 transition-colors">
                  GDPR & Riktlinjer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-4">
              Juridiskt
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Användarvillkor
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Acceptabel Användning
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            &copy; {currentYear} Leadify. Alla rättigheter förbehållna. Byggd för nordiska B2B-företag.
          </p>
          <p className="text-slate-400 text-center sm:text-right">
            Datan samlas in från publika källor. Kunden ansvarar själv för användning enligt marknadsföringslagen.
          </p>
        </div>
      </div>
    </footer>
  );
}
