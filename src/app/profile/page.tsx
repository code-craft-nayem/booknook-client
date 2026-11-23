import type { Metadata } from "next";
import ProfileCard from "@/components/auth/ProfileCard";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your BookNook reader profile.",
};

export default function ProfilePage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Account details</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-3 text-muted-foreground">
          View your personal information and navigate your library activity.
        </p>
      </div>

      <div className="mt-8">
        <ProfileCard />
      </div>
    </section>
  );
}
