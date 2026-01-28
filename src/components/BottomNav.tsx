'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BrainCircuit, NotebookText, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: BookOpen },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-lg">
      <div className="container grid h-16 grid-cols-4 items-center justify-items-center">
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
      </div>
    </nav>
  );
}
