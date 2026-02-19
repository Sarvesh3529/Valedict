'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookText, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/quiz', label: 'Practice', icon: NotebookText },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Do not show on auth or onboarding screens
  const authRoutes = ['/', '/onboarding', '/revision'];
  if (!user || authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg p-2 transition-all',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <link.icon className={cn("h-6 w-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
