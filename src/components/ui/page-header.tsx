import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  backHref?: string;
  backText?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  title,
  description,
  backHref,
  backText = "Back",
  actions,
  ...props
}) => {
  return (
    <div className={cn("flex justify-between items-start mb-[24px] gap-6", className)} {...props}>
      <div className="flex flex-col gap-1">
        {backHref && (
          <Link href={backHref} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-2">
            <ChevronLeft size={16} />
            <span>{backText}</span>
          </Link>
        )}
        <div className={backHref ? "mt-1" : ""}>
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-subtitle">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 w-full md:w-auto">{actions}</div>}
    </div>
  );
};
