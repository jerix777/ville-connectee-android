import { useState } from "react";
import { BoomBox, Radio as RadioIcon } from "lucide-react";
import { PageLayout } from "@/components/common";
import { useDataManagement } from "@/hooks/useDataManagement";
import { Radio, radioService } from "@/services/radioService";
import { AddRadioForm } from "./AddRadioForm";
import { useQuery } from "@tanstack/react-query";
import { RadioList } from "./components/RadioList";
import { CategorySelector } from "./components/CategorySelector";

export default function RadioPage() {
  const [categoryId, setCategoryId] = useState<string>("all");

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };
  const {
    data: radios,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    pagination,
    hasData,
    isEmpty,
    isFiltered,
  } = useDataManagement<Radio>({
    fetchData: () =>
      radioService.getAll(categoryId === "all" ? undefined : categoryId),
    searchFields: ["nom", "description"],
    itemsPerPage: 6,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["radioCategories"],
    queryFn: radioService.getCategories,
  });

  const handleClose = () => {
    refresh();
    setActiveTab("liste");
  };

  return (
    <PageLayout
      moduleId="radio"
      title="Ecouter la radio"
      description="Désormais vous pouvez écouter les radios dont le signal n'arrive pas à Ouellé. Des radios en anglais, espagnol et allemand ont été ajoutées à la liste pour les élèves et les amoureux de ces langues. Souhaiteriez-vous qu'on vous ajoute une chaîne que vous aimez ? Veuillez nous le dire en cliquant ici"
      icon={BoomBox}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      additionalOptions={
        <CategorySelector
          categories={categories}
          value={categoryId}
          onChange={handleCategoryChange}
          isLoading={isLoadingCategories}
        />
      }
      loading={loading}
      hasData={hasData}
      listContent={<RadioList radios={pagination.paginatedData} />}
      addContent={<AddRadioForm onClose={handleClose} />}
      // Empty state
      emptyStateIcon={RadioIcon}
      emptyStateTitle={isFiltered
        ? "Aucune station trouvée"
        : "Aucune station radio disponible"}
      emptyStateDescription={isFiltered
        ? "Essayez de modifier vos critères de recherche"
        : "Seuls les administrateurs peuvent ajouter des stations radio"}
      // Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPageChange={pagination.goToPage}
      canGoNext={pagination.canGoNext}
      canGoPrevious={pagination.canGoPrevious}
      resultCount={pagination.paginatedData.length}
    />
  );
}
