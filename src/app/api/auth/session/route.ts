import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'ID token is required' }, { status: 400 });
    }

    // Verify the ID token to ensure it's valid.
    await adminAuth.verifyIdToken(idToken);

    // Set the session cookie.
    const response = NextResponse.json({ ok: true });
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    
    response.cookies.set('firebase_token', idToken, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return response;

  } catch (error) {
    console.error('Session Login Error:', error);
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  }
}
