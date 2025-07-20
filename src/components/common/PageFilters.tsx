import React from 'react';

interface PageFiltersProps {
  children?: React.ReactNode;
}

export function PageFilters({ children }: PageFiltersProps) {
  return (
    <div className="bg-background border-b border-border flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        {children || (
          <p className="text-sm text-muted-foreground">Zone réservée aux filtres spécifiques</p>
        )}
      </div>
    </div>
  );
}