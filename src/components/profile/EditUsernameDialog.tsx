'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { checkUsernameAvailability } from '@/lib/username';
import { updateUsername } from '@/app/auth/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditUsernameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
}

export default function EditUsernameDialog({ isOpen, onOpenChange, currentUsername }: EditUsernameDialogProps) {
  const [username, setUsername] = useState(currentUsername);
  const [debouncedUsername] = useDebounce(username, 500);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean, message: string } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.toLowerCase() !== currentUsername.toLowerCase()) {
      if (debouncedUsername.length >= 3) {
        setIsChecking(true);
        checkUsernameAvailability(debouncedUsername).then((res) => {
          setAvailability(res);
          setIsChecking(false);
        });
      } else {
        setAvailability({ available: false, message: 'Minimum 3 characters.' });
      }
    } else {
      setAvailability(null);
    }
  }, [debouncedUsername, currentUsername]);

  const handleSave = async () => {
    if (username.toLowerCase() === currentUsername.toLowerCase()) {
      onOpenChange(false);
      return;
    }
    
    if (availability && !availability.available) return;

    setIsPending(true);
    setError(null);
    
    const result = await updateUsername(username);
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.message || 'Failed to update username.');
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-2">
        <DialogHeader>
          <DialogTitle className="font-black text-xl uppercase">Update Username</DialogTitle>
          <DialogDescription className="font-bold">
            Choose a unique name for the leaderboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">New Username</Label>
            <div className="relative">
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="New username"
                className="border-2 h-12 font-bold"
                maxLength={12}
              />
              {debouncedUsername.toLowerCase() !== currentUsername.toLowerCase() && username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : 
                   availability?.available ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                   <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              )}
            </div>
            {availability && (
              <p className={`text-[10px] font-black uppercase tracking-wider ${availability.available ? 'text-green-500' : 'text-destructive'}`}>
                {availability.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertDescription className="font-bold">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isPending || (availability !== null && !availability.available) || username.length < 3}
            className="w-full sm:w-auto"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Name'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
