'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, Trophy, BrainCircuit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/leaderboard', label: 'Rank', icon: Trophy },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const hideOnRoutes = ['/', '/onboarding', '/revision'];
  if (!isMobile || hideOnRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-4 items-center justify-items-center border-t bg-card/80 backdrop-blur-lg">
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
