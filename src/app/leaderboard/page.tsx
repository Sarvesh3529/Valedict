'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type LeaderboardType = 'weekly' | 'all-time';

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weekly');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      const field = leaderboardType === 'weekly' ? 'weeklyXp' : 'totalXp';
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy(field, 'desc'), limit(50));
      
      const querySnapshot = await getDocs(q);
      const leaderboardUsers: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        leaderboardUsers.push(doc.data() as UserProfile);
      });
      
      setUsers(leaderboardUsers);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [leaderboardType, user]);
  
  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderRank = (rank: number) => {
    if (rank === 0) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 1) return <Crown className="h-6 w-6 text-gray-400" />;
    if (rank === 2) return <Crown className="h-6 w-6 text-orange-400" />;
    return <span className="font-bold text-lg">{rank + 1}</span>;
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as LeaderboardType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="all-time">All-Time</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin"/></div>
              ) : (
                <UserList users={users} type="weekly" />
              )}
            </TabsContent>
            <TabsContent value="all-time">
               {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin"/></div>
              ) : (
                <UserList users={users} type="all-time" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function UserList({ users, type }: { users: UserProfile[], type: LeaderboardType }) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground p-8">The leaderboard is empty. Complete a quiz to get started!</p>
  }

  return (
    <div className="space-y-4 pt-4">
      {users.map((u, index) => (
        <div key={u.uid} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
          <div className="w-8 text-center flex-shrink-0">
             {renderRank(index)}
          </div>
          <Avatar>
            <AvatarImage src={u.photoURL ?? ''} />
            <AvatarFallback>{u.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <p className="font-medium truncate flex-1">{u.displayName || 'Anonymous User'}</p>
          <p className="font-bold text-primary">{type === 'weekly' ? (u.weeklyXp || 0) : (u.totalXp || 0)} XP</p>
        </div>
      ))}
    </div>
  )
}
