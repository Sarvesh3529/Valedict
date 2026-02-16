'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';

export default function ConditionalHeader() {
  const pathname = usePathname();

  const authRoutes = ['/'];
  const hideOnRoutes = ['/onboarding', '/revision'];

  if (authRoutes.includes(pathname) || hideOnRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  return <Header />;
}
