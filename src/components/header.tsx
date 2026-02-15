'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, Home, NotebookText, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
];

export default function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg hidden sm:inline-block">Valedict AI</span>
        </Link>

        {!isMobile && (
           <nav className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  'justify-start',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-primary'
                )}
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}
        
        <div className="flex items-center gap-2">
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
