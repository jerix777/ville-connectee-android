import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "./PageHeader";
import { ListViewTabs } from "./ListViewTabs";
import { SearchBar } from "./SearchBar";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ContentWrapper } from "./ContentWrapper";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';

interface PageLayoutProps {
  // Header props
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  
  // Tab management
  activeTab: string;
  onTabChange: (tab: string) => void;
  customTabs?: { value: string; label: string }[];
  
  // Content rendering
  listContent?: React.ReactNode;
  addContent?: React.ReactNode;
  
  // Search functionality
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addButtonText?: string;
  showSearchOnAllTabs?: boolean;
  
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
  customTabs,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  onAddClick,
  addButtonText = "Ajouter",
  showSearchOnAllTabs = false,
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
  const [showOptions, setShowOptions] = useState(true);

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      onTabChange("ajouter");
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
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
      <div className="h-screen flex flex-col">
        {/* Fixed header section */}
        <div className="bg-background border-b border-border flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            {/* Title section */}
            <div className={`transition-all duration-300 ${showOptions ? 'py-4' : 'py-2 md:py-2 pb-0'}`}>
              <PageHeader
                title={title}
                description={description}
                icon={icon}
                iconClassName={iconClassName}
              />
            </div>

            {/* Toggle bar */}
            <div 
              onClick={toggleOptions}
              className="flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-md -mx-2"
            >
              <span className="text-sm text-muted-foreground">
                {showOptions ? "Masquer les options" : "Afficher les options"}
              </span>
              {showOptions ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* Options section */}
            {(activeTab === "liste" || showSearchOnAllTabs) && (
              <div 
                id="page-options"
                className={`transition-all duration-300 overflow-hidden ${
                  showOptions 
                    ? 'max-h-96 opacity-100 pb-4' 
                    : 'max-h-0 opacity-0 pb-0'
                }`}
              >
                {onSearchChange && (
                  <div id="page-search-bar">
                    <SearchBar
                      value={searchQuery}
                      onChange={onSearchChange}
                      placeholder={searchPlaceholder}
                      onAddClick={handleAddClick}
                      addButtonText={addButtonText}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {activeTab === "liste" && renderListView()}
            
            {activeTab === "ajouter" && (
              <AuthGuard>
                {addContent}
              </AuthGuard>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}