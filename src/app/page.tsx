'use client';

import { useActionState, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

function GoogleSignInButton({ onClick, isPending }: { onClick: () => void, isPending: boolean }) {
  return (
    <Button variant="outline" className="w-full" type="button" disabled={isPending} onClick={onClick}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : 'Sign in with Google'}
    </Button>
  )
}

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
  const [state, formAction] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGooglePending(true);
    setGoogleError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      // If user does not exist in Firestore, create a new document
      if (!docSnap.exists()) {
        const displayName = user.displayName || user.email?.split('@')[0];
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            photoURL: user.photoURL,
            currentStreak: 0,
            highestStreak: 0,
            lastActivityDate: null,
        });
      }
      
      router.push('/home');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      // Map common Firebase errors to user-friendly messages
      if (error.code === 'auth/popup-closed-by-user') {
         setGoogleError("The sign-in window was closed. Please try again.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Do nothing, as another popup was likely opened.
      }
      else {
         setGoogleError("Could not sign in with Google. Please try again.");
      }
    } finally {
      setIsGooglePending(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <BrainCircuit className="mx-auto h-10 w-10 text-primary mb-2"/>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
             <GoogleSignInButton onClick={handleGoogleSignIn} isPending={isGooglePending} />
              {(error || googleError) && (
                  <Alert variant="destructive">
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>{googleError || 'Could not sign in with Google. Please try again.'}</AlertDescription>
                  </Alert>
              )}
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
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
