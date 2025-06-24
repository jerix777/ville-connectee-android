
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-expo-gray-100 mb-4">
        <Icon size={32} className="text-expo-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-expo-DEFAULT mb-2">{title}</h3>
      <p className="text-expo-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
