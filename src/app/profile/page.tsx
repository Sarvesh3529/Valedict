'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Flame, Star, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export default function ProfilePage() {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);


    const avatarColor = useMemo(() => {
        if (!user) return 'hsl(var(--muted))';
        let hash = 0;
        for (let i = 0; i < user.uid.length; i++) {
            hash = user.uid.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = hash % 360;
        return `hsl(${h}, 35%, 55%)`;
    }, [user]);

    if (loading || !user || !profile) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

  const joinDate = profile.joinedat?.toDate 
    ? profile.joinedat.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) 
    : 'N/A';

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
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl font-semibold text-white" style={{backgroundColor: avatarColor}}>
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-bold font-headline">{profile.username || 'Anonymous User'}</h2>
                 <p className="text-muted-foreground">{user.email || 'No email associated'}</p>
                <p className="text-xs font-mono text-muted-foreground break-all pt-2">UID: {user.uid}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={Flame} label="Current Streak" value={`${profile.streak || 0} days`} />
              <StatCard icon={Star} label="Total XP" value={profile.totalxp || 0} />
              <StatCard icon={CalendarDays} label="Joined On" value={joinDate} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl text-destructive">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={logout} variant="destructive" className="w-full">Log Out</Button>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
