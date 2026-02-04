'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, User as UserIcon, Flame, Star, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "../auth/actions";
import { Separator } from "@/components/ui/separator";

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined }) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-secondary/50 p-4">
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value ?? 'N/A'}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

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

  return (
    <>
      <div className="container mx-auto max-w-2xl px-4 py-6 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl md:text-2xl text-primary">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-primary">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User avatar'} />
                <AvatarFallback>
                  <UserIcon className="h-10 w-10 md:h-12 md:w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-2xl md:text-3xl font-bold font-headline">{profile.displayName || 'Anonymous User'}</h2>
                <p className="text-xs font-mono text-muted-foreground break-all">{user.uid}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard icon={Flame} label="Current Streak" value={`${profile.currentStreak || 0} days`} />
              <StatCard icon={Star} label="Total XP" value={profile.totalXp || 0} />
              <StatCard icon={CalendarDays} label="Joined On" value={joinDate} />
            </div>

            <form action={logout} className="w-full pt-4">
              <Button variant="destructive" className="w-full">Log Out</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
