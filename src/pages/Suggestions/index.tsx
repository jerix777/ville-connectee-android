
import { useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { SuggestionCard } from "./SuggestionCard";
import { AddSuggestionForm } from "./AddSuggestionForm";
import { fetchSuggestions } from "@/services/suggestionService";
import { MicVocal } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";

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
    <PageLayout
      moduleId="suggestions"
      title="Suggestions"
      description="Faites-nous vos suggestions pour améliorer la vie à Ouellé.
                   Nous les prendrons en compte"
      icon={MicVocal}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={
        <div className="space-y-6">
          {paginatedSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      }
      addContent={<AddSuggestionForm onSuccess={() => { setActiveTab("liste"); refetch(); }} />}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher une suggestion par titre, contenu, auteur..."
      loading={isLoading}
      hasData={filteredSuggestions.length > 0}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      skeletonType="list"
      skeletonCount={3}
    />
  );
}
