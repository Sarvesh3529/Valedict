'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Flame, Star, CalendarDays, Home, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import EditUsernameDialog from "@/components/profile/EditUsernameDialog";
import { generateAvatarColor } from "@/lib/utils";

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-secondary/30 p-6 border-2 border-transparent hover:border-primary/20 transition-all group">
      <div className="rounded-2xl bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-black">{value ?? 'N/A'}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (loading || !user || !profile) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

  const avatarColor = generateAvatarColor(user.uid);
  const joinDate = profile.joinedat?.toDate 
    ? profile.joinedat.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) 
    : 'N/A';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
      <Card className="border-2 border-border shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b-2 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
              <AvatarFallback className="text-5xl font-black text-white" style={{backgroundColor: avatarColor}}>
                {profile.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  {profile.username || 'Anonymous User'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-bold text-muted-foreground">
                Joined Valedict AI on {joinDate}
              </p>
              <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest pt-1">
                ID: {user.uid.slice(0, 8)}...
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard icon={Flame} label="Daily Streak" value={`${profile.streak || 0} days`} />
            <StatCard icon={Star} label="Total XP" value={`${profile.totalxp || 0} XP`} />
            <StatCard icon={CalendarDays} label="Grade Level" value={`Class ${profile.grade || 'N/A'}`} />
            <StatCard icon={Star} label="Highest Streak" value={`${profile.highestStreak || 0} days`} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t-2 bg-secondary/5 p-8">
          <Button asChild variant="outline" className="border-2 w-full sm:w-auto">
            <Link href="/home">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button onClick={logout} variant="destructive" className="w-full sm:w-auto border-2">
            Log Out
          </Button>
        </CardFooter>
      </Card>

      <EditUsernameDialog 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        currentUsername={profile.username} 
      />
    </div>
  );
}
