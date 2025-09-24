
import { useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { SouvenirCard } from "./SouvenirCard";
import { AddSouvenirForm } from "./AddSouvenirForm";
import { fetchSouvenirs } from "@/services/souvenirService";
import { BookmarkCheck } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";

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
    <PageLayout
      moduleId="souvenirs"
      title="Souvenirs"
      description="Partagez et découvrez les moments précieux de la communauté"
      icon={BookmarkCheck}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSouvenirs.map((souvenir) => (
            <SouvenirCard key={souvenir.id} souvenir={souvenir} />
          ))}
        </div>
      }
      addContent={<AddSouvenirForm onSuccess={() => setActiveTab("liste")} />}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un souvenir par titre, description, auteur..."
      loading={isLoading}
      hasData={filteredSouvenirs.length > 0}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      skeletonType="grid"
      skeletonCount={6}
    />
  );
}
