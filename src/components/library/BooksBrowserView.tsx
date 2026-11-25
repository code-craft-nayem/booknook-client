"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BookCard, { type Book } from "@/components/library/BookCard";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

const buildBooksUrl = (q: string, category: string) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/books?${query}` : "/books";
};

type BooksBrowserViewProps = {
  books: Book[];
  initialQuery: string;
  initialCategory: string;
};

const BooksBrowserView = ({
  books,
  initialQuery,
  initialCategory,
}: BooksBrowserViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawQuery = searchParams.get("q");
  const rawCategory = searchParams.get("category");
  const urlQuery = rawQuery !== null ? rawQuery.trim() : initialQuery;
  const candidateCategory =
    rawCategory !== null ? rawCategory : initialCategory;
  const category = CATEGORIES.includes(candidateCategory)
    ? candidateCategory
    : "";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchInput(urlQuery);
  }

  const normalizedQuery = urlQuery.toLowerCase();
  const matchingBooks = books.filter((book) => {
    if (category && book.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      (book.title ?? "").toLowerCase().includes(normalizedQuery) ||
      (book.author ?? "").toLowerCase().includes(normalizedQuery)
    );
  });

  const handleSearchChange = (nextValue: string) => {
    setSearchInput(nextValue);

    if (!nextValue.trim() && urlQuery) {
      router.replace(buildBooksUrl("", category), { scroll: false });
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildBooksUrl(searchInput.trim(), category), { scroll: false });
  };

  const handleCategorySelect = (nextCategory: string) => {
    router.push(buildBooksUrl(searchInput.trim(), nextCategory), {
      scroll: false,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    router.push("/books", { scroll: false });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="flex w-full max-w-md items-center gap-2"
        >
          <Input
            type="search"
            name="q"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title or author"
            aria-label="Search books by title or author"
            className="h-10 bg-background"
          />
          <button
            type="submit"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <nav
          aria-label="Filter books by category"
          className="flex flex-wrap gap-2"
        >
          <Button
            type="button"
            variant={category ? "outline" : "default"}
            size="lg"
            aria-current={category ? undefined : "page"}
            onClick={() => handleCategorySelect("")}
          >
            All
          </Button>
          {CATEGORIES.map((name) => (
            <Button
              key={name}
              type="button"
              variant={category === name ? "default" : "outline"}
              size="lg"
              aria-current={category === name ? "page" : undefined}
              onClick={() => handleCategorySelect(name)}
            >
              {name}
            </Button>
          ))}
        </nav>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {matchingBooks.length}
        </span>{" "}
        of <span className="font-medium text-foreground">{books.length}</span>{" "}
        books
      </p>

      {matchingBooks.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No books match your search.</CardTitle>
            <CardDescription>
              Try a different title, author, or category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matchingBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksBrowserView;
