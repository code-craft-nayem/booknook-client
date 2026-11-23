import type { Metadata } from "next";
import { Suspense } from "react";
import MyBorrowsManager, {
  MyBorrowsManagerSkeleton,
} from "@/components/books/MyBorrowsManager";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "View and manage your borrowed books on BookNook.",
};

export default function MyBorrowsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Your reading list</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          My Borrows
        </h1>
        <p className="mt-3 text-muted-foreground">
          Track the books you currently have checked out from the shelves and
          return them when you&apos;re done.
        </p>
      </div>

      <Suspense fallback={<MyBorrowsManagerSkeleton />}>
        <MyBorrowsManager />
      </Suspense>
    </section>
  );
}
