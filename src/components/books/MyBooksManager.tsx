"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BOOK_CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export type MyBook = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  userName?: string;
  userEmail?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt?: string;
};

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

const getCreatedAtTime = (book: MyBook) => {
  const time = book.createdAt ? new Date(book.createdAt).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
};

export const MyBooksManagerSkeleton = () => {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <Card>
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-2 border-b last:border-b-0"
            >
              <Skeleton className="aspect-[3/4] w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

type EditBookDialogProps = {
  book: MyBook;
  isOpen: boolean;
  onClose: () => void;
  onBookUpdated: (updatedBook: MyBook) => void;
};

const EditBookDialog = ({
  book,
  isOpen,
  onClose,
  onBookUpdated,
}: EditBookDialogProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(book.title ?? "");
  const [author, setAuthor] = useState(book.author ?? "");
  const [category, setCategory] = useState(book.category ?? "");
  const [image, setImage] = useState(book.image ?? "");
  const [totalCopies, setTotalCopies] = useState(
    book.totalCopies !== undefined ? String(book.totalCopies) : "1"
  );
  const [description, setDescription] = useState(book.description ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewSrc = getPreviewSrc(image);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

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
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-books")}`);
        return;
      }

      const response = await fetch(`${API_URL}/books/${book._id}`, {
        method: "PATCH",
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
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-books")}`);
        return;
      }

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data === "object" &&
            data !== null &&
            typeof (data as { msg?: unknown }).msg === "string"
            ? (data as { msg: string }).msg
            : "Failed to update book. Please try again.";

        toast.error(message);
        return;
      }

      toast.success("Book updated successfully.");
      onBookUpdated(data as MyBook);
      onClose();
    } catch {
      toast.error("We couldn't connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update details for this book on the BookNook shelves.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Book Title</Label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
              aria-invalid={Boolean(errors.title)}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p role="alert" className="text-xs text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  clearError("author");
                }}
                aria-invalid={Boolean(errors.author)}
                disabled={isSubmitting}
              />
              {errors.author && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.author}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={category}
                onValueChange={(val) => {
                  setCategory(val ?? "");
                  clearError("category");
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="edit-category"
                  className="w-full h-8"
                  aria-invalid={Boolean(errors.category)}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-image">Cover Image URL</Label>
            <div className="flex gap-3 items-start">
              <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt={`Preview of ${title.trim() || "book cover"}`}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="size-5 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <Input
                  id="edit-image"
                  type="url"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    clearError("image");
                  }}
                  placeholder="https://example.com/cover.jpg"
                  aria-invalid={Boolean(errors.image)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Keep the existing cover URL or enter a new direct image link.
                </p>
              </div>
            </div>
            {errors.image && (
              <p role="alert" className="text-xs text-destructive">
                {errors.image}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:max-w-48">
            <Label htmlFor="edit-total-copies">Total Copies</Label>
            <Input
              id="edit-total-copies"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={totalCopies}
              onChange={(e) => {
                setTotalCopies(e.target.value);
                clearError("totalCopies");
              }}
              aria-invalid={Boolean(errors.totalCopies)}
              disabled={isSubmitting}
            />
            {errors.totalCopies ? (
              <p role="alert" className="text-xs text-destructive">
                {errors.totalCopies}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Must be at least the number of currently borrowed copies.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              aria-invalid={Boolean(errors.description)}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p role="alert" className="text-xs text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MyBooksManager = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<MyBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<MyBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userEmail = session?.user?.email;

  useEffect(() => {
    let isCancelled = false;

    if (isSessionLoading) {
      return;
    }

    if (!userEmail) {
      return;
    }

    const loadBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!isCancelled) {
            toast.error("Failed to fetch books from the shelves.");
          }
          return;
        }

        const data: unknown = await response.json();
        if (isCancelled) return;

        if (Array.isArray(data)) {
          const userBooks = (data as MyBook[]).filter(
            (b) => b.userEmail === userEmail
          );
          userBooks.sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a));
          setBooks(userBooks);
        }
      } catch {
        if (!isCancelled) {
          toast.error(
            "We couldn't connect to the server. Please check your connection."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      isCancelled = true;
    };
  }, [isSessionLoading, userEmail]);

  const handleDeleteConfirm = async () => {
    if (!deletingBook || isDeleting) return;

    setIsDeleting(true);

    try {
      const token = await getTokenFromClient();

      if (!token) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-books")}`);
        return;
      }

      const response = await fetch(`${API_URL}/books/${deletingBook._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push(`/login?callbackUrl=${encodeURIComponent("/my-books")}`);
        return;
      }

      const payload: unknown = await response.json().catch(() => null);
      const message =
        typeof payload === "object" &&
          payload !== null &&
          typeof (payload as { msg?: unknown }).msg === "string"
          ? (payload as { msg: string }).msg
          : null;

      if (!response.ok) {
        toast.error(
          message ||
          (response.status === 409
            ? "This book has active borrows and cannot be deleted"
            : "Failed to delete book.")
        );
        setDeletingBook(null);
        return;
      }

      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      toast.success(message || "Book deleted successfully");
      setDeletingBook(null);
    } catch {
      toast.error("We couldn't reach the server. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookUpdated = (updated: MyBook) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updated._id ? { ...b, ...updated } : b))
    );
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-center">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your books...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Authentication required</CardTitle>
          <CardDescription>
            You must be signed in to manage your books.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login?callbackUrl=/my-books"
            className={buttonVariants({ size: "default" })}
          >
            Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (books.length === 0) {
    return (
      <Card className="mt-8 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-7" />
          </div>
          <h3 className="font-heading mt-4 text-xl font-semibold">
            No books added yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t added any books to the BookNook shelves yet. Share
            your first book with other readers!
          </p>
          <div className="mt-6">
            <Link
              href="/add-book"
              className={buttonVariants({ size: "default" })}
            >
              <Plus className="size-4" />
              Add a Book
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Your Books ({books.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage the titles you have shared on the BookNook shelves.
          </p>
        </div>
        <Link href="/add-book" className={buttonVariants({ size: "sm" })}>
          <Plus className="size-4" />
          Add Another Book
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="mt-6 hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Cover</TableHead>
              <TableHead className="min-w-[180px]">Title</TableHead>
              <TableHead className="min-w-[140px]">Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <div className="relative aspect-[3/4] w-12 overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="size-5 text-primary/50" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/books/${book._id}`}
                    className="hover:text-primary transition-colors line-clamp-2"
                  >
                    {book.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="line-clamp-1">{book.author}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{book.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="font-mono text-xs">
                      {book.availableCopies ?? book.totalCopies} / {book.totalCopies}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      available
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBook(book)}
                      className="h-8 gap-1.5"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingBook(book)}
                      className="h-8 gap-1.5"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Equal-Height Cards View */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:hidden">
        {books.map((book) => (
          <Card
            key={book._id}
            className="flex flex-col justify-between overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/15 via-accent to-secondary">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="size-6 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <Link
                    href={`/books/${book._id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 text-sm"
                  >
                    {book.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {book.availableCopies ?? book.totalCopies} / {book.totalCopies}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex border-t border-border bg-muted/30 p-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingBook(book)}
                className="flex-1 h-8 gap-1.5"
              >
                <Pencil className="size-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeletingBook(book)}
                className="flex-1 h-8 gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookDialog
          key={editingBook._id}
          book={editingBook}
          isOpen={Boolean(editingBook)}
          onClose={() => setEditingBook(null)}
          onBookUpdated={handleBookUpdated}
        />
      )}

      {/* Delete Book Confirmation Modal */}
      <AlertDialog
        open={Boolean(deletingBook)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeletingBook(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{deletingBook?.title}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setDeletingBook(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting && <LoaderCircle className="size-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete Book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBooksManager;