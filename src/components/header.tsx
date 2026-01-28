'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BrainCircuit, Menu, NotebookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
  { href: '/quiz', label: 'Quiz Mode', icon: NotebookText },
  { href: '/doubt-solver', label: 'Doubt Solver', icon: BrainCircuit },
];

export default function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <>
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
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <Link href={link.href}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">ExamPrep AI</span>
        </Link>

        {isMobile ? (
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-2 p-4">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center space-x-2">
            <NavContent />
          </nav>
        )}
      </div>
    </header>
  );
}
