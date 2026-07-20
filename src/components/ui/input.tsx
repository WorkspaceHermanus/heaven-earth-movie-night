import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border border-sand-200 bg-white px-4 py-2 text-base text-foreground transition-colors",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:border-sand-500 focus-visible:ring-1 focus-visible:ring-sand-400/30",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
