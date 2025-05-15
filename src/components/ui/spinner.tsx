
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full border-4 border-r-transparent border-ville-DEFAULT" />
    </div>
  );
}
