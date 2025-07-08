import React from 'react';
import { PaginationControls } from "@/components/ui/pagination-controls";

interface ContentWrapperProps {
  children: React.ReactNode;
  hasData: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  showPagination?: boolean;
  resultCount?: number;
  searchQuery?: string;
}

export function ContentWrapper({
  children,
  hasData,
  currentPage,
  totalPages,
  onPageChange,
  canGoNext,
  canGoPrevious,
  showPagination = true,
  resultCount,
  searchQuery
}: ContentWrapperProps) {
  if (!hasData) {
    return <>{children}</>;
  }

  return (
    <div>
      {resultCount !== undefined && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {resultCount} élément{resultCount > 1 ? 's' : ''} trouvé{resultCount > 1 ? 's' : ''}
            {searchQuery && ` pour "${searchQuery}"`}
          </p>
        </div>
      )}
      
      {children}
      
      {showPagination && currentPage && totalPages && onPageChange && canGoNext !== undefined && canGoPrevious !== undefined && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
        />
      )}
    </div>
  );
}