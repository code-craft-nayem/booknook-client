import Link from "next/link";
import { BookX, Compass, Home, Library } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "404 Not Found",
  description: "The page you are looking for does not exist on BookNook.",
};

export default function NotFound() {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:py-28">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 size-80 rounded-full bg-accent/40 blur-3xl"
      />

      <Card className="relative w-full max-w-2xl overflow-hidden border-border/80 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur-sm">
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        />

        <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/10 to-accent shadow-sm sm:size-28">
            <BookX className="size-12 text-primary sm:size-14" />
          </div>

          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-primary">
            <Library className="size-3.5" />
            <span>Lost in the Stacks</span>
          </div>

          <p className="font-heading bg-gradient-to-b from-primary via-primary/85 to-primary/50 bg-clip-text text-7xl font-extrabold tracking-tighter text-transparent select-none sm:text-8xl">
            404
          </p>

          <h1 className="font-heading mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            We couldn&apos;t find the shelf or page you were looking for. It may
            have been moved, renamed, or checked out to another reader.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href="/"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-11 w-full px-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto",
              })}
            >
              <Home className="size-4" />
              Back to Home
            </Link>
            <Link
              href="/books"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-11 w-full px-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent sm:w-auto",
              })}
            >
              <Compass className="size-4" />
              Browse Books
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
