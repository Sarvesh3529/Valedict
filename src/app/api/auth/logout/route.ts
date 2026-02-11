import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().delete('firebase_token');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Session logout error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to log out.' }, { status: 500 });
  }
}
