
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  className?: string;
  variant?: "default" | "outline";
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  to,
  className,
  variant = "default",
}: FeatureCardProps) {
  return (
    <Link to={to}>
      <div 
        className={cn(
          "flex flex-col items-center p-6 rounded-lg transition-all duration-200 hover:scale-105",
          variant === "default" ? "bg-white shadow-md hover:shadow-lg" : "border-2 border-ville-light hover:border-ville-DEFAULT",
          className
        )}
      >
        <div className="bg-ville-light p-3 rounded-full mb-4">
          <Icon className="text-ville-DEFAULT h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 text-center">{description}</p>
        )}
      </div>
    </Link>
  );
}
