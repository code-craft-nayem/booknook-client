import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { type Book } from "@/components/library/BookCard";
import BooksBrowserView from "@/components/library/BooksBrowserView";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const getCreatedAtTime = (book: Book) => {
  const time = book.createdAt ? new Date(book.createdAt).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
};

const getBooks = async (): Promise<Book[] | null> => {
  try {
    const response = await fetch(`${API_URL}/books`, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    return Array.isArray(data) ? (data as Book[]) : null;
  } catch {
    return null;
  }
};

export const BooksBrowserSkeleton = () => {
  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      <Skeleton className="mt-6 h-4 w-40" />

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="gap-4 overflow-hidden pt-0">
            <Skeleton className="aspect-[3/4] rounded-none" />
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-20 rounded-4xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BooksBrowser = async ({
  searchParams,
}: {
  searchParams: PageProps<"/books">["searchParams"];
}) => {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const requestedCategory =
    typeof params.category === "string" ? params.category : "";
  const category = categories.includes(requestedCategory)
    ? requestedCategory
    : "";

  const books = await getBooks();

  if (books === null) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>We couldn&apos;t load the books right now.</CardTitle>
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
            Try again
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (books.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </span>
            <CardTitle>The shelves are empty.</CardTitle>
          </div>
          <CardDescription>
            Be the first to share a book with the BookNook community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/add-book" className={buttonVariants({ size: "sm" })}>
            Add a Book
            <ArrowRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const sortedBooks = [...books].sort(
    (a, b) => getCreatedAtTime(b) - getCreatedAtTime(a)
  );

  return (
    <BooksBrowserView
      books={sortedBooks}
      initialQuery={q}
      initialCategory={category}
    />
  );
};

export default BooksBrowser;
