'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Loader2, User, ShieldX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type LeaderboardType = 'weekly' | 'all-time';

const renderRank = (rank: number, type: 'leaderboard' | 'user') => {
  const size = type === 'leaderboard' ? 'h-6 w-6' : 'h-8 w-8';
  if (rank === 0) return <Crown className={cn(size, "text-yellow-400 fill-yellow-400")} />;
  if (rank === 1) return <Crown className={cn(size, "text-gray-400 fill-gray-400")} />;
  if (rank === 2) return <Crown className={cn(size, "text-orange-400 fill-orange-400")} />;
  return <span className={cn("font-bold", type === 'leaderboard' ? 'text-lg' : 'text-2xl')}>{rank + 1}</span>;
};

const CurrentUserCard = ({ user, profile, rank, type }: { user: any, profile: UserProfile, rank: number | null, type: LeaderboardType}) => {
    return (
        <Card className="mt-8 sticky bottom-24 md:bottom-4 border-primary/50 ring-2 ring-primary/50 shadow-lg">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 text-center flex-shrink-0">
                       {rank !== null ? renderRank(rank, 'user') : <User className="h-8 w-8 mx-auto"/>}
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.photoURL ?? ''} />
                        <AvatarFallback>{profile.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-lg flex-1 break-words">{profile.displayName || 'Anonymous User'}</p>
                    <div className="text-right">
                        <p className="font-bold text-xl text-primary">{type === 'weekly' ? (profile.weeklyXp || 0) : (profile.totalXp || 0)} XP</p>
                        <p className="text-xs text-muted-foreground">{rank !== null ? `Rank #${rank + 1}` : 'Not Ranked'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function LeaderboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weekly');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !profile) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      const field = leaderboardType === 'weekly' ? 'weeklyXp' : 'totalXp';
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy(field, 'desc'), limit(50));
      
      try {
        const querySnapshot = await getDocs(q);
        const leaderboardUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          leaderboardUsers.push(doc.data() as UserProfile);
        });
        setUsers(leaderboardUsers);

        // Fetch current user's rank
        const currentUserScore = profile[field] || 0;
        if (currentUserScore > 0) {
          const rankQuery = query(usersRef, where(field, '>', currentUserScore));
          const rankSnapshot = await getCountFromServer(rankQuery);
          setCurrentUserRank(rankSnapshot.data().count);
        } else {
          setCurrentUserRank(null);
        }

      } catch (e: any) {
        if (e.code === 'permission-denied') {
          setError("You don't have permission to view the leaderboard. This may be due to security rules.");
        } else {
          setError("An error occurred while fetching the leaderboard.");
        }
        console.error("Leaderboard Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardType, user, profile]);
  
  if (authLoading || !user || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin"/></div>;
    }
    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <ShieldX className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return <UserList users={users} type={leaderboardType} currentUserId={user.uid} />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Leaderboard</CardTitle>
          <CardDescription>See who's at the top of the class!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={leaderboardType} onValueChange={(value) => setLeaderboardType(value as LeaderboardType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="all-time">All-Time</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">{renderContent()}</TabsContent>
            <TabsContent value="all-time">{renderContent()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {profile && !error && <CurrentUserCard user={user} profile={profile} rank={currentUserRank} type={leaderboardType} />}
    </div>
  );
}

function UserList({ users, type, currentUserId }: { users: UserProfile[], type: LeaderboardType, currentUserId: string }) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground p-8">The leaderboard is empty. Complete a quiz to get started!</p>
  }

  return (
    <div className="space-y-2 pt-4">
      {users.map((u, index) => (
        <div key={u.uid} className={cn(
            "flex items-center gap-4 p-3 rounded-lg bg-card transition-all",
            u.uid === currentUserId && "bg-primary/10 ring-2 ring-primary/80"
        )}>
          <div className="w-8 text-center flex-shrink-0 flex items-center justify-center">
             {renderRank(index, 'leaderboard')}
          </div>
          <Avatar>
            <AvatarImage src={u.photoURL ?? ''} />
            <AvatarFallback>{u.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <p className="font-medium flex-1 break-words">{u.displayName || 'Anonymous User'}</p>
          <p className="font-bold text-primary">{type === 'weekly' ? (u.weeklyXp || 0) : (u.totalXp || 0)} XP</p>
        </div>
      ))}
    </div>
  )
}
