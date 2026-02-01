'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "../auth/actions";


export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }


  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Avatar className="h-20 w-20 md:h-24 md:w-24">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User avatar'} />
            <AvatarFallback>
              <UserIcon className="h-10 w-10 md:h-12 md:w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold">{user.displayName || 'Anonymous User'}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <form action={logout} className="w-full max-w-xs">
            <Button variant="destructive" className="w-full">Log Out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
