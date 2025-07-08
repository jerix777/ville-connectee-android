
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { SouvenirCard } from "./SouvenirCard";
import { AddSouvenirForm } from "./AddSouvenirForm";
import { fetchSouvenirs } from "@/services/souvenirService";
import { BookmarkCheck, Plus, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SouvenirsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: souvenirs, isLoading } = useQuery({
    queryKey: ["souvenirs"],
    queryFn: fetchSouvenirs,
  });

  const filteredSouvenirs = (souvenirs || []).filter((souvenir) => {
    const matchesSearch = !searchQuery || 
      souvenir.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      souvenir.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      souvenir.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (souvenir.quartiers?.nom &&
        souvenir.quartiers.nom.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedSouvenirs,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredSouvenirs,
    itemsPerPage: 9,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BookmarkCheck className="mr-2" />
              Souvenirs
            </h1>
            <p className="text-gray-500 mt-1">
              Partagez et découvrez les moments précieux de la communauté
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
                  placeholder="Rechercher un souvenir par titre, description, auteur..."
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
            ) : filteredSouvenirs.length === 0 ? (
              <div className="text-center py-10">
                <BookmarkCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "Aucun souvenir trouvé avec ces critères." : "Aucun souvenir partagé pour le moment."}
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
                    Partager le premier souvenir
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredSouvenirs.length} souvenir{filteredSouvenirs.length > 1 ? 's' : ''} trouvé{filteredSouvenirs.length > 1 ? 's' : ''}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSouvenirs.map((souvenir) => (
                    <SouvenirCard key={souvenir.id} souvenir={souvenir} />
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
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Ajouter un souvenir</h2>
              <p className="text-gray-600">
                Partagez un souvenir avec la communauté. Les souvenirs sont des moments précieux qui contribuent à la mémoire collective.
              </p>
            </div>
            <AddSouvenirForm onSuccess={() => setActiveTab("liste")} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
