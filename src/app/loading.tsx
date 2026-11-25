import { BookOpen, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <BookOpen className="size-7" />
        </div>
        <h1 className="font-heading mt-5 text-xl font-semibold tracking-tight">
          Opening your library
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gathering the shelves for you.
        </p>
        <div className="mt-8 w-full space-y-3">
          <Skeleton className="mx-auto h-3 w-3/4" />
          <Skeleton className="mx-auto h-3 w-1/2" />
        </div>
        <Loader2
          className="mt-8 size-6 animate-spin text-primary"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
