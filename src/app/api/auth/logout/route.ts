import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true });
    
    // Clear the session cookie.
    response.cookies.set('firebase_token', '', {
        maxAge: -1, // Expire immediately
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return response;

  } catch (error) {
    console.error('Session Logout Error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to log out' }, { status: 500 });
  }
}
