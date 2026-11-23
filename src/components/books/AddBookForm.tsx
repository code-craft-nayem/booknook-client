"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BOOK_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

type FieldErrors = {
  title?: string;
  author?: string;
  category?: string;
  image?: string;
  totalCopies?: string;
  description?: string;
};

const getPreviewSrc = (value: string) => {
  try {
    const url = new URL(value.trim());

    return url.protocol === "http:" || url.protocol === "https:"
      ? value.trim()
      : "";
  } catch {
    return "";
  }
};

export const AddBookFormSkeleton = () => {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Card className="gap-6">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full sm:w-40" />
        </CardContent>
      </Card>
    </div>
  );
};

const AddBookForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewSrc = getPreviewSrc(image);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors: FieldErrors = {};
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedImage = image.trim();
    const trimmedDescription = description.trim();
    const copies = Number(totalCopies);

    if (!trimmedTitle) {
      nextErrors.title = "Book title is required.";
    }

    if (!trimmedAuthor) {
      nextErrors.author = "Author is required.";
    }

    if (!BOOK_CATEGORIES.includes(category)) {
      nextErrors.category = "Please select a category.";
    }

    if (!trimmedImage) {
      nextErrors.image = "Cover image URL is required.";
    } else if (!getPreviewSrc(trimmedImage)) {
      nextErrors.image = "Enter a valid image URL starting with http:// or https://.";
    }

    if (!totalCopies.trim()) {
      nextErrors.totalCopies = "Total copies is required.";
    } else if (!Number.isInteger(copies) || copies < 1) {
      nextErrors.totalCopies = "Enter a whole number of at least 1.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Description is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getTokenFromClient();

      if (!token) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/add-book")}`);
        return;
      }

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          author: trimmedAuthor,
          category,
          image: trimmedImage,
          description: trimmedDescription,
          totalCopies: copies,
        }),
      });

      if (response.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/add-book")}`);
        return;
      }

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const message =
          typeof payload === "object" &&
            payload !== null &&
            typeof (payload as { msg?: unknown }).msg === "string"
            ? (payload as { msg: string }).msg
            : "We couldn't add this book. Please try again.";

        toast.error(message);
        return;
      }

      const data: unknown = await response.json().catch(() => null);
      const newId =
        typeof data === "object" &&
          data !== null &&
          typeof (data as { _id?: unknown })._id === "string"
          ? (data as { _id: string })._id
          : null;

      toast.success("Book added to the shelves.");
      router.push(newId ? `/books/${newId}` : "/books");
    } catch {
      toast.error(
        "We couldn't reach the shelves. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt={`Cover preview of ${title.trim() || "your book"}`}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 22rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <BookOpen className="size-14 text-primary/50" />
              <p className="text-sm text-muted-foreground">
                Your cover preview will appear here.
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a direct image link. File uploads are coming soon.
        </p>
      </div>

      <Card className="gap-6">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Book details</CardTitle>
          <CardDescription>
            Tell us about the book you want to share with the shelves.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="The Silent Orchard"
                className="h-10"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearError("title");
                }}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p
                  id="title-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Ayesha Rahman"
                  className="h-10"
                  value={author}
                  onChange={(event) => {
                    setAuthor(event.target.value);
                    clearError("author");
                  }}
                  aria-invalid={Boolean(errors.author)}
                  aria-describedby={errors.author ? "author-error" : undefined}
                  disabled={isSubmitting}
                />
                {errors.author && (
                  <p
                    id="author-error"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors.author}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value ?? "");
                    clearError("category");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="category"
                    className="h-10 w-full"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CATEGORIES.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p
                    id="category-error"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/cover.jpg"
                className="h-10"
                value={image}
                onChange={(event) => {
                  setImage(event.target.value);
                  clearError("image");
                }}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? "image-error" : "image-hint"}
                disabled={isSubmitting}
              />
              {errors.image ? (
                <p
                  id="image-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.image}
                </p>
              ) : (
                <p id="image-hint" className="text-xs text-muted-foreground">
                  Use a direct link to the cover image.
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:max-w-48">
              <Label htmlFor="total-copies">Total Copies</Label>
              <Input
                id="total-copies"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="1"
                className="h-10"
                value={totalCopies}
                onChange={(event) => {
                  setTotalCopies(event.target.value);
                  clearError("totalCopies");
                }}
                aria-invalid={Boolean(errors.totalCopies)}
                aria-describedby={
                  errors.totalCopies ? "total-copies-error" : "total-copies-hint"
                }
                disabled={isSubmitting}
              />
              {errors.totalCopies ? (
                <p
                  id="total-copies-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.totalCopies}
                </p>
              ) : (
                <p
                  id="total-copies-hint"
                  className="text-xs text-muted-foreground"
                >
                  How many copies are on the shelves?
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this book about?"
                className="min-h-32"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearError("description");
                }}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                disabled={isSubmitting}
              />
              {errors.description && (
                <p
                  id="description-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-10 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBookForm;
