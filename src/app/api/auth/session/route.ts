import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken as string;

    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'ID token is required.' }, { status: 400 });
    }

    // Verify the ID token and decode it.
    await adminAuth.verifyIdToken(idToken);
    
    // Set session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
    cookies().set('firebase_token', idToken, {
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to verify token.' }, { status: 401 });
  }
}
