'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { signupWithUsername, loginWithUsername } from './auth/actions';

function SubmitButton({ isSignup }: { isSignup: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : isSignup ? (
        'Create Account'
      ) : (
        'Sign In'
      )}
    </Button>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  
  const [signupState, signupAction] = useActionState(signupWithUsername, { message: null, success: false });
  const [loginState, loginAction] = useActionState(loginWithUsername, { message: null, success: false });

  const state = isSignup ? signupState : loginState;

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{isSignup ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>{isSignup ? 'Enter your details to get started.' : 'Sign in to continue your learning.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={isSignup ? signupAction : loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="e.g., studious_student" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            {state?.message && (
              <Alert variant={state.success ? 'default' : 'destructive'}>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <SubmitButton isSignup={isSignup} />
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <Button variant="link" onClick={() => setIsSignup(!isSignup)} className="px-1">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
