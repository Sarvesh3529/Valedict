'use client';

import { useActionState, Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  );
}

function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [state, formAction] = useActionState(login, undefined);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async (response: any) => {
    setGoogleError(null);
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithCredential(auth, credential);
      await setupNewUser(result.user);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.code, error.message);
      let friendlyMessage = "Could not sign in with Google. Please try again.";
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return; 
      } else if (error.code === 'auth/unauthorized-domain') {
        friendlyMessage = "This domain is not authorized. Please add it to the authorized domains in your Firebase project's Authentication settings.";
      } else if (error.code === 'auth/api-key-not-valid') {
        friendlyMessage = "Invalid API Key for Google Sign-In. Please check your .env file.";
      }
      setGoogleError(friendlyMessage);
    }
  };

  useEffect(() => {
    if (loading || user || !window.google?.accounts?.id) {
      return; 
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setGoogleError("Google Sign-In is not configured correctly. Missing Client ID.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      use_fedcm_for_prompt: true,
      auto_select: true,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton")!,
      { theme: "outline", size: "large", type: "standard", text: "signin_with", width: "300" }
    );
    
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log("One Tap prompt was not displayed or was skipped.");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <BrainCircuit className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your learning journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {googleError && (
              <Alert variant="destructive">
                <AlertTitle>Google Sign-In Failed</AlertTitle>
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}
            <div id="googleSignInButton" className="flex justify-center"></div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <form action={formAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
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
  );
}
