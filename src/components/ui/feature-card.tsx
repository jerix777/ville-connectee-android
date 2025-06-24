
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  className?: string;
  variant?: "default" | "outline" | "modern";
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  to,
  className,
  variant = "modern",
}: FeatureCardProps) {
  return (
    <Link to={to} className="group">
      <div 
        className={cn(
          "relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1",
          variant === "modern" && "card-modern p-6",
          variant === "default" && "bg-white shadow-md hover:shadow-lg rounded-lg p-6",
          variant === "outline" && "border-2 border-expo-gray-200 hover:border-ville-orange-500 rounded-lg p-6",
          className
        )}
      >
        {/* Effet de gradient en arrière-plan au hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-ville-orange-500/5 to-expo-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-ville-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-gradient-to-br from-ville-orange-500 to-expo-success p-4 rounded-2xl shadow-medium group-hover:shadow-strong transition-all duration-300">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-expo-DEFAULT group-hover:text-ville-orange-600 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-expo-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
