"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { signOut, signUp } from "@/lib/auth-client";
import GoogleButton from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = {
  name?: string;
  email?: string;
  photoUrl?: string;
  password?: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");
  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  const clearError = (field: keyof FieldErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhotoUrl = photoUrl.trim();

    if (!trimmedName) {
      nextErrors.name = "Name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (trimmedPhotoUrl) {
      try {
        const parsedUrl = new URL(trimmedPhotoUrl);

        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          nextErrors.photoUrl = "Photo URL must start with http:// or https://.";
        }
      } catch {
        nextErrors.photoUrl = "Enter a valid photo URL.";
      }
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(password)) {
      nextErrors.password =
        "Password must include at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      nextErrors.password =
        "Password must include at least one lowercase letter.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    const { error } = await signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
      image: trimmedPhotoUrl || undefined,
    });

    if (error) {
      toast.error(
        error.message ?? "We couldn't create your account. Please try again."
      );
      setIsLoading(false);
      return;
    }

    await signOut();
    toast.success("Account created. Please log in.");
    router.push(loginHref);
  };

  return (
    <Card className="w-full max-w-md shadow-lg shadow-primary/5">
      <CardHeader className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="size-6" />
        </span>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Join BookNook and start building your shelf.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <GoogleButton callbackUrl="/" />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="shrink-0 text-xs text-muted-foreground">
            or register with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className="h-10"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={isLoading}
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-10"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError("email");
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isLoading}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo-url">
              Photo URL
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="photo-url"
              type="url"
              autoComplete="photo"
              placeholder="https://example.com/photo.jpg"
              className="h-10"
              value={photoUrl}
              onChange={(event) => {
                setPhotoUrl(event.target.value);
                clearError("photoUrl");
              }}
              aria-invalid={Boolean(errors.photoUrl)}
              aria-describedby={errors.photoUrl ? "photo-url-error" : undefined}
              disabled={isLoading}
            />
            {errors.photoUrl && (
              <p
                id="photo-url-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.photoUrl}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-10"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
              disabled={isLoading}
            />
            {errors.password ? (
              <p
                id="password-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.password}
              </p>
            ) : (
              <p
                id="password-hint"
                className="text-xs text-muted-foreground"
              >
                At least 6 characters with one uppercase and one lowercase
                letter.
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full"
            disabled={isLoading}
          >
            {isLoading && <LoaderCircle className="size-4 animate-spin" />}
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
        <span>Already have an account?</span>
        <Link
          href={loginHref}
          className="font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
