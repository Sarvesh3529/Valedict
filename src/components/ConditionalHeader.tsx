'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import { useAuth } from '@/context/AuthContext';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const authRoutes = ['/'];
  const hideOnRoutes = ['/onboarding', '/revision'];

  if (loading) {
    return null; // Don't show header while checking auth state
  }

  if (authRoutes.includes(pathname) || hideOnRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  // Only show header if user is logged in
  if (user) {
    return <Header />;
  }

  return null;
}
