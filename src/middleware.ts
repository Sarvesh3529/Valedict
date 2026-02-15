import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from './lib/firebase-admin';

async function verifyToken(token: string) {
    try {
        await adminAuth.verifyIdToken(token);
        return true;
    } catch (error) {
        return false;
    }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/home', '/profile', '/quiz', '/leaderboard', '/doubt-solver', '/onboarding', '/revision'];
  const authRoutes = ['/'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!token && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access a login/signup page, redirect to home
  if (token && authRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
