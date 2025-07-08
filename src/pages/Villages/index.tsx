import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getVillages, Village } from "@/services/villageService";
import { VillageCard } from "./VillageCard";
import { AddVillageForm } from "./AddVillageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Plus, Search, MapPin } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function VillagesPage() {
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: villages, isLoading, error } = useQuery({
    queryKey: ["villages"],
    queryFn: getVillages
  });

  const filteredVillages = (villages || []).filter((village) => {
    const matchesSearch = !searchQuery || 
      village.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (village.description && village.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (village.code_postal && village.code_postal.includes(searchQuery));
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedVillages,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredVillages,
    itemsPerPage: 9,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <MapPin className="mr-2" />
              Villages
            </h1>
            <p className="text-gray-500 mt-1">
              Découvrez les villages et quartiers de votre commune
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "liste" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un village par nom, description ou code postal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("ajouter");
                }}
                className="whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                <p>Erreur lors du chargement des villages.</p>
              </div>
            ) : filteredVillages.length === 0 ? (
              <div className="text-center py-10">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "Aucun village trouvé avec ces critères." : "Aucun village enregistré pour le moment."}
                </p>
                {searchQuery ? (
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("ajouter")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter le premier village
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredVillages.length} village{filteredVillages.length > 1 ? 's' : ''} trouvé{filteredVillages.length > 1 ? 's' : ''}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedVillages.map((village) => (
                    <VillageCard key={village.id} village={village} />
                  ))}
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                />
              </div>
            )}
          </div>
        )}
        
        {activeTab === "ajouter" && (
          <AddVillageForm />
        )}
      </div>
    </MainLayout>
  );
}