import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BookDetailsView, {
  type BookDetail,
} from "@/components/library/BookDetailsView";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  return <BookDetailsView book={result.book} />;
};

export default BookDetails;
