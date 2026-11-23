import Link from "next/link";
import { BookX, Compass, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "404 Not Found",
  description: "The page you are looking for does not exist on BookNook.",
};

export default function NotFound() {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <Card className="relative w-full max-w-lg border-border/80 shadow-lg">
        <CardHeader className="items-center text-center space-y-3">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookX className="size-8" />
          </span>
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider uppercase text-primary">
              404 Error
            </p>
            <CardTitle className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Page Not Found
            </CardTitle>
          </div>
          <CardDescription className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
            We couldn&apos;t find the shelf or page you were looking for. It may
            have been moved, renamed, or is temporarily unavailable.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
          >
            <Home className="size-4" />
            Back to Home
          </Link>
          <Link
            href="/books"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            <Compass className="size-4" />
            Browse Books
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
