"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Library,
} from "lucide-react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: "Find your next chapter",
    title: "Discover Your Next Read",
    description:
      "Browse a growing shelf of fiction, science, history, and books for young readers. Your next favorite story is only a page away.",
    href: "/books",
    cta: "Explore Books",
    icon: Library,
    gradient: "from-primary/20 via-background to-accent",
  },
  {
    eyebrow: "Build the shared shelf",
    title: "Share a Book With the Shelf",
    description:
      "Add a book from your own collection and open it up to the BookNook community.",
    href: "/add-book",
    cta: "Add a Book",
    icon: BookMarked,
    gradient: "from-secondary via-background to-primary/10",
  },
  {
    eyebrow: "Stay on top of every loan",
    title: "Track Every Borrow",
    description:
      "Keep every loan in view, from the day you borrow to the day you return it.",
    href: "/my-borrows",
    cta: "View My Borrows",
    icon: BookOpen,
    gradient: "from-accent via-background to-secondary",
  },
];

const HeroSlider = () => {
  return (
    <section aria-label="BookNook highlights" className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          a11y={{ enabled: true }}
          className="overflow-hidden rounded-3xl ring-1 ring-foreground/10"
          style={
            {
              "--swiper-theme-color": "var(--primary)",
              "--swiper-navigation-size": "36px",
              "--swiper-pagination-bottom": "16px",
              "--swiper-pagination-bullet-inactive-color":
                "var(--muted-foreground)",
              "--swiper-pagination-bullet-inactive-opacity": "0.4",
            } as CSSProperties
          }
        >
          {slides.map((slide) => {
            const Icon = slide.icon;

            return (
              <SwiperSlide key={slide.title}>
                <div
                  className={cn(
                    "relative flex min-h-[420px] items-center overflow-hidden bg-gradient-to-br px-6 py-16 pb-20 sm:min-h-[480px] sm:px-10 lg:min-h-[520px] lg:px-16",
                    slide.gradient
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-3xl"
                  />

                  <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="max-w-2xl">
                      <Badge
                        variant="secondary"
                        className="bg-background/70 text-primary backdrop-blur"
                      >
                        {slide.eyebrow}
                      </Badge>
                      <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h2>
                      <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                        {slide.description}
                      </p>
                      <Link
                        href={slide.href}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "mt-8 h-11 px-5"
                        )}
                      >
                        {slide.cta}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>

                    <div className="relative hidden items-center justify-center lg:flex">
                      <div
                        aria-hidden="true"
                        className="absolute size-64 rounded-full bg-primary/10 blur-2xl"
                      />
                      <div className="relative flex size-56 items-center justify-center rounded-[2rem] border border-primary/15 bg-background/70 shadow-2xl shadow-primary/10 backdrop-blur">
                        <Icon className="size-24 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSlider;
