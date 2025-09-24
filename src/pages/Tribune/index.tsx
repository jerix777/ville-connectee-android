
import React from "react";
import { fetchTribunes } from "@/services/tribuneService";
import { TribuneCard } from "./TribuneCard";
import { AddTribuneForm } from "./AddTribuneForm";
import { Toaster } from "@/components/ui/toaster";
import { MessageSquare } from "lucide-react";
import { useDataManagement } from "@/hooks/useDataManagement";
import { PageLayout } from "@/components/common/PageLayout";

export default function TribunePage() {
  const {
    filteredData: filteredTribunes,
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
    fetchData: fetchTribunes,
    searchFields: ['titre', 'contenu', 'auteur'],
    itemsPerPage: 5
  });

  return (
    <>
      <PageLayout
        moduleId="tribune"
        title="Tribune Libre"
        description="Partagez vos opinions et débattez avec la communauté"
        icon={MessageSquare}
        iconClassName="text-purple-600"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une tribune par titre, contenu, auteur..."
        loading={loading}
        hasData={hasData}
        emptyStateIcon={MessageSquare}
        emptyStateTitle={isFiltered ? "Aucune tribune trouvée avec ces critères." : "Aucune tribune publiée pour le moment."}
        onAddFirst={() => setActiveTab("ajouter")}
        addFirstText="Publier la première tribune"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        resultCount={filteredTribunes.length}
        listContent={
          <div className="space-y-6">
            {pagination.paginatedData.map((tribune) => (
              <TribuneCard key={tribune.id} tribune={tribune} />
            ))}
          </div>
        }
        addContent={
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ajouter une tribune</h2>
              <p className="text-gray-600">
                Partagez votre opinion avec la communauté. Les tribunes doivent être approuvées avant d'être visibles par tous.
              </p>
            </div>
            <AddTribuneForm onSuccess={() => {
              refresh();
              setActiveTab("liste");
            }} />
          </div>
        }
      />
      <Toaster />
    </>
  );
}
