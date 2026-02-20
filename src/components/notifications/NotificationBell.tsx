
'use client';

import { useState, useEffect } from 'react';
import { Bell, UserPlus, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { FriendRequest } from '@/lib/types';
import { acceptFriendRequest, declineFriendRequest } from '@/app/social/actions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationBell() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Red Dot Logic: Query pending requests where I am the receiver
    const q = query(
      collection(db, 'friend_requests'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FriendRequest));
      setRequests(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (req: FriendRequest) => {
    if (!user) return;
    setActionLoading(req.id);
    await acceptFriendRequest(req.id, req.senderId, user.uid);
    setActionLoading(null);
  };

  const handleDecline = async (req: FriendRequest) => {
    setActionLoading(req.id);
    await declineFriendRequest(req.id);
    setActionLoading(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-secondary">
          <Bell className="h-5 w-5 text-foreground" />
          {requests.length > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-2 shadow-2xl overflow-hidden rounded-2xl">
        <div className="p-4 border-b bg-secondary/10">
          <h3 className="font-black text-sm uppercase tracking-widest text-primary">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {requests.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-tight">All quiet here!</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="p-4 border-b last:border-0 hover:bg-primary/5 transition-colors">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-tight">
                      <span className="text-primary">{req.senderName}</span> wants to be friends!
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">
                      {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate()) + ' ago' : 'Just now'}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="h-8 rounded-lg px-4 text-[10px] flex-1" 
                        onClick={() => handleAccept(req)}
                        disabled={actionLoading === req.id}
                      >
                        {actionLoading === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="mr-1 h-3 w-3" />}
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 rounded-lg px-4 text-[10px] flex-1" 
                        onClick={() => handleDecline(req)}
                        disabled={actionLoading === req.id}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Ignore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
