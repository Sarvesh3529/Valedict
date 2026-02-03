'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { checkUsernameAvailability, setUsername } from '@/lib/username';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SetUsernamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [debouncedUsername] = useDebounce(username, 500);
  
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; message: string } | null>(null);
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
        return;
    }
    if (!user) {
        router.replace('/');
        return;
    }

    if (debouncedUsername.length >= 3) {
      setIsChecking(true);
      checkUsernameAvailability(debouncedUsername).then(result => {
        setAvailability(result);
        setIsChecking(false);
      });
    } else {
      setAvailability(null);
    }
  }, [debouncedUsername, user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!availability?.available || !user) {
        setError(availability?.message || 'Username is not available.');
        return;
    }

    setIsPending(true);
    const result = await setUsername(user.uid, username);
    if (result.success) {
      await updateProfile(user, { displayName: username });
      router.push('/onboarding/start');
    } else {
      setError(result.message);
      setIsPending(false);
    }
  };

  if (loading || !user) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Choose your Username</CardTitle>
          <CardDescription>This will be your public name on the leaderboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {!isChecking && availability?.available && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {!isChecking && availability && !availability.available && <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
              {availability && (
                <p className={`text-sm ${availability.available ? 'text-green-500' : 'text-destructive'}`}>
                  {availability.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPending || !availability?.available} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save and Continue'}
            </Button>
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
