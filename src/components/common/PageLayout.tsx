import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "./PageHeader";
import { ListViewTabs } from "./ListViewTabs";
import { SearchBar } from "./SearchBar";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ContentWrapper } from "./ContentWrapper";
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  // Header props
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  
  // Tab management
  activeTab: string;
  onTabChange: (tab: string) => void;
  
  // Content rendering
  listContent?: React.ReactNode;
  addContent?: React.ReactNode;
  
  // Search functionality
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addButtonText?: string;
  
  // Loading and empty states
  loading?: boolean;
  hasData?: boolean;
  emptyStateIcon?: LucideIcon;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onAddFirst?: () => void;
  addFirstText?: string;
  
  // Pagination
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

export function PageLayout({
  title,
  description,
  icon,
  iconClassName,
  activeTab,
  onTabChange,
  listContent,
  addContent,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  onAddClick,
  addButtonText = "Ajouter",
  loading = false,
  hasData = false,
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
}: PageLayoutProps) {
  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      onTabChange("ajouter");
    }
  };

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
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <PageHeader
            title={title}
            description={description}
            icon={icon}
            iconClassName={iconClassName}
          />
          
          <ListViewTabs
            value={activeTab}
            onValueChange={onTabChange}
          />
        </div>

        {activeTab === "liste" && (
          <div className="space-y-6">
            {onSearchChange && (
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                onAddClick={handleAddClick}
                addButtonText={addButtonText}
              />
            )}
            
            {renderListView()}
          </div>
        )}
        
        {activeTab === "ajouter" && addContent}
      </div>
    </MainLayout>
  );
}