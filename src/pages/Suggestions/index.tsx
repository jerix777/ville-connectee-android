
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
import { useQuery } from "@tanstack/react-query";
import { SuggestionCard } from "./SuggestionCard";
import { AddSuggestionForm } from "./AddSuggestionForm";
import { fetchSuggestions } from "@/services/suggestionService";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, Plus, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function SuggestionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: suggestions, isLoading, refetch } = useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions,
  });

  const filteredSuggestions = suggestions?.filter(
    (suggestion) =>
      suggestion.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (suggestion.quartiers?.nom &&
        suggestion.quartiers.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 mr-2 text-ville-DEFAULT" />
            <h1 className="text-3xl font-bold text-gray-800">Suggestions</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Faire une suggestion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouvelle suggestion</DialogTitle>
                <DialogDescription>
                  Proposez vos idées pour améliorer la communauté. Les suggestions sont examinées par l'équipe municipale.
                </DialogDescription>
              </DialogHeader>
              <AddSuggestionForm onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une suggestion..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="xl" />
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Aucune suggestion trouvée. Soyez le premier à proposer une idée !
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-6">
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
    </MainLayout>
  );
}
