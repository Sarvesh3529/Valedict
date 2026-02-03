'use client';

import { useState, useTransition, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { checkUsernameAvailability, updateUserDisplayName } from '@/lib/username';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EditUsernameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditUsernameDialog({ isOpen, setIsOpen }: EditUsernameDialogProps) {
  const { user, profile } = useAuth();
  const [username, setUsername] = useState(profile?.displayName || '');
  const [debouncedUsername] = useDebounce(username, 500);
  
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; message: string } | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.toLowerCase() !== profile?.displayName?.toLowerCase()) {
        if (debouncedUsername.length >= 3) {
            setIsChecking(true);
            checkUsernameAvailability(debouncedUsername).then(result => {
                setAvailability(result);
                setIsChecking(false);
            });
        } else {
             setAvailability({ available: false, message: 'Username must be at least 3 characters.' });
        }
    } else {
      setAvailability(null);
    }
  }, [debouncedUsername, profile?.displayName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || !profile) return;

    if (username.toLowerCase() === profile.displayName?.toLowerCase()) {
        setIsOpen(false);
        return;
    }
    
    if (!availability?.available) {
        setError(availability?.message || 'Username is not available.');
        return;
    }

    startTransition(async () => {
      const result = await updateUserDisplayName(user.uid, username);
      if (result.success) {
        await updateProfile(user, { displayName: username });
        setIsOpen(false);
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your Username</DialogTitle>
          <DialogDescription>This will be your public name on the leaderboard.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username-edit">Username</Label>
              <div className="relative">
                <Input
                  id="username-edit"
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
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending || (!!availability && !availability.available)}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
