"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Layers,
  LoaderCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { revalidateBookPages } from "@/app/actions";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export type BookDetail = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  userName?: string;
  userEmail?: string;
  totalCopies?: number;
  availableCopies?: number;
  createdAt?: string;
};

const getTodayString = () => new Date().toISOString().slice(0, 10);

const getDefaultReturnDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

const DetailMeta = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="truncate font-medium">{children}</p>
      </div>
    </div>
  );
};

export const BookDetailsView = ({ book }: { book: BookDetail }) => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const currentUser = session?.user;

  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState(false);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate());
  const [returnDateError, setReturnDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCopies = book.availableCopies ?? 0;
  const today = getTodayString();
  const isAvailable = availableCopies > 0;
  const isOwner = Boolean(
    currentUser?.email &&
    book.userEmail &&
    currentUser.email.toLowerCase() === book.userEmail.toLowerCase()
  );


  useEffect(() => {
    let isCancelled = false;

    if (isSessionLoading || !currentUser?.email) {
      return;
    }

    const checkExistingBorrow = async () => {
      try {
        const token = await getTokenFromClient();
        if (!token || isCancelled) return;

        const res = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok || isCancelled) return;

        const data: unknown = await res.json();
        if (Array.isArray(data) && !isCancelled) {
          const hasBorrowedThis = (data as { bookId?: string }[]).some(
            (record) => record.bookId === book._id
          );
          setIsAlreadyBorrowed(hasBorrowedThis);
        }
      } catch {

      }
    };

    void checkExistingBorrow();

    return () => {
      isCancelled = true;
    };
  }, [book._id, currentUser?.email, isSessionLoading]);

  const handleOpenBorrowDialog = () => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    if (isOwner) {
      toast.error("You cannot borrow your own book.");
      return;
    }

    if (isAlreadyBorrowed) {
      toast.error("You have already borrowed this book.");
      return;
    }

    if (!isAvailable) {
      toast.error("This book is not available right now.");
      return;
    }

    setReturnDate(getDefaultReturnDate());
    setReturnDateError("");
    setIsBorrowDialogOpen(true);
  };

  const handleConfirmBorrow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!returnDate || returnDate < today) {
      setReturnDateError("Return date cannot be before today.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getTokenFromClient();

      if (!token) {
        toast.error("Your session expired. Please log in again.");
        router.push(
          `/login?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`
        );
        return;
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
        }),
      });

      if (response.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push(
          `/login?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`
        );
        return;
      }

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data === "object" &&
            data !== null &&
            typeof (data as { msg?: unknown }).msg === "string"
            ? (data as { msg: string }).msg
            : "Failed to borrow book. Please try again.";

        toast.error(message);
        return;
      }

      toast.success("Book borrowed successfully!");
      setIsBorrowDialogOpen(false);
      setIsAlreadyBorrowed(true);
      await revalidateBookPages();
    } catch {
      toast.error("We couldn't connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const description =
    book.description?.trim() || "No description provided yet.";
  const addedBy = book.userName?.trim() || "Unknown";
  const totalCopies = book.totalCopies ?? 0;

  let buttonLabel = "Borrow This Book";
  let buttonDisabled = false;
  let helperText = "";

  if (!isAvailable) {
    buttonLabel = "Not Available";
    buttonDisabled = true;
    helperText = "All copies of this book are currently borrowed.";
  } else if (isOwner) {
    buttonLabel = "Your Added Book";
    buttonDisabled = true;
    helperText = "You cannot borrow a book you added to the shelves.";
  } else if (isAlreadyBorrowed) {
    buttonLabel = "Already Borrowed";
    buttonDisabled = true;
    helperText = "You currently have an active borrow for this book.";
  }

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
          {book.image ? (
            <Image
              src={book.image}
              alt={`Cover of ${book.title}`}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="size-16 text-primary/50" />
            </div>
          )}
        </div>

        <Card className="gap-6">
          <CardHeader className="space-y-3">
            {book.category ? (
              <Badge variant="secondary" className="w-fit">
                {book.category}
              </Badge>
            ) : null}
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {book.title}
            </h1>
            <p className="text-base text-muted-foreground">by {book.author}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-semibold">
                About this book
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {description}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <DetailMeta icon={UserRound} label="Added By">
                {addedBy}
              </DetailMeta>
              <DetailMeta icon={BookMarked} label="Available Copies">
                {availableCopies}
              </DetailMeta>
              <DetailMeta icon={Layers} label="Total Copies">
                {totalCopies}
              </DetailMeta>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              {isAvailable ? (
                <Badge className="gap-1.5 bg-primary/10 text-primary w-fit">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-primary"
                  />
                  {availableCopies} {availableCopies === 1 ? "copy" : "copies"}{" "}
                  available
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1.5 w-fit">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-destructive"
                  />
                  Not Available
                </Badge>
              )}

              <div className="flex flex-col gap-1.5 sm:items-end">
                <Button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={handleOpenBorrowDialog}
                  className="w-full sm:w-auto"
                >
                  {buttonLabel}
                </Button>
                {helperText && (
                  <p className="text-xs text-muted-foreground sm:text-right">
                    {helperText}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isBorrowDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setIsBorrowDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              Confirm your borrowing details for &quot;{book.title}&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBorrow} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="borrower-name">User Name</Label>
              <Input
                id="borrower-name"
                type="text"
                value={currentUser?.name || ""}
                readOnly
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="borrower-email">User Email</Label>
              <Input
                id="borrower-email"
                type="email"
                value={currentUser?.email || ""}
                readOnly
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="return-date">Return Date</Label>
              <div className="relative">
                <Input
                  id="return-date"
                  type="date"
                  required
                  min={today}
                  value={returnDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setReturnDateError("");
                  }}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(returnDateError)}
                />
              </div>
              {returnDateError ? (
                <p role="alert" className="text-xs text-destructive">
                  {returnDateError}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Select today or a future date for returning this book.
                </p>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsBorrowDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !returnDate}
              >
                {isSubmitting && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
                {isSubmitting ? "Confirming..." : "Confirm Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookDetailsView;