import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/home', '/profile', '/quiz', '/leaderboard', '/doubt-solver', '/onboarding', '/revision'];
  const authRoute = '/';

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access a protected route, redirect to login page ('/').
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated and trying to access the login page, redirect to home.
  if (token && pathname === authRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to the routes that need protection or redirection.
export const config = {
  matcher: [
    '/',
    '/home/:path*',
    '/profile/:path*',
    '/quiz/:path*',
    '/leaderboard/:path*',
    '/doubt-solver/:path*',
    '/onboarding/:path*',
    '/revision/:path*',
  ],
};
