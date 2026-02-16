'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, Home, NotebookText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
  { href: '/profile', label: 'Profile', icon: User },
];

function UserNav() {
    const { profile, logout } = useAuth();

    if (!profile) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                         <AvatarFallback>{profile.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/leaderboard">Leaderboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const authRoutes = ['/', '/onboarding', '/revision'];
  if (!user || authRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-40 hidden w-full border-b bg-card/80 backdrop-blur-lg md:flex">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 font-bold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg hidden sm:inline-block">Valedict AI</span>
        </Link>

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
        
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
        </div>
      </div>
    </header>
  );
}
