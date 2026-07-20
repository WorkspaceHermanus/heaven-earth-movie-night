import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main
      id="main"
      className="aurora flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <BrandMark className="h-11 w-11" />
      <h1 className="mt-8 font-display text-5xl font-light text-foreground">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        The link may have expired, or the booking reference may be incorrect.
      </p>
      <Button asChild size="lg" className="mt-9">
        <Link href="/">Back to the event</Link>
      </Button>
    </main>
  );
}
