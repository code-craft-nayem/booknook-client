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

const INITIAL_VALUES = {
  title: "",
  author: "",
  category: "",
  image: "",
  totalCopies: "",
  description: "",
};

type FormValues = typeof INITIAL_VALUES;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

const getPreviewSrc = (value: string) => {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : "";
  } catch {
    return "";
  }
};

const FieldMessage = ({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) => {
  if (error) {
    return (
      <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {hint}
      </p>
    );
  }
  return null;
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
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewSrc = getPreviewSrc(values.image);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const redirectToLogin = () => {
    toast.error("Your session expired. Please log in again.");
    router.push(`/login?callbackUrl=${encodeURIComponent("/add-book")}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = {
      title: values.title.trim(),
      author: values.author.trim(),
      image: values.image.trim(),
      description: values.description.trim(),
    };
    const copies = Number(values.totalCopies);
    const nextErrors: FieldErrors = {};

    if (!trimmed.title) nextErrors.title = "Book title is required.";
    if (!trimmed.author) nextErrors.author = "Author is required.";
    if (!BOOK_CATEGORIES.includes(values.category)) {
      nextErrors.category = "Please select a category.";
    }
    if (!trimmed.image) {
      nextErrors.image = "Cover image URL is required.";
    } else if (!getPreviewSrc(trimmed.image)) {
      nextErrors.image =
        "Enter a valid image URL starting with http:// or https://.";
    }
    if (!values.totalCopies.trim()) {
      nextErrors.totalCopies = "Total copies is required.";
    } else if (!Number.isInteger(copies) || copies < 1) {
      nextErrors.totalCopies = "Enter a whole number of at least 1.";
    }
    if (!trimmed.description) nextErrors.description = "Description is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const token = await getTokenFromClient();
      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...trimmed,
          category: values.category,
          totalCopies: copies,
        }),
      });

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        msg?: unknown;
        _id?: unknown;
      } | null;

      if (!response.ok) {
        toast.error(
          typeof data?.msg === "string"
            ? data.msg
            : "We couldn't add this book. Please try again."
        );
        return;
      }

      toast.success("Book added to the shelves.");
      router.push(typeof data?._id === "string" ? `/books/${data._id}` : "/books");
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
              alt={`Cover preview of ${values.title.trim() || "your book"}`}
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
                value={values.title}
                onChange={(e) => updateField("title", e.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                disabled={isSubmitting}
              />
              <FieldMessage id="title" error={errors.title} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Ayesha Rahman"
                  className="h-10"
                  value={values.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  aria-invalid={Boolean(errors.author)}
                  aria-describedby={errors.author ? "author-error" : undefined}
                  disabled={isSubmitting}
                />
                <FieldMessage id="author" error={errors.author} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => updateField("category", value ?? "")}
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
                <FieldMessage id="category" error={errors.category} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/cover.jpg"
                className="h-10"
                value={values.image}
                onChange={(e) => updateField("image", e.target.value)}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? "image-error" : "image-hint"}
                disabled={isSubmitting}
              />
              <FieldMessage
                id="image"
                error={errors.image}
                hint="Use a direct link to the cover image."
              />
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
                value={values.totalCopies}
                onChange={(e) => updateField("totalCopies", e.target.value)}
                aria-invalid={Boolean(errors.totalCopies)}
                aria-describedby={
                  errors.totalCopies ? "total-copies-error" : "total-copies-hint"
                }
                disabled={isSubmitting}
              />
              <FieldMessage
                id="total-copies"
                error={errors.totalCopies}
                hint="How many copies are on the shelves?"
              />
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this book about?"
                className="min-h-32"
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                disabled={isSubmitting}
              />
              <FieldMessage id="description" error={errors.description} />
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
