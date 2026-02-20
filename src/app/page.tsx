'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrainCircuit, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { signupWithUsername, loginWithUsername } from './auth/actions';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useDebounce } from 'use-debounce';
import { checkUsernameAvailability } from '@/lib/username';

function SubmitButton({ isSignup, isPending, isUsernameAvailable }: { isSignup: boolean, isPending: boolean, isUsernameAvailable: boolean | null }) {
  const disabled = isPending || (isSignup && isUsernameAvailable === false);
  
  return (
    <Button type="submit" className="w-full" disabled={disabled}>
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

  // Username availability logic
  const [username, setUsername] = useState('');
  const [debouncedUsername] = useDebounce(username, 500);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean, message: string } | null>(null);

  useEffect(() => {
    if (isSignup && debouncedUsername.length >= 3) {
      setIsChecking(true);
      checkUsernameAvailability(debouncedUsername).then((res) => {
        setAvailability(res);
        setIsChecking(false);
      });
    } else {
      setAvailability(null);
    }
  }, [debouncedUsername, isSignup]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const action = isSignup ? signupWithUsername : loginWithUsername;

    const result = await action({ message: null, success: false }, formData);
    
    if (result.success && result.customToken && result.redirectTo) {
      try {
        const userCredential = await signInWithCustomToken(auth, result.customToken);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        router.push(result.redirectTo);
      } catch (error) {
        console.error("Client-side sign-in failed:", error);
        setMessage("Authentication failed. Please try again.");
        setIsPending(false);
      }
    } else {
      setMessage(result.message);
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tight">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="font-bold">
            {isSignup ? 'Start your journey to the top.' : 'Sign in to keep your streak alive.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} key={isSignup ? 'signup' : 'login'}>
            <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-black uppercase text-xs tracking-widest text-muted-foreground">Username</Label>
                  <div className="relative">
                    <Input 
                      id="username" 
                      name="username" 
                      placeholder="e.g., study_pro" 
                      required 
                      className="border-2 h-12 font-bold"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {isSignup && username.length >= 3 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isChecking ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : 
                         availability?.available ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                         <XCircle className="h-4 w-4 text-destructive" />}
                      </div>
                    )}
                  </div>
                  {isSignup && availability && (
                    <p className={`text-[10px] font-black uppercase tracking-wider ${availability.available ? 'text-green-500' : 'text-destructive'}`}>
                      {availability.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="font-black uppercase text-xs tracking-widest text-muted-foreground">Password</Label>
                    <div className="relative">
                        <Input 
                          id="password" 
                          name="password" 
                          type={showPassword ? 'text' : 'password'} 
                          required 
                          className="border-2 h-12 font-bold"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                
                {message && (
                  <Alert variant="destructive" className="border-2">
                    <AlertDescription className="font-bold">{message}</AlertDescription>
                  </Alert>
                )}

                <SubmitButton isSignup={isSignup} isPending={isPending} isUsernameAvailable={availability?.available ?? null}/>
            </div>
          </form>
          <div className="mt-6 text-center text-sm font-bold text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <Button variant="link" onClick={() => setIsSignup(!isSignup)} className="px-1 font-black text-primary hover:no-underline">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
