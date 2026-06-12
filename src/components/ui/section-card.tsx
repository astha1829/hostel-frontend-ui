import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  className,
  title,
  description,
  headerActions,
  children,
  ...props
}) => {
  return (
    <Card className={cn("section-card", className)} {...props}>
      <CardHeader style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid hsl(var(--border))", paddingBottom: "1rem" }}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription style={{ marginTop: "0.25rem" }}>{description}</CardDescription>}
        </div>
        {headerActions && <div className="section-header-actions">{headerActions}</div>}
      </CardHeader>
      <CardContent style={{ paddingTop: "1.5rem" }}>{children}</CardContent>
    </Card>
  );
};
