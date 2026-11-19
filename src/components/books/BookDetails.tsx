import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Layers,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type BookDetail = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  userName?: string;
  totalCopies?: number;
  availableCopies?: number;
  createdAt?: string;
};

type BookResult =
  | { status: "ok"; book: BookDetail }
  | { status: "not-found" }
  | { status: "error" };

const getBook = async (id: string): Promise<BookResult> => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (response.status === 400 || response.status === 404) {
      return { status: "not-found" };
    }

    if (!response.ok) {
      return { status: "error" };
    }

    const data: unknown = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      typeof (data as BookDetail)._id !== "string" ||
      typeof (data as BookDetail).title !== "string"
    ) {
      return { status: "error" };
    }

    return { status: "ok", book: data as BookDetail };
  } catch {
    return { status: "error" };
  }
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

export const BookDetailsSkeleton = () => {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />

      <Card className="gap-6">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-20 rounded-4xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
};

const BookDetails = async ({
  params,
}: {
  params: PageProps<"/books/[id]">["params"];
}) => {
  const { id } = await params;
  const result = await getBook(id);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "error") {
    return (
      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>We couldn&apos;t load this book right now.</CardTitle>
          <CardDescription>
            The shelves are temporarily out of reach. Please try again in a
            moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/books"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Back to All Books
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { book } = result;
  const description =
    book.description?.trim() || "No description provided yet.";
  const addedBy = book.userName?.trim() || "Unknown";
  const availableCopies = book.availableCopies ?? 0;
  const totalCopies = book.totalCopies ?? 0;
  const isAvailable = availableCopies > 0;

  return (
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
              <Badge className="gap-1.5 bg-primary/10 text-primary">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-primary"
                />
                {availableCopies} {availableCopies === 1 ? "copy" : "copies"}{" "}
                available
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-destructive"
                />
                Not Available
              </Badge>
            )}

            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                type="button"
                disabled
                className="w-full sm:w-auto"
              >
                {isAvailable ? "Borrow This Book" : "Not Available"}
              </Button>
              {isAvailable ? (
                <p className="text-xs text-muted-foreground sm:text-right">
                  Borrowing will be available soon.
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetails;
