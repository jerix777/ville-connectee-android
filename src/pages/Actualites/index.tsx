import React from "react";
import { getNews } from "@/services/newsService";
import { NewsCard } from "./NewsCard";
import { AddNewsForm } from "./AddNewsForm";
import { Toaster } from "@/components/ui/toaster";
import { Newspaper } from "lucide-react";
import { useDataManagement } from "@/hooks/useDataManagement";
import { PageLayout } from "@/components/common/PageLayout";

export default function ActualitesPage() {
  const {
    filteredData: filteredNews,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    pagination,
    hasData,
    isFiltered,
  } = useDataManagement({
    fetchData: getNews,
    searchFields: ["titre", "contenu", "auteur"],
    itemsPerPage: 6,
  });

  return (
    <>
      <PageLayout
        moduleId="actualites"
        title="Actualité"
        description="L'actualité de Ouellé et d'ailleurs"
        icon={Newspaper}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une actualité..."
        loading={loading}
        hasData={hasData}
        emptyStateIcon={Newspaper}
        emptyStateTitle={isFiltered
          ? "Aucune actualité trouvée avec ces critères."
          : "Aucune actualité disponible pour le moment."}
        onAddFirst={() => setActiveTab("ajouter")}
        addFirstText="Publier la première actualité"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        resultCount={filteredNews.length}
        listContent={
          <div className="space-y-6">
            {pagination.paginatedData.map((item) => (
              <NewsCard news={item} key={item.id} />
            ))}
          </div>
        }
        addContent={<AddNewsForm onAdded={refresh} />}
      />
      <Toaster />
    </>
  );
}
