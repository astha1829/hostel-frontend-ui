import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
};

export const DetailFormSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Skeleton className="h-10 w-2/5 mb-2" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-5 border border-border rounded-lg flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-60" />
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="flex bg-secondary/50 p-4 border-b border-border">
          <Skeleton className="h-5 w-1/5 mr-4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn("flex p-4", i !== rows - 1 && "border-b border-border")}>
            <Skeleton className="h-5 w-[15%] mr-[9%]" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};
