import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'SuperScraper — Hämta färdiga B2B-leadlistor på minuter',
  description: 'Skapa färdiga B2B-leadlistor från öppna källor. Välj bransch och plats, så hämtar och deduplicerar vi din data automatiskt.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className="h-full scroll-smooth">
      <body className="min-h-full bg-navy-950 text-navy-100 flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
