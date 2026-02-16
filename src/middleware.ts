import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/home', '/profile', '/quiz', '/leaderboard', '/doubt-solver', '/onboarding', '/revision'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access a protected route, redirect to login page ('/').
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated and trying to access the login page, let the page load.
  // The client-side AuthProvider will handle redirecting them to '/home' if they are truly logged in.
  // This change prevents a redirect loop if the cookie token is stale or invalid.
  if (token && pathname === '/') {
     // Allow access to login page even with a token.
     // The home page itself has server-side logic to validate the token
     // and will redirect if it's invalid.
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
