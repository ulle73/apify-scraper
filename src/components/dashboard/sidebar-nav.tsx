'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  CreditCard 
} from 'lucide-react';

interface SidebarNavProps {
  credits: number;
}

export default function SidebarNav({ credits }: SidebarNavProps) {
  const pathname = usePathname();

  const links = [
    {
      name: 'Scrapers',
      href: '/dashboard',
      icon: LayoutDashboard,
      // Active if exactly /dashboard
      isActive: pathname === '/dashboard',
    },
    {
      name: 'Skapa sökning',
      href: '/dashboard/create',
      icon: PlusCircle,
      // Active if starts with /dashboard/create
      isActive: pathname.startsWith('/dashboard/create'),
    },
    {
      name: 'My jobs',
      href: '/dashboard/jobs',
      icon: History,
      // Active if starts with /dashboard/jobs
      isActive: pathname.startsWith('/dashboard/jobs'),
    },
    {
      name: `Credits (${credits})`,
      href: '/dashboard/billing',
      icon: CreditCard,
      // Active if starts with /dashboard/billing
      isActive: pathname.startsWith('/dashboard/billing'),
    },
  ];

  return (
    <nav className="flex-grow px-4 py-6 space-y-1.5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              link.isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${link.isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
