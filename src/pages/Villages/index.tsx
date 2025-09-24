import React from "react";
import { getVillages } from "@/services/villageService";
import { VillageCard } from "./VillageCard";
import { AddVillageForm } from "./AddVillageForm";
import { Toaster } from "@/components/ui/toaster";
import { MapPin } from "lucide-react";
import { useDataManagement } from "@/hooks/useDataManagement";
import { PageLayout } from "@/components/common/PageLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function VillagesPage() {
  const {
    filteredData: filteredVillages,
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
    fetchData: getVillages,
    searchFields: ['nom', 'description', 'code_postal'],
    itemsPerPage: 9
  });

  return (
    <>
      <PageLayout
        moduleId="villages"
        title="Villages"
        description="Découvrez les villages et quartiers de votre commune"
        icon={MapPin}
        iconClassName="text-blue-600"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un village par nom, description ou code postal..."
        loading={loading}
        hasData={hasData}
        emptyStateIcon={MapPin}
        emptyStateTitle={isFiltered ? "Aucun village trouvé avec ces critères." : "Aucun village enregistré pour le moment."}
        onAddFirst={() => setActiveTab("ajouter")}
        addFirstText="Ajouter le premier village"
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        resultCount={filteredVillages.length}
        listContent={
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pagination.paginatedData.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        }
        addContent={
          <AuthGuard>
            <AddVillageForm />
          </AuthGuard>
        }
      />
      <Toaster />
    </>
  );
}
