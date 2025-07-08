import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  hasSearchQuery?: boolean;
  onResetSearch?: () => void;
  onAddFirst?: () => void;
  addFirstText?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description,
  hasSearchQuery,
  onResetSearch,
  onAddFirst,
  addFirstText 
}: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      {Icon && <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />}
      <p className="text-muted-foreground mb-4">{title}</p>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      
      {hasSearchQuery && onResetSearch ? (
        <Button variant="link" onClick={onResetSearch}>
          Réinitialiser les filtres
        </Button>
      ) : onAddFirst ? (
        <Button variant="outline" onClick={onAddFirst}>
          {addFirstText || "Ajouter le premier élément"}
        </Button>
      ) : null}
    </div>
  );
}