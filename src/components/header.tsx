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
import { useMemo } from 'react';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

function UserNav() {
    const { user, profile, logout } = useAuth();

    if (!user || !profile) return null;

    // Stable color generation based on UID
    const generateHslColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = hash % 360;
        return `hsl(${h}, 35%, 55%)`;
    };
    
    const avatarColor = useMemo(() => generateHslColor(user.uid), [user.uid]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                         <AvatarFallback 
                            style={{ backgroundColor: avatarColor }}
                            className="text-white font-semibold"
                         >
                            {profile.username?.[0].toUpperCase()}
                         </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.username}</p>
                         {user.email && (
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/leaderboard">
                        <Trophy className="mr-2 h-4 w-4" />
                        <span>Leaderboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={(e) => { e.preventDefault(); logout(); }}>
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
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg h-16">
      <div className="container flex h-full items-center justify-between">
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
                        {[...navLinks, { href: '/profile', label: 'Profile', icon: User }].map((link) => (
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
        
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
        </div>
      </div>
    </header>
  );
}
