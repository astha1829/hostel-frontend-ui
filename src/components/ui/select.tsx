import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs font-medium text-destructive mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
