import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "./PageTitle";
import { PageOptions } from "./PageOptions";
import { PageFilters } from "./PageFilters";
import { PageContent } from "./PageContent";
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
  const [showOptions, setShowOptions] = useState(false);

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

  return (
    <MainLayout>
      <div className="h-screen flex flex-col">
        {/* Zone 1: Titre de la page (non scrollable) */}
        <PageTitle
          title={title}
          description={description}
          icon={icon}
          iconClassName={iconClassName}
        />

        {/* Zone 2: Options de la page (non scrollable) */}
        <PageOptions
          showOptions={showOptions}
          onToggleOptions={toggleOptions}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          onAddClick={handleAddClick}
          addButtonText={addButtonText}
          showSearchOnAllTabs={showSearchOnAllTabs}
        />


        {/* Zone 4: Données scrollables et paginées */}
        <PageContent
          activeTab={activeTab}
          loading={loading}
          hasData={hasData}
          listContent={listContent}
          addContent={addContent}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          emptyStateIcon={emptyStateIcon}
          emptyStateTitle={emptyStateTitle}
          emptyStateDescription={emptyStateDescription}
          onAddFirst={onAddFirst}
          addFirstText={addFirstText}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          resultCount={resultCount}
          skeletonType={skeletonType}
          skeletonCount={skeletonCount}
          showResultCount={showResultCount}
        />
      </div>
    </MainLayout>
  );
}