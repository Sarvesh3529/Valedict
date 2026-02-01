'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import { useUser } from '@/firebase';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const authRoutes = ['/signup'];
  
  if (loading) {
    return null; // Don't show header while checking auth state
  }

  if (!user && !authRoutes.includes(pathname) && pathname !== '/') {
     // In case middleware fails or for client-side transitions
     // We might still want to show a header on public pages though.
     // For now, let's hide it if not logged in and not on an auth page.
     return null;
  }

  if (authRoutes.includes(pathname) || pathname === '/') {
    return null;
  }

  return <Header />;
}
