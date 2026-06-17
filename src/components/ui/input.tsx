import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  labelClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, labelClassName, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className={cn("form-label", labelClassName)}>
            {label.endsWith(" *") ? (
              <>
                {label.substring(0, label.length - 2)}
                <span className="text-destructive ml-1">*</span>
              </>
            ) : label.endsWith("*") ? (
              <>
                {label.substring(0, label.length - 1)}
                <span className="text-destructive ml-1">*</span>
              </>
            ) : (
              label
            )}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex w-full h-[44px] rounded-[12px] border border-input bg-card px-[14px] text-[15px] font-[500] text-[#0F172A] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-destructive mt-1">{error}</span>}
        {helperText && <span className="text-xs text-muted-foreground mt-1">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
