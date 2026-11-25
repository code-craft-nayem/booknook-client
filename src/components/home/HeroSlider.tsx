"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    title: "Your Neighbourhood Library, Online",
    description:
      "Discover books across fiction, science, history, and kids' shelves, and borrow what you love.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Grow the community shelf",
    title: "Add, Borrow & Return With Ease",
    description:
      "Share books from your collection, track available copies in real time, and manage every borrow smoothly.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Curated reading spaces",
    title: "Curated Books for Every Reader",
    description:
      "Explore fresh arrivals and timeless reads in one clean place built for everyday readers.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
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
          className="hero-slider overflow-hidden rounded-3xl ring-1 ring-foreground/10"

        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <div
                style={{ backgroundImage: `url(${slide.image})` }}
                className="relative flex min-h-[420px] items-center overflow-hidden bg-cover bg-center px-6 py-16 pb-20 sm:min-h-[480px] sm:px-10 lg:min-h-[520px] lg:px-16"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"
                />

                <div className="relative z-10 max-w-2xl text-white">
                  <Badge
                    variant="secondary"
                    className="bg-white/15 text-white backdrop-blur border-white/20"
                  >
                    {slide.eyebrow}
                  </Badge>
                  <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                    {slide.description}
                  </p>
                  <Link
                    href="/books"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-8 h-11 px-5"
                    )}
                  >
                    Browse Books
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSlider;