"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { revalidateBookPages } from "@/app/actions";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type BorrowRecord = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    const d = new Date(dateString);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

const isOverdue = (returnDateString?: string) => {
  if (!returnDateString) return false;
  const today = new Date().toISOString().slice(0, 10);
  return returnDateString < today;
};

export const MyBorrowsManagerSkeleton = () => {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <Card>
        <div className="p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b last:border-b-0"
            >
              <Skeleton className="aspect-[3/4] w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const MyBorrowsManager = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowToReturn, setBorrowToReturn] = useState<BorrowRecord | null>(
    null
  );
  const [isReturning, setIsReturning] = useState(false);

  const currentUser = session?.user;

  useEffect(() => {
    let isCancelled = false;

    if (isSessionLoading) {
      return;
    }

    if (!currentUser?.email) {
      return;
    }

    const loadBorrows = async () => {
      try {
        const token = await getTokenFromClient();

        if (!token) {
          if (!isCancelled) {
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          if (!isCancelled) {
            toast.error("Your session expired. Please log in again.");
            router.push(
              `/login?callbackUrl=${encodeURIComponent("/my-borrows")}`
            );
          }
          return;
        }

        if (!response.ok) {
          if (!isCancelled) {
            toast.error("Failed to fetch borrowed books.");
          }
          return;
        }

        const data: unknown = await response.json();
        if (isCancelled) return;

        if (Array.isArray(data)) {
          // Sort with nearest return date first
          const sorted = [...(data as BorrowRecord[])].reverse();
          setBorrows(sorted);
        }
      } catch {
        if (!isCancelled) {
          toast.error(
            "We couldn't connect to the server. Please check your connection."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadBorrows();

    return () => {
      isCancelled = true;
    };
  }, [currentUser?.email, isSessionLoading, router]);

  const handleReturnConfirm = async () => {
    if (!borrowToReturn || isReturning) return;

    setIsReturning(true);

    try {
      const token = await getTokenFromClient();

      if (!token) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-borrows")}`);
        return;
      }

      const response = await fetch(`${API_URL}/borrows/${borrowToReturn._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-borrows")}`);
        return;
      }

      const payload: unknown = await response.json().catch(() => null);
      const message =
        typeof payload === "object" &&
          payload !== null &&
          typeof (payload as { msg?: unknown }).msg === "string"
          ? (payload as { msg: string }).msg
          : null;

      if (!response.ok) {
        toast.error(message || "Failed to return book.");
        setBorrowToReturn(null);
        return;
      }

      setBorrows((prev) => prev.filter((b) => b._id !== borrowToReturn._id));
      toast.success(message || "Book returned successfully");
      setBorrowToReturn(null);
      await revalidateBookPages();
    } catch {
      toast.error("We couldn't reach the server. Please try again.");
    } finally {
      setIsReturning(false);
    }
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-center">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your borrowed books...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Authentication required</CardTitle>
          <CardDescription>
            You must be signed in to view your borrowed books.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login?callbackUrl=/my-borrows"
            className={buttonVariants({ size: "default" })}
          >
            Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (borrows.length === 0) {
    return (
      <Card className="mt-8 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-7" />
          </div>
          <h3 className="font-heading mt-4 text-xl font-semibold">
            No borrowed books
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t borrowed any books from BookNook yet. Browse the
            shelves and find your next read!
          </p>
          <div className="mt-6">
            <Link href="/books" className={buttonVariants({ size: "default" })}>
              <BookOpen className="size-4" />
              Browse Books
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Currently Borrowed ({borrows.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Keep track of your borrowed books and return dates.
          </p>
        </div>
        <Link href="/books" className={buttonVariants({ size: "sm" })}>
          <BookOpen className="size-4" />
          Browse More Books
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="mt-6 hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Cover</TableHead>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.map((borrow) => {
              const overdue = isOverdue(borrow.returnDate);

              return (
                <TableRow key={borrow._id}>
                  <TableCell>
                    <div className="relative aspect-[3/4] w-12 overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
                      {borrow.bookImage ? (
                        <Image
                          src={borrow.bookImage}
                          alt={`Cover of ${borrow.bookTitle || "book"}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="size-5 text-primary/50" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/books/${borrow.bookId}`}
                      className="hover:text-primary transition-colors line-clamp-2"
                    >
                      {borrow.bookTitle || "Untitled Book"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>{formatDate(borrow.borrowDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span
                          className={
                            overdue
                              ? "font-medium text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          {formatDate(borrow.returnDate)}
                        </span>
                      </div>
                      {overdue ? (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBorrowToReturn(borrow)}
                      className="h-8 gap-1.5"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Return Book</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Equal-Height Cards View */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:hidden">
        {borrows.map((borrow) => {
          const overdue = isOverdue(borrow.returnDate);

          return (
            <Card
              key={borrow._id}
              className="flex flex-col justify-between overflow-hidden"
            >
              <div className="flex gap-4 p-4">
                <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
                  {borrow.bookImage ? (
                    <Image
                      src={borrow.bookImage}
                      alt={`Cover of ${borrow.bookTitle || "book"}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="size-6 text-primary/50" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <Link
                      href={`/books/${borrow.bookId}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 text-sm"
                    >
                      {borrow.bookTitle || "Untitled Book"}
                    </Link>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span>Borrowed: {formatDate(borrow.borrowDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span
                        className={
                          overdue
                            ? "font-medium text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        Due: {formatDate(borrow.returnDate)}
                      </span>
                      {overdue ? (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0">
                          Overdue
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-border bg-muted/30 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBorrowToReturn(borrow)}
                  className="w-full h-8 gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Return Book</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Return Book Confirmation Modal */}
      <AlertDialog
        open={Boolean(borrowToReturn)}
        onOpenChange={(open) => {
          if (!open && !isReturning) {
            setBorrowToReturn(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to return{" "}
              <span className="font-semibold text-foreground">
                &quot;{borrowToReturn?.bookTitle || "this book"}&quot;
              </span>{" "}
              to the BookNook shelves?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isReturning}
              onClick={() => setBorrowToReturn(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isReturning}
              onClick={handleReturnConfirm}
            >
              {isReturning && <LoaderCircle className="size-4 animate-spin" />}
              {isReturning ? "Returning..." : "Return Book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBorrowsManager;