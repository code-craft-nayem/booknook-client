import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import BookDetails, {
  BookDetailsSkeleton,
} from "@/components/books/BookDetails";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Book Details",
  description: "View a book on the BookNook shelves.",
};

// The book id is only known at request time, so this route renders on demand.
export const instant = false;

export default function BookDetailsPage(props: PageProps<"/books/[id]">) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/books"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "-ml-2.5 w-fit",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to All Books
      </Link>

      <Suspense fallback={<BookDetailsSkeleton />}>
        <BookDetails params={props.params} />
      </Suspense>
    </section>
  );
}
