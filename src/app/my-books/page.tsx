import type { Metadata } from "next";
import { Suspense } from "react";
import MyBooksManager, {
  MyBooksManagerSkeleton,
} from "@/components/library/MyBooksManager";

export const metadata: Metadata = {
  title: "My Books",
  description: "View and manage the books you have shared on BookNook.",
};

export default function MyBooksPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Your library</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          My Books
        </h1>
        <p className="mt-3 text-muted-foreground">
          View, update, or remove the books you have contributed to the BookNook
          shelves.
        </p>
      </div>

      <Suspense fallback={<MyBooksManagerSkeleton />}>
        <MyBooksManager />
      </Suspense>
    </section>
  );
}
