
'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UserProfile, FriendRequest } from '@/lib/types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Flame, Star, CalendarDays, Home, ArrowLeft, GraduationCap, Trophy, UserPlus, Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { generateAvatarColor } from '@/lib/utils';
import { handleFriendRequest } from '@/app/social/actions';

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

export default function PublicProfilePage() {
    const { uid } = useParams();
    const { user, profile: currentUserProfile } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'accepted'>('none');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!uid) return;
        
        // Use a snapshot to always get the freshest data (preserving casing)
        const unsub = onSnapshot(doc(db, 'users', uid as string), (doc) => {
            if (doc.exists()) {
                setProfile({ uid: doc.id, ...doc.data() } as UserProfile);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [uid]);

    useEffect(() => {
        if (!user || !uid) return;
        
        const checkStatus = async () => {
            // 1. Check if already in friends list
            if (currentUserProfile?.friends?.includes(uid as string)) {
                setRequestStatus('accepted');
                return;
            }

            // 2. Check for pending friend request
            const q = query(
                collection(db, 'friend_requests'),
                where('senderId', '==', user.uid),
                where('receiverId', '==', uid),
                where('status', '==', 'pending')
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                setRequestStatus('pending');
            } else {
                setRequestStatus('none');
            }
        };
        checkStatus();
    }, [user, uid, currentUserProfile]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (!profile) notFound();

    const avatarColor = generateAvatarColor(profile.uid);
    const joinDate = profile.joinedat?.toDate 
        ? profile.joinedat.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) 
        : 'N/A';

    const handleSendRequest = async () => {
        if (!user || !currentUserProfile) return;
        setActionLoading(true);
        // Preserved casing for senderName
        const result = await handleFriendRequest(user.uid, currentUserProfile.username, profile.uid);
        if (result.success) setRequestStatus('pending');
        setActionLoading(false);
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-8">
            <div className="flex items-center justify-between gap-4 mb-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/leaderboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leaderboard
                    </Link>
                </Button>
            </div>

            <Card className="border-2 border-border shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden rounded-[2.5rem]">
                <CardHeader className="bg-secondary/10 border-b-2 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                            <AvatarFallback className="text-5xl font-black text-white" style={{backgroundColor: avatarColor}}>
                                {profile.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 text-center sm:text-left flex-1">
                            <h2 className="text-3xl md:text-4xl font-black text-foreground">
                                {profile.username}
                            </h2>
                            <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest pt-1">
                                UID: {profile.uid}
                            </div>
                            
                            {user?.uid !== profile.uid && (
                                <div className="mt-6 flex justify-center sm:justify-start">
                                    {requestStatus === 'none' && (
                                        <Button onClick={handleSendRequest} disabled={actionLoading} className="px-8 shadow-primary/20">
                                            {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                            Add Friend
                                        </Button>
                                    )}
                                    {requestStatus === 'pending' && (
                                        <Button variant="secondary" disabled className="px-8">
                                            <Clock className="mr-2 h-4 w-4" />
                                            Requested
                                        </Button>
                                    )}
                                    {requestStatus === 'accepted' && (
                                        <Button variant="outline" className="border-2 border-green-500 text-green-500 hover:bg-green-500/10 px-8" disabled>
                                            <Check className="mr-2 h-4 w-4" />
                                            Friends
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard icon={Flame} label="Daily Streak" value={`${profile.streak || 0} days`} />
                        <StatCard icon={GraduationCap} label="Grade" value={`Class ${profile.grade || 'N/A'}`} />
                        <StatCard icon={CalendarDays} label="Joined At" value={joinDate} />
                        <StatCard icon={Trophy} label="Total XP" value={`${profile.totalxp || 0} XP`} />
                    </div>
                </CardContent>

                <CardFooter className="justify-center border-t-2 bg-secondary/5 p-8">
                    <Button asChild variant="default" className="border-2 px-12 rounded-full h-14">
                        <Link href="/home">
                            <Home className="mr-2 h-5 w-5" />
                            Return Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
