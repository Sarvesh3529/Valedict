
'use client';

import { useState, useEffect } from 'react';
import { Bell, UserPlus, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHeader,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { acceptFriendRequest, markNotificationRead } from '@/app/social/actions';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleAccept = async (n: Notification) => {
    if (!user) return;
    setLoading(true);
    await acceptFriendRequest(n.relatedId, n.id, user.uid);
    setLoading(false);
  };

  const handleMarkRead = async (n: Notification) => {
    if (!user || n.status === 'read') return;
    await markNotificationRead(user.uid, n.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-secondary">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-2 shadow-2xl">
        <div className="p-4 border-b bg-secondary/10">
          <h3 className="font-black text-sm uppercase tracking-widest">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              All quiet here!
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 border-b last:border-0 transition-colors",
                  n.status === 'unread' ? "bg-primary/5" : "bg-background"
                )}
                onMouseEnter={() => handleMarkRead(n)}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-tight">
                      <span className="text-primary">{n.fromUsername}</span> sent you a friend request.
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">
                      {n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate()) + ' ago' : 'Just now'}
                    </p>
                    {n.status === 'unread' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="h-8 rounded-lg px-4 text-[10px]" 
                          onClick={() => handleAccept(n)}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="mr-1 h-3 w-3" />}
                          Accept
                        </Button>
                      </div>
                    )}
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
