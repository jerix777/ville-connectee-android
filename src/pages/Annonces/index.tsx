
import React from "react";
import { getAnnonces } from "@/services/annonceService";
import { AnnonceCard } from "./AnnonceCard";
import { AddAnnonceForm } from "./AddAnnonceForm";
import { Toaster } from "@/components/ui/toaster";
import { Shield } from "lucide-react";
import { useDataManagement } from "@/hooks/useDataManagement";
import { PageLayout } from "@/components/common/PageLayout";

export default function AnnoncesPage() {
  const {
    filteredData: filteredAnnonces,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    pagination,
    hasData,
    isFiltered
  } = useDataManagement({
    fetchData: getAnnonces,
    searchFields: ['titre', 'contenu'],
    itemsPerPage: 6
  });

  return (
    <>
      <PageLayout
        moduleId="annonces"
        title="Avis et communiqués"
        description="Les annonces des services officiels de Ouellé, Daoukro, M'Bahiakro, Prikro et plus"
        icon={Shield}
        iconClassName="text-red-600"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un communiqué..."
        loading={loading}
        hasData={hasData}
        emptyStateIcon={Shield}
        emptyStateTitle={isFiltered ? "Aucun communiqué trouvé avec ces critères." : "Aucun communiqué disponible pour le moment."}
        onAddFirst={() => setActiveTab("ajouter")}
        addFirstText="Publier le premier communiqué"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        resultCount={filteredAnnonces.length}
        listContent={
          <div className="space-y-6">
            {pagination.paginatedData.map((item) => (
              <AnnonceCard annonce={item} key={item.id} />
            ))}
          </div>
        }
        addContent={<AddAnnonceForm onAdded={refresh} />}
      />
      <Toaster />
    </>
  );
}
