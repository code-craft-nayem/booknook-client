import Link from "next/link";
import { BookOpen, Heart, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin, } from "react-icons/fa6";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];



const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                BookNook
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              A quiet corner for curious readers. Discover new books, build your
              personal shelf, and keep track of every borrow seamlessly.
            </p>

            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a
                href="https://www.facebook.com/profile.php?id=61569828146199"
                target="_blank"
                rel="noreferrer noopener"
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Facebook"
              >

                <FaFacebook className="size-3.5" />
              </a>
              <a
                href="https://github.com/code-craft-nayem"
                target="_blank"
                rel="noreferrer noopener"
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted hover:text-foreground"
                aria-label="GitHub"
              >
                <FaGithub className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/code-craft-nayem/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted hover:text-foreground"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="size-4" />
              </a>
            </div>
          </div>


          <div>
            <h2 className="text-sm font-semibold text-foreground">Explore</h2>
            <ul className="mt-4 space-y-2.5">
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
            <ul className="mt-4 space-y-2.5">
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


          <div>
            <h2 className="text-sm font-semibold text-foreground">Contact Us</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Chad Uddan,Mohammadpur,Dhaka-1207</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <Link
                  href="#"
                  className="transition-colors hover:text-primary"
                >
                  support@booknook.dev
                </Link>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href="#"
                  className="transition-colors hover:text-primary"
                >
                  +880 01894525994
                </a>
              </li>
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
    </footer >
  );
};

export default Footer;