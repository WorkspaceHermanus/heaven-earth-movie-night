import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sand-100 text-sand-800",
        outline: "border border-sand-300 text-sand-700",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-800",
        danger: "bg-rose-50 text-rose-700",
        muted: "bg-sand-100/70 text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
