"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="font-display text-4xl font-light text-foreground">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        Please try again. If the problem continues, get in touch and we&rsquo;ll
        sort your booking out personally.
      </p>
      <Button onClick={reset} size="lg" className="mt-9">
        Try again
      </Button>
    </main>
  );
}
