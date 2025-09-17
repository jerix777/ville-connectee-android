
import { useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchServicesCommerces } from "@/services/serviceCommerceService";
import { ServiceCommerceCard } from "./ServiceCommerceCard";
import { AddServiceCommerceForm } from "./AddServiceCommerceForm";
import { CategoryFilter } from "./CategoryFilter";
import { Building } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services_commerces"],
    queryFn: fetchServicesCommerces,
  });

  const categories = [...new Set(services.map((service) => service.categorie))];

  const filteredServices = services.filter((service) => {
    const matchesCategory = !selectedCategory || service.categorie === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedServices,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredServices,
    itemsPerPage: 9,
  });

  const renderListContent = () => (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedServices.map((service) => (
            <ServiceCommerceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun service ou commerce trouvé.</p>
        </div>
      )}
    </div>
  );

  const renderAddContent = () => (
    <AddServiceCommerceForm />
  );

  return (
    <PageLayout
      title="Commerces"
      description="Trouvez tous les commerces de la ville"
      icon={Building}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderListContent()}
      addContent={renderAddContent()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher commerce..."
      loading={isLoading}
      hasData={filteredServices.length > 0}
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
