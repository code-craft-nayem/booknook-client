import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BookCard, { type Book } from "@/components/books/BookCard";
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

const getLatestBooks = async (): Promise<Book[] | null> => {
  try {
    const response = await fetch(`${API_URL}/books`, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    const books: Book[] = await response.json();

    return books
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 6);
  } catch {
    return null;
  }
};

export const LatestBooksSkeleton = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
    </section>
  );
};

const LatestBooks = async () => {
  const books = await getLatestBooks();

  return (
    <section
      aria-labelledby="latest-books-heading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Fresh from the shelf</p>
          <h2
            id="latest-books-heading"
            className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Latest Books
          </h2>
          <p className="mt-3 text-muted-foreground">
            The newest additions to the BookNook shelf, ready for your next
            chapter.
          </p>
        </div>
        <Link
          href="/books"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          See All Books
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {books === null ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>We couldn&apos;t load the latest books</CardTitle>
            <CardDescription>
              The shelf is temporarily out of reach. Please try again in a
              moment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/books"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Browse the shelves
            </Link>
          </CardContent>
        </Card>
      ) : books.length === 0 ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>The shelves are waiting for their first book</CardTitle>
            <CardDescription>
              Be the first to share a book with the BookNook community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/add-book"
              className={buttonVariants({ size: "sm" })}
            >
              Add a Book
              <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestBooks;
