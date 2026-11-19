"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  BookOpen,
  LogOut,
  Menu,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import UserMenu from "@/components/UserMenu";

const links = [
  { href: "/", label: "Home", requiresAuth: false },
  { href: "/books", label: "All Books", requiresAuth: false },
  { href: "/add-book", label: "Add Book", requiresAuth: true },
  { href: "/my-books", label: "My Books", requiresAuth: true },
  { href: "/my-borrows", label: "My Borrows", requiresAuth: true },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;
  const visibleLinks = links.filter(
    (link) => !link.requiresAuth || Boolean(user)
  );

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
      isActive(href) &&
      "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
    );

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      toast.error("We couldn't log you out. Please try again.");
      return;
    }

    toast.success("You've been logged out.");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">BookNook</span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={navLinkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
            className="rounded-full"
          >
            <Moon className="size-4 dark:hidden" />
            <Sun className="hidden size-4 dark:block" />
          </Button>

          {isPending ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          ) : user ? (
            <div className="hidden lg:block">
              <UserMenu user={user} onSignOut={handleSignOut} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ size: "lg" })}
              >
                Register
              </Link>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full lg:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(20rem,88vw)] sm:max-w-sm"
            >
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BookOpen className="size-4" />
                  </span>
                  BookNook
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Browse BookNook and manage your account.
                </SheetDescription>
              </SheetHeader>

              <nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto px-4"
                aria-label="Mobile navigation"
              >
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={navLinkClass(link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <SheetFooter className="border-t">
                {isPending ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name || "Profile image"}
                        />
                        <AvatarFallback>
                          {user.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full justify-start"
                      )}
                    >
                      <UserIcon className="size-4" />
                      My Profile
                    </Link>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full"
                      )}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full"
                      )}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
