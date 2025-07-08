
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag, ShoppingCart, Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <ShoppingBag className="mr-2" />
              Marché
            </h1>
            <p className="text-gray-500 mt-1">
              Achetez, vendez et échangez des biens avec d'autres membres de la communauté
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher un objet..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Je vends
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Publier une annonce de vente</DialogTitle>
                  <DialogDescription>
                    Remplissez les détails pour mettre en vente votre article
                  </DialogDescription>
                </DialogHeader>
                <SellForm onClose={() => setSellDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  J'achète
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Publier une demande d'achat</DialogTitle>
                  <DialogDescription>
                    Décrivez l'article que vous recherchez
                  </DialogDescription>
                </DialogHeader>
                <BuyForm onClose={() => setBuyDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
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
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>Une erreur est survenue lors du chargement des annonces</p>
          </div>
        ) : (
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
        )}
      </div>
    </MainLayout>
  );
}
