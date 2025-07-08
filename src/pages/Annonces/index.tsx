
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAnnonces, Annonce } from "@/services/annonceService";
import { AnnonceCard } from "./AnnonceCard";
import { AddAnnonceForm } from "./AddAnnonceForm";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const refresh = async () => {
    setLoading(true);
    const data = await getAnnonces();
    setAnnonces(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredAnnonces = annonces.filter((item) => {
    const matchesSearch = !searchQuery || 
      item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAnnonces,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredAnnonces,
    itemsPerPage: 6,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-2 text-red-600" />
              Communiqués officiels
            </h1>
            <p className="text-gray-500 mt-1">
              Annonces importantes et communications officielles
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
                  placeholder="Rechercher un communiqué..."
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

            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredAnnonces.length > 0 ? (
              <div>
                <div className="space-y-6">
                  {paginatedAnnonces.map((item) => (
                    <AnnonceCard annonce={item} key={item.id} />
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
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucun communiqué trouvé.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "ajouter" && (
          <AddAnnonceForm onAdded={refresh} />
        )}
      </div>
      <Toaster />
    </MainLayout>
  );
}
