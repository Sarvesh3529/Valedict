'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, Home, NotebookText, User, Menu, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './notifications/NotificationBell';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAuthRoute = pathname === '/' || pathname.startsWith('/onboarding') || pathname.startsWith('/revision');
  
  if (!user || isAuthRoute) {
    return null;
  }
  
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg h-16">
      <div className="container flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon"><Menu className="h-5 w-5"/></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                    <Link href="/home" className="flex items-center gap-2 font-bold mb-8">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        <span className="font-headline text-lg">Valedict AI</span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                           <SheetClose asChild key={link.href}>
                             <Link
                                href={link.href}
                                className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                pathname === link.href && 'bg-primary/10 text-primary'
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                             </Link>
                           </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Desktop Logo */}
            <Link href="/home" className="hidden items-center gap-2 font-bold md:flex">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="font-headline text-lg">Valedict AI</span>
            </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
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
        
        <div className="flex items-center gap-1 sm:gap-2">
            <NotificationBell />
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
