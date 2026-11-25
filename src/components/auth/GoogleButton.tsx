"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const GoogleButton = ({ callbackUrl }: { callbackUrl: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error) {
      return;
    }

    toast.error(
      error === "access_denied"
        ? "Google blocked this sign-in. Add your Google account as a test user in Google Cloud Console and try again."
        : `Google sign-in failed (${error}). Please try again.`
    );
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    const { error } = await signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
      errorCallbackURL: pathname,
    });

    if (error) {
      toast.error(
        error.message ?? "Google sign-in failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-10 w-full"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <FcGoogle className="size-4" />
      )}
      Continue with Google
    </Button>
  );
};

export default GoogleButton;
