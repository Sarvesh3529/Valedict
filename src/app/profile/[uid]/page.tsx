'use server';

import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Flame, Star, CalendarDays, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { generateAvatarColor } from '@/lib/utils';

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-secondary/30 p-6 border-2 border-transparent hover:border-primary/20 transition-all">
      <div className="rounded-2xl bg-primary/10 p-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-black">{value ?? 'N/A'}</p>
      </div>
    </div>
  )
}

interface Props {
    params: { uid: string };
}

export default async function PublicProfilePage({ params }: Props) {
    const { uid } = await params;
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
        notFound();
    }

    const profile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
    const avatarColor = generateAvatarColor(profile.uid);

    const joinDate = profile.joinedat?.toDate 
        ? profile.joinedat.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) 
        : 'N/A';

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/leaderboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leaderboard
                    </Link>
                </Button>
            </div>

            <Card className="border-2 border-border shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden">
                <CardHeader className="bg-secondary/10 border-b-2 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                            <AvatarFallback className="text-5xl font-black text-white" style={{backgroundColor: avatarColor}}>
                                {profile.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2 text-center sm:text-left">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{profile.username}</h2>
                            <p className="text-sm font-bold text-primary bg-primary/10 px-4 py-1 rounded-full inline-block self-center sm:self-start">
                                Grade {profile.grade || 'N/A'} Student
                            </p>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard icon={Flame} label="Active Streak" value={`${profile.streak || 0} days`} />
                        <StatCard icon={Star} label="Total Experience" value={`${profile.totalxp || 0} XP`} />
                        <StatCard icon={CalendarDays} label="Joined Valedict" value={joinDate} />
                        <StatCard icon={Star} label="Highest Streak" value={`${profile.highestStreak || 0} days`} />
                    </div>
                </CardContent>

                <CardFooter className="justify-center border-t-2 bg-secondary/5 p-6">
                    <Button asChild variant="default" className="border-2 px-8">
                        <Link href="/home">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
