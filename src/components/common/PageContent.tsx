import React from 'react';
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ContentWrapper } from "./ContentWrapper";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LucideIcon } from 'lucide-react';

interface PageContentProps {
  activeTab: string;
  loading?: boolean;
  hasData?: boolean;
  listContent?: React.ReactNode;
  addContent?: React.ReactNode;
  
  // Search functionality for empty state
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  
  // Empty state props
  emptyStateIcon?: LucideIcon;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onAddFirst?: () => void;
  addFirstText?: string;
  
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  resultCount?: number;
  
  // Layout options
  skeletonType?: 'list' | 'grid';
  skeletonCount?: number;
  showResultCount?: boolean;
}

export function PageContent({
  activeTab,
  loading = false,
  hasData = false,
  listContent,
  addContent,
  searchQuery = "",
  onSearchChange,
  emptyStateIcon,
  emptyStateTitle = "Aucun élément trouvé",
  emptyStateDescription,
  onAddFirst,
  addFirstText,
  currentPage,
  totalPages,
  onPageChange,
  canGoNext,
  canGoPrevious,
  resultCount,
  skeletonType = 'list',
  skeletonCount = 3,
  showResultCount = true
}: PageContentProps) {
  const renderListView = () => {
    if (loading) {
      return <LoadingSkeleton type={skeletonType} count={skeletonCount} />;
    }

    if (!hasData) {
      return (
        <EmptyState
          icon={emptyStateIcon}
          title={emptyStateTitle}
          description={emptyStateDescription}
          hasSearchQuery={!!searchQuery}
          onResetSearch={onSearchChange ? () => onSearchChange("") : undefined}
          onAddFirst={onAddFirst}
          addFirstText={addFirstText}
        />
      );
    }

    return (
      <ContentWrapper
        hasData={hasData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        resultCount={showResultCount ? resultCount : undefined}
        searchQuery={searchQuery}
      >
        {listContent}
      </ContentWrapper>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {activeTab === "liste" && renderListView()}
        
        {activeTab === "ajouter" && (
          <AuthGuard>
            {addContent}
          </AuthGuard>
        )}
      </div>
    </div>
  );
}