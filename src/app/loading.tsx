import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-4 py-12 text-center"
    >
      <div className="relative flex size-24 items-center justify-center sm:size-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded-full bg-primary/15 blur-xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-1.5 rounded-full bg-gradient-to-br from-primary/10 via-card to-accent/60 shadow-inner"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border-4 border-primary/15 border-t-primary border-r-primary/60"
        />
        <BookOpen
          aria-hidden="true"
          className="relative size-10 text-primary sm:size-12"
        />
      </div>

      <p className="font-heading mt-6 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        Loading...
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Gathering the shelves for you.
      </p>
    </div>
  );
}
