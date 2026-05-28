import type { ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  FileText,
  Globe2,
  Instagram,
  MapPin,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';

type ScraperCard = {
  name: string;
  description: string;
  credits: string;
  icon: ReactNode;
  accent: string;
};

const scrapers: ScraperCard[] = [
  {
    name: 'Google Maps Leads',
    description: 'Extract businesses from Google Maps with contact details.',
    credits: 'From 10 credits',
    icon: <MapPin className="h-8 w-8 text-[#2f80ed]" />,
    accent: 'from-emerald-50 to-blue-50',
  },
  {
    name: 'Website Contact Finder',
    description: 'Find emails, phones and contact information from