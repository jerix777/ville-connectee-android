
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: "default" | "secondary";
  };
  children?: ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-expo-DEFAULT">{title}</h1>
          {description && (
            <p className="text-expo-gray-600 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <Button 
            variant={action.variant || "default"} 
            onClick={action.onClick}
            className="shrink-0"
          >
            {action.icon && <action.icon size={16} className="mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
