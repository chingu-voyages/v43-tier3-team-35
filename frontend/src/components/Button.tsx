import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
const buttonVariants = cva(
  "transition text-bodym rounded-md duration-300 px-5 py-3",
  {
    variants: {
      variant: {
        default: "bg-blue-900 text-white hover:text-blue-900 hover:bg-white",
        secondary: "text-blue-900 bg-white hover:bg-blue-900 hover:text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
