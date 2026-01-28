import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl text-primary">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://picsum.photos/seed/user-profile/200" alt="User avatar" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Anonymous User</h2>
            <p className="text-muted-foreground">Welcome to ExamPrep AI!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
