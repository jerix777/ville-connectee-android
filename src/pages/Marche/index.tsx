
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarketItems } from "@/services/marketService";
import { MarketItemCard } from "./MarketItemCard";
import { SellForm } from "./SellForm";
import { BuyForm } from "./BuyForm";

export default function MarchePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  
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
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Marché</h1>
        <p className="text-gray-600">
          Achetez, vendez et échangez des biens avec d'autres membres de la communauté
        </p>
      </div>
      
      {/* Search section */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Rechercher un objet..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ville-DEFAULT hover:bg-ville-dark flex items-center justify-center gap-2 py-6">
              <ShoppingBag size={20} />
              <span className="text-lg">Je vends</span>
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
            <Button variant="outline" className="flex items-center justify-center gap-2 py-6 border-2">
              <ShoppingCart size={20} className="text-ville-DEFAULT" />
              <span className="text-lg text-ville-DEFAULT">J'achète</span>
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
      
      {/* Market items */}
      {isLoading ? (
        <div className="text-center py-10">
          <p>Chargement des annonces...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Une erreur est survenue lors du chargement des annonces</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="forsale">À vendre</TabsTrigger>
            <TabsTrigger value="wanted">Recherchés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Aucun article trouvé</p>
              </div>
            ) : (
              <div>
                {filteredItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="forsale">
            {forSaleItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Aucun article à vendre trouvé</p>
              </div>
            ) : (
              <div>
                {forSaleItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="wanted">
            {wantedItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Aucune demande d'achat trouvée</p>
              </div>
            ) : (
              <div>
                {wantedItems.map(item => (
                  <MarketItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
}
