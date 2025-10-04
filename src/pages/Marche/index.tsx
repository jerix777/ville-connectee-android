
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { PageLayout } from "@/components/common/PageLayout";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getMarketItems } from "@/services/marketService";
import { MarketItemCard } from "./MarketItemCard";
import { SellForm } from "./SellForm";
import { BuyForm } from "./BuyForm";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function MarchePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['marketItems'],
    queryFn: getMarketItems
  });
  
  // Filter market items based on search
  const filteredItems = items.filter(item => 
    searchQuery === "" || 
    item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendeur.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const forSaleItems = filteredItems.filter(item => item.is_for_sale);
  const wantedItems = filteredItems.filter(item => !item.is_for_sale);

  const getTabData = () => {
    switch (activeTab) {
      case "forsale": return forSaleItems;
      case "wanted": return wantedItems;
      default: return filteredItems;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedItems,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500">
          <p>Une erreur est survenue lors du chargement des annonces</p>
        </div>
      );
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="forsale">À vendre ({forSaleItems.length})</TabsTrigger>
          <TabsTrigger value="wanted">Recherchés ({wantedItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucun article trouvé.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                {paginatedItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
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
        
        <TabsContent value="forsale">
          {forSaleItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucun article à vendre trouvé.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                {paginatedItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
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
        
        <TabsContent value="wanted">
          {wantedItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucune demande d'achat trouvée.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                {paginatedItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
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
    );
  };

  const renderAddContent = () => (
    <div className="flex gap-2">
      <AuthDialog 
        open={sellDialogOpen} 
        onOpenChange={setSellDialogOpen}
        title="Publier une annonce de vente"
        description="Remplissez les détails pour mettre en vente votre article"
        trigger={
          <Button className="whitespace-nowrap">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Je vends
          </Button>
        }
      >
        <SellForm onClose={() => setSellDialogOpen(false)} />
      </AuthDialog>
      
      <AuthDialog 
        open={buyDialogOpen} 
        onOpenChange={setBuyDialogOpen}
        title="Publier une demande d'achat"
        description="Décrivez l'article que vous recherchez"
        trigger={
          <Button variant="outline" className="whitespace-nowrap">
            <ShoppingCart className="mr-2 h-4 w-4" />
            J'achète
          </Button>
        }
      >
        <BuyForm onClose={() => setBuyDialogOpen(false)} />
      </AuthDialog>
    </div>
  );

  return (
    <PageLayout
      moduleId="marche"
      title="Marché"
      description="Achetez, vendez et échangez des biens avec d'autres membres de la communauté"
      icon={ShoppingCart}
      activeTab="liste"
      onTabChange={() => {}}
      listContent={renderContent()}
      addContent={renderAddContent()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un objet..."
      loading={isLoading}
      hasData={filteredItems.length > 0}
    />
  );
}
