'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, User, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const authRoutes = ['/', '/onboarding', '/revision'];
  if (!user || authRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-4 items-center justify-items-center border-t bg-card/95 backdrop-blur-lg md:hidden">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
