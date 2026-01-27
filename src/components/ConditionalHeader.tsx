'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname.startsWith('/onboarding')) {
    return null;
  }
  return <Header />;
}
