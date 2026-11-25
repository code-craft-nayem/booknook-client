import type { Metadata } from "next";
import { Suspense } from "react";
import BooksBrowser, {
  BooksBrowserSkeleton,
} from "@/components/library/BooksBrowser";

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse every book on the BookNook shelves.",
};

export default function BooksPage(props: PageProps<"/books">) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Browse the shelves</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          All Books
        </h1>
        <p className="mt-3 text-muted-foreground">
          Browse every book on the BookNook shelves and find your next chapter.
        </p>
      </div>

      <Suspense fallback={<BooksBrowserSkeleton />}>
        <BooksBrowser searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
