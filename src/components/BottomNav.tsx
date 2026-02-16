'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, BrainCircuit, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const authRoutes = ['/', '/onboarding', '/revision'];
  if (!user || authRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-all hover:text-primary',
              pathname === link.href ? 'text-primary' : ''
            )}
          >
            <link.icon className="h-6 w-6" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
