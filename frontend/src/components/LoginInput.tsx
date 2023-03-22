import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
const loginInputVariants = cva(
  "pb-4 pl-4 placeholder:text-opacity-50 focus:border-opacity-100 text-bodym border-b border-opacity-50 outline-none   bg-white bg-opacity-0",
  {
    variants: {
      variant: {
        default: "border-white ",
        error: "border-red-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface LoginInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof loginInputVariants> {
  errorMessage?: string;
}

export const LoginInput = forwardRef<HTMLInputElement, LoginInputProps>(
  ({ className, variant, errorMessage, ...props }, ref) => {
    return (
      <label className="relative" aria-label={props["aria-label"]}>
        <input
          className={loginInputVariants({ variant, className })}
          ref={ref}
          {...props}
        />
        {variant === "error" && (
          <span className="text-red-500 text-[0.8125rem] font-light absolute top-0 bottom-0 my-auto h-fit right-0">
            {errorMessage}
          </span>
        )}
      </label>
    );
  }
);
