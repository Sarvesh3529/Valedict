'use client';

import { useActionState, Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setupNewUser } from '@/lib/user';
import { useAuth } from '@/context/AuthContext';

function EmailSignInButton() {
  // This hook is new in React 19 and replaces useFormStatus
  const { pending } = useActionState(async () => {}, null);

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
        ) : 'Sign in'}
    </Button>
  )
}


function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [state, formAction] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [oneTapError, setOneTapError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  const handleOneTapCallback = async (response: any) => {
    setOneTapError(null);
    try {
        const credential = GoogleAuthProvider.credential(response.credential);
        const result = await signInWithCredential(auth, credential);
        await setupNewUser(result.user);
        // The onAuthStateChanged listener will handle the redirect via the other useEffect
    } catch (error: any) {
        console.error("Google One Tap Sign-In Error:", error.code, error.message);
        let friendlyMessage = "Could not sign in with Google. Please try again.";
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
            return; // Silently ignore.
        } else if (error.code === 'auth/unauthorized-domain') {
            friendlyMessage = "This domain is not authorized for Google Sign-In. Please add it in your Firebase project settings.";
        } else if (error.code === 'auth/api-key-not-valid') {
            friendlyMessage = "Invalid API Key for Google Sign-In. Please check your .env file.";
        }
        setOneTapError(friendlyMessage);
    }
  };

  useEffect(() => {
    if (loading || user) {
      return; // Don't show One Tap if logged in or loading
    }
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error("Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file.");
      setOneTapError("Google Sign-In is not configured correctly.");
      return;
    }

    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleOneTapCallback,
        auto_select: true, // Auto-select returning users
        cancel_on_tap_outside: false,
      });

      // @ts-ignore
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("One Tap prompt was not displayed or was skipped.");
        }
      });
    } else {
        console.log("Google GSI script not loaded yet.");
    }
  }, [loading, user]);


  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <BrainCircuit className="mx-auto h-10 w-10 text-primary mb-2"/>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in with email or use the automatic Google Sign-In.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             {oneTapError && (
                  <Alert variant="destructive">
                      <AlertTitle>Google Sign-In Failed</AlertTitle>
                      <AlertDescription>{oneTapError}</AlertDescription>
                  </Alert>
              )}
            <form action={formAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <EmailSignInButton />
              {state?.message && (
                  <Alert variant="destructive">
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
              )}
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
