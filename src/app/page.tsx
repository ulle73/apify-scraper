import type { ReactNode } from 'react';
import {
  ArrowRight,
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
};

const scrapers: ScraperCard[] = [
  {
    name: 'Google Maps Leads',
    description: 'Extract businesses from Google Maps with contact details.',
    credits: 'From 10 credits',
    icon: <MapPin className="h