import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "info";
}

const badgeVariants = {
  default: "bg-primary/10 text-primary hover:bg-primary/20 border-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  success: "bg-success/15 text-success hover:bg-success/25 border-transparent",
  warning: "bg-warning/15 text-warning hover:bg-warning/25 border-transparent",
  danger: "bg-destructive/15 text-destructive hover:bg-destructive/25 border-transparent",
  info: "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-transparent",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border status-badge",
          badgeVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
