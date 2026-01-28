'use client';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/onboarding') || pathname === '/') {
    return null;
  }
  return <BottomNav />;
}
