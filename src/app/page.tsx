'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrainCircuit, Loader2, Eye, EyeOff } from 'lucide-react';
import { signupWithUsername, loginWithUsername } from './auth/actions';
import { useActionState } from 'react';
import { useEffect } from 'react';

function SubmitButton({ isSignup, isPending }: { isSignup: boolean, isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
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
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const action = isSignup ? signupWithUsername : loginWithUsername;

    const result = await action({ message: null, success: false }, formData);
    
    setIsPending(false);

    if (result.success && result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    } else {
      setMessage(result.message);
    }
  };

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
          <form onSubmit={handleSubmit} key={isSignup ? 'signup' : 'login'}>
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="e.g., studious_student" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                
                {message && (
                  <Alert variant="destructive">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <SubmitButton isSignup={isSignup} isPending={isPending}/>
            </div>
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
