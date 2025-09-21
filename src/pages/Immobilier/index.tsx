
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getImmobilier, Immobilier } from "@/services/immobilierService";
import { ImmobilierCard } from "./ImmobilierCard";
import { AddImmobilierForm } from "./AddImmobilierForm";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { AlertSubscription } from "./components/AlertSubscription";
import { usePagination } from "@/hooks/usePagination";
import { PageLayout } from "@/components/common/PageLayout";

export default function ImmobilierPage() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: immobilier, isLoading, error } = useQuery({
    queryKey: ["immobilier"],
    queryFn: getImmobilier
  });

  const filteredImmobilier = (immobilier || []).filter((bien) => {
    const matchesSearch = !searchQuery || 
      bien.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bien.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bien.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bien.vendeur.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const ventes = filteredImmobilier.filter(bien => bien.is_for_sale);
  const locations = filteredImmobilier.filter(bien => !bien.is_for_sale);

  const getTabData = () => {
    switch (activeTab) {
      case "ventes": return ventes;
      case "locations": return locations;
      default: return filteredImmobilier;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedBiens,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  const customTabs = [
    { value: "tous", label: `Toutes (${filteredImmobilier.length})` },
    { value: "ventes", label: `Ventes (${ventes.length})` },
    { value: "locations", label: `Locations (${locations.length})` }
  ];

  const handleOpenAdd = () => setActiveViewTab("ajouter");

  return (
    <PageLayout
      title="Espace Immobilier" 
      description="Trouvez votre nouveau logement ou publiez vos annonces immobilières"
      icon={Building}
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un bien immobilier..."
  addContent={<AddImmobilierForm inline onClose={() => setActiveViewTab('liste')} />}
  onAddClick={handleOpenAdd}
  showAddButton={true}
      loading={isLoading}
      hasData={filteredImmobilier.length > 0}
      emptyStateIcon={Building}
      emptyStateTitle="Aucune annonce immobilière trouvée"
      emptyStateDescription="Aucune annonce ne correspond à vos critères"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      resultCount={filteredImmobilier.length}
      customTabs={customTabs}
      skeletonType="grid"
      skeletonCount={6}
      additionalOptions={<AlertSubscription />}
      listContent={
        <div className="space-y-6">
          
          {error ? (
            <div className="text-center py-10 text-red-500">
              <p>Erreur lors du chargement des annonces immobilières.</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="tous">
                  Toutes ({filteredImmobilier.length})
                </TabsTrigger>
                <TabsTrigger value="ventes">
                  Ventes ({ventes.length})
                </TabsTrigger>
                <TabsTrigger value="locations">
                  Locations ({locations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tous">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedBiens.map((bien) => (
                    <ImmobilierCard key={bien.id} bien={bien} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="ventes">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedBiens.map((bien) => (
                    <ImmobilierCard key={bien.id} bien={bien} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="locations">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedBiens.map((bien) => (
                    <ImmobilierCard key={bien.id} bien={bien} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      }
    />
  );
}
