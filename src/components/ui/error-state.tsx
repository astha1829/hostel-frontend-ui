import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "A network error occurred while connecting to our servers. Please try again.",
  onRetry,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-xl bg-destructive/5 max-w-lg mx-auto my-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-5 text-destructive">
        <AlertTriangle size={36} />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          isLoading={isLoading}
          className="mt-6 flex items-center gap-2"
        >
          {!isLoading && <RefreshCw size={16} />}
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
