
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getImmobilier, Immobilier } from "@/services/immobilierService";
import { ImmobilierCard } from "./ImmobilierCard";
import { AddImmobilierForm } from "./AddImmobilierForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Plus, Search, Bell } from "lucide-react";
import { AlertSubscription } from "./components/AlertSubscription";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <Building className="mr-2" />
              Espace Immobilier
            </h1>
            <p className="text-gray-500 mt-1">
              Trouvez votre nouveau logement ou publiez vos annonces immobilières
            </p>
          </div>
          
          <Tabs 
            value={activeViewTab} 
            onValueChange={setActiveViewTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeViewTab === "liste" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un bien immobilier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <AlertSubscription />
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveViewTab("ajouter");
                  }}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
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
                  {filteredImmobilier.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucune annonce immobilière trouvée.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedBiens.map((bien) => (
                          <ImmobilierCard key={bien.id} bien={bien} />
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
                </TabsContent>
                
                <TabsContent value="ventes">
                  {ventes.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucune annonce de vente trouvée.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedBiens.map((bien) => (
                          <ImmobilierCard key={bien.id} bien={bien} />
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
                </TabsContent>
                
                <TabsContent value="locations">
                  {locations.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucune annonce de location trouvée.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedBiens.map((bien) => (
                          <ImmobilierCard key={bien.id} bien={bien} />
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
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
        
        {activeViewTab === "ajouter" && (
          <AddImmobilierForm />
        )}
      </div>
    </MainLayout>
  );
}
