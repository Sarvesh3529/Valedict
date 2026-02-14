'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginWithUsername, signupWithUsername } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { checkUsernameAvailability } from '@/lib/username';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


function SubmitButton({ isSignup }: { isSignup: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : isSignup ? 'Create Account' : 'Sign In'}
    </Button>
  );
}

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  
  const [loginState, loginAction] = useActionState(loginWithUsername, { message: '', success: false });
  const [signupState, signupAction] = useActionState(signupWithUsername, { message: '', success: false });

  const [username, setUsername] = useState('');
  const [debouncedUsername] = useDebounce(username, 500);
  const [availability, setAvailability] = useState<{ available: boolean; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  
  // This effect handles redirecting if the user is already logged in when they visit the page
  useEffect(() => {
    if (user && !loading) {
      router.replace('/home');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (isSignup && debouncedUsername) {
      setIsChecking(true);
      checkUsernameAvailability(debouncedUsername).then(result => {
        setAvailability(result);
        setIsChecking(false);
      });
    } else {
      setAvailability(null);
    }
  }, [debouncedUsername, isSignup]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const state = isSignup ? signupState : loginState;
  const action = isSignup ? signupAction : loginAction;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <BrainCircuit className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">{isSignup ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>{isSignup ? 'Choose a unique username to get started.' : 'Sign in to continue your learning journey.'}</CardDescription>
        </CardHeader>
        <CardContent>
            <form key={isSignup ? 'signup' : 'login'} action={action} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    name="username" 
                    placeholder="e.g., student_one" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                  {isSignup && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        {!isChecking && availability?.available && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {!isChecking && availability && !availability.available && <XCircle className="h-4 w-4 text-destructive" />}
                    </div>
                  )}
                </div>
                 <AnimatePresence>
                  {isSignup && availability && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-sm ${availability.available ? 'text-green-500' : 'text-destructive'}`}
                    >
                      {availability.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    minLength={6}
                    className="pr-10"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                  <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" 
                      onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
                 {isSignup && <p className="text-xs text-muted-foreground">Password must be at least 6 characters long.</p>}
              </div>
              <SubmitButton isSignup={isSignup} />
              {state?.message && (
                <Alert variant="destructive">
                  <AlertTitle>{isSignup ? 'Signup Failed' : 'Login Failed'}</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
            </form>
          <div className="mt-4 text-center text-sm">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Button variant="link" className="p-0 h-auto" onClick={() => {
                setIsSignup(!isSignup);
                setAvailability(null);
                setUsername('');
            }}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
