
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
import { SuggestionCard } from "./SuggestionCard";
import { AddSuggestionForm } from "./AddSuggestionForm";
import { fetchSuggestions } from "@/services/suggestionService";
import { Lightbulb, Plus, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SuggestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: suggestions, isLoading, refetch } = useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions,
  });

  const filteredSuggestions = (suggestions || []).filter((suggestion) => {
    const matchesSearch = !searchQuery || 
      suggestion.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (suggestion.quartiers?.nom &&
        suggestion.quartiers.nom.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedSuggestions,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredSuggestions,
    itemsPerPage: 5,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Lightbulb className="mr-2" />
              Suggestions
            </h1>
            <p className="text-gray-500 mt-1">
              Proposez vos idées pour améliorer la communauté
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
                  placeholder="Rechercher une suggestion par titre, contenu, auteur..."
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
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20 ml-auto" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="text-center py-10">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "Aucune suggestion trouvée avec ces critères." : "Aucune suggestion soumise pour le moment."}
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
                    Faire la première suggestion
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredSuggestions.length} suggestion{filteredSuggestions.length > 1 ? 's' : ''} trouvée{filteredSuggestions.length > 1 ? 's' : ''}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                </div>
                <div className="space-y-6">
                  {paginatedSuggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
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
              <h2 className="text-2xl font-semibold mb-2">Nouvelle suggestion</h2>
              <p className="text-gray-600">
                Proposez vos idées pour améliorer la communauté. Les suggestions sont examinées par l'équipe municipale.
              </p>
            </div>
            <AddSuggestionForm onSuccess={() => {
              setActiveTab("liste");
              refetch();
            }} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
