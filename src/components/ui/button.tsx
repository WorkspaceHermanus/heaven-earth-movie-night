import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sand-500 text-white hover:bg-sand-600",
        outline:
          "border border-sand-400 bg-transparent text-sand-700 hover:bg-sand-500 hover:border-sand-500 hover:text-white",
        ghost: "text-sand-700 hover:bg-sand-100",
        secondary: "bg-blush-100 text-sand-800 hover:bg-blush-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-sand-600 underline-offset-4 hover:underline normal-case tracking-normal text-sm",
      },
      size: {
        default: "h-11 px-7",
        sm: "h-9 px-5",
        lg: "h-14 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
