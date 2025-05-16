
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchServicesCommerces } from "@/services/serviceCommerceService";
import { ServiceCommerceCard } from "./ServiceCommerceCard";
import { AddServiceCommerceForm } from "./AddServiceCommerceForm";
import { CategoryFilter } from "./CategoryFilter";
import { Button } from "@/components/ui/button";
import { Building, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="mr-2" />
              Services et commerces
            </h1>
            <p className="text-gray-500 mt-1">
              Découvrez les services et commerces de votre localité
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
          
            <div className="mt-4">
              {activeTab === "liste" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Rechercher un service ou commerce..."
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

                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-4">
                          <Skeleton className="h-40 w-full" />
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service) => (
                        <ServiceCommerceCard key={service.id} service={service} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Aucun service ou commerce trouvé.</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSelectedCategory(null);
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
                <AddServiceCommerceForm />
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
