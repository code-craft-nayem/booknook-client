import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  createdAt: string;
};

const BookCard = ({ book }: { book: Book }) => {
  return (
    <Card className="h-full gap-4 overflow-hidden pt-0 transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/15 via-accent to-secondary">
        {book.image ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-14 text-primary/50" />
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>

      <CardContent className="mt-auto">
        <Badge variant="secondary">{book.category}</Badge>
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          href={`/books/${book._id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View Details
          <ArrowRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
