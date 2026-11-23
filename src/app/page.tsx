import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Baby,
  BookMarked,
  BookOpen,
  Compass,
  FlaskConical,
  Landmark,
  RotateCcw,
  Search,
} from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import LatestBooks, {
  LatestBooksSkeleton,
} from "@/components/home/LatestBooks";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Fiction", icon: BookOpen },
  { name: "Science", icon: FlaskConical },
  { name: "History", icon: Landmark },
  { name: "Kids", icon: Baby },
  { name: "Others", icon: Compass },
];

const steps = [
  {
    title: "Browse the Shelves",
    description:
      "Explore the collection by category or search for the story you have been meaning to read.",
    icon: Search,
  },
  {
    title: "Borrow a Book",
    description:
      "Reserve a copy in a few clicks and keep track of every loan from your personal shelf.",
    icon: BookMarked,
  },
  {
    title: "Return and Repeat",
    description:
      "Return the book when you are done and pass it on so the next reader can enjoy it too.",
    icon: RotateCcw,
  },
];

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover new books, build your personal shelf, and keep track of every borrow at BookNook.",
};

export default function Home() {
  return (
    <>
      <HeroSlider />

      <Suspense fallback={<LatestBooksSkeleton />}>
        <LatestBooks />
      </Suspense>

      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Find your section</p>
          <h2
            id="categories-heading"
            className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Browse by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every shelf has its own character. Start with the one that fits your
            mood.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${category.name}`}
                className={cn(
                  "group flex flex-col gap-4 rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10 transition-all",
                  "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/30"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="font-heading font-medium">
                    {category.name}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="how-it-works-heading"
        className="border-t border-border/80 bg-muted/40"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Simple by design</p>
            <h2
              id="how-it-works-heading"
              className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              How BookNook Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps between you and your next great read.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card key={step.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-heading text-3xl font-semibold text-muted-foreground/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-lg">{step.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/books" className={buttonVariants({ size: "lg" })}>
              Browse the Shelves
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Join BookNook
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
