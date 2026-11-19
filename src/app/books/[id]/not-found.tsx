import Link from "next/link";
import { BookX, Home, Library } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BookNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <BookX className="size-7" />
          </span>
          <CardTitle className="text-xl">
            We couldn&apos;t find that book
          </CardTitle>
          <CardDescription>
            The book you&apos;re looking for may have been removed from the
            shelves, or the link might be incorrect.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/books" className={buttonVariants({ size: "lg" })}>
            <Library className="size-4" />
            Browse all books
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Home className="size-4" />
            Go to Home
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
