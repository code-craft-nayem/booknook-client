import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                BookNook
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A quiet corner for curious readers. Discover new books, build
              your personal shelf, and keep track of every borrow.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Explore</h2>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Account</h2>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/80 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© BookNook. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made for readers
            <Heart className="size-3.5 text-primary" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
