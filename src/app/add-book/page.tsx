import type { Metadata } from "next";
import { Suspense } from "react";
import AddBookForm, {
  AddBookFormSkeleton,
} from "@/components/library/AddBookForm";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Share a book with the BookNook shelves.",
};

export default function AddBookPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Share a book</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Add Book
        </h1>
        <p className="mt-3 text-muted-foreground">
          Add a new title to the BookNook shelves and let other readers discover
          it.
        </p>
      </div>

      <Suspense fallback={<AddBookFormSkeleton />}>
        <AddBookForm />
      </Suspense>
    </section>
  );
}
