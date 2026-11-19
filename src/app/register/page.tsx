import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your BookNook account.",
};

export default function RegisterPage() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <Suspense
        fallback={<Skeleton className="h-[39rem] w-full max-w-md rounded-xl" />}
      >
        <RegisterForm />
      </Suspense>
    </section>
  );
}
