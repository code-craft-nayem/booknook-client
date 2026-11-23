"use client";

import Link from "next/link";
import { BookOpen, Clock, Mail, Plus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCard() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            You must be logged in to view your profile details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login?callbackUrl=/profile"
            className={buttonVariants({ size: "default" })}
          >
            Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ||
    user.email[0]?.toUpperCase() ||
    "U";

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20 border-2 border-primary/20">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name || "Profile image"}
            />
            <AvatarFallback className="text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold">{user.name || "Reader"}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 text-primary" />
              <span>{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <CardHeader className="space-y-1">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <BookOpen className="size-5" />
            </span>
            <CardTitle className="text-base">My Books</CardTitle>
            <CardDescription className="text-xs">
              Manage the titles you have contributed to the shelves.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link
              href="/my-books"
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
            >
              View My Books
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="space-y-1">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <Clock className="size-5" />
            </span>
            <CardTitle className="text-base">My Borrows</CardTitle>
            <CardDescription className="text-xs">
              Track your borrowed books and return dates.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link
              href="/my-borrows"
              className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
            >
              View My Borrows
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="space-y-1">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <Plus className="size-5" />
            </span>
            <CardTitle className="text-base">Add Book</CardTitle>
            <CardDescription className="text-xs">
              Share a new book with the BookNook community.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link
              href="/add-book"
              className={buttonVariants({ size: "sm", className: "w-full" })}
            >
              Add a Book
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
