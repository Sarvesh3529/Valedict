'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, User as UserIcon, Flame, Star, CalendarDays, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "../auth/actions";
import { Separator } from "@/components/ui/separator";
import EditUsernameDialog from "@/components/profile/EditUsernameDialog";
import { achievementsMap, type Achievement } from '@/lib/achievements';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value ?? 'N/A'}</p>
      </div>
    </div>
  )
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50 border border-transparent hover:border-accent transition-colors">
                        <div className="p-3 bg-accent/10 rounded-full">
                            <achievement.icon className="h-8 w-8 text-accent" />
                        </div>
                        <p className="text-xs font-semibold text-center">{achievement.name}</p>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{achievement.description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function ProfilePage() {
    const { user, profile, loading, signOut } = useAuth();
    const router = useRouter();
    const [isEditUsernameOpen, setIsEditUsernameOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);


    if (loading || !user || !profile) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

  const joinDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) 
    : 'N/A';

  const userAchievements = (profile.achievements || []).map(id => achievementsMap[id]).filter(Boolean);
  // Dummy achievements for display until logic is implemented
  if (userAchievements.length === 0) {
      userAchievements.push(achievementsMap['first-quiz']);
      userAchievements.push(achievementsMap['streak-7']);
  }


  return (
    <>
      <div className="container mx-auto max-w-3xl px-4 py-6 md:py-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={profile.photoURL ?? ''} alt={profile.displayName ?? 'User avatar'} />
                <AvatarFallback className="text-3xl">
                  {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl md:text-3xl font-bold font-headline">{profile.displayName || 'Anonymous User'}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditUsernameOpen(true)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                 <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-xs font-mono text-muted-foreground break-all pt-2">UID: {user.uid}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={Flame} label="Current Streak" value={`${profile.currentStreak || 0} days`} />
              <StatCard icon={Star} label="Total XP" value={profile.totalXp || 0} />
              <StatCard icon={CalendarDays} label="Joined On" value={joinDate} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Achievements</CardTitle>
                <CardDescription>Badges you've earned on your learning journey.</CardDescription>
            </CardHeader>
            <CardContent>
                {userAchievements.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {userAchievements.map(ach => <AchievementBadge key={ach.id} achievement={ach}/>)}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center p-8">No achievements yet. Complete some quizzes to start earning badges!</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-destructive">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={logout}>
                  <Button variant="destructive" className="w-full">Log Out</Button>
                </form>
            </CardContent>
        </Card>
      </div>
      {profile.displayName && (
        <EditUsernameDialog 
            isOpen={isEditUsernameOpen} 
            setIsOpen={setIsEditUsernameOpen} 
            currentUsername={profile.displayName}
        />
      )}
    </>
  );
}
