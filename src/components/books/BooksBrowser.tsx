import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import BookCard, { type Book } from "@/components/books/BookCard";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
  const normalizedQuery = q.toLowerCase();

  const matchingBooks = sortedBooks.filter((book) => {
    if (category && book.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      (book.title ?? "").toLowerCase().includes(normalizedQuery) ||
      (book.author ?? "").toLowerCase().includes(normalizedQuery)
    );
  });

  const buildCategoryHref = (nextCategory: string) => {
    const query = new URLSearchParams();

    if (q) {
      query.set("q", q);
    }

    if (nextCategory) {
      query.set("category", nextCategory);
    }

    const search = query.toString();
    return search ? `/books?${search}` : "/books";
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          action="/books"
          method="get"
          role="search"
          className="flex w-full max-w-md items-center gap-2"
        >
          {category ? (
            <input type="hidden" name="category" value={category} />
          ) : null}
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by title or author"
            aria-label="Search books by title or author"
            className="h-10 bg-background"
          />
          <button
            type="submit"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <nav
          aria-label="Filter books by category"
          className="flex flex-wrap gap-2"
        >
          <Link
            href={buildCategoryHref("")}
            aria-current={category ? undefined : "page"}
            className={buttonVariants({
              variant: category ? "outline" : "default",
              size: "lg",
            })}
          >
            All
          </Link>
          {categories.map((name) => (
            <Link
              key={name}
              href={buildCategoryHref(name)}
              aria-current={category === name ? "page" : undefined}
              className={buttonVariants({
                variant: category === name ? "default" : "outline",
                size: "lg",
              })}
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {matchingBooks.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{sortedBooks.length}</span>{" "}
        books
      </p>

      {matchingBooks.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No books match your search.</CardTitle>
            <CardDescription>
              Try a different title, author, or category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/books"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Clear filters
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matchingBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksBrowser;
