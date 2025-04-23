import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRightCircle, Phone, Plus, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MarketItem, addMarketItem, getMarketItems } from "@/services/marketService";

// Market Item Card component
function MarketItemCard({ item }: { item: MarketItem }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.titre}</CardTitle>
            <p className="text-sm text-gray-500">{item.vendeur}</p>
          </div>
          <div className={`${item.is_for_sale ? "bg-ville-light text-ville-DEFAULT" : "bg-blue-100 text-blue-600"} px-3 py-1 rounded-full text-sm font-medium`}>
            {item.is_for_sale ? `${item.prix} CFA` : `Budget: ${item.prix} CFA`}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-ville-DEFAULT" />
            <span>{item.contact1}</span>
          </div>
          {item.contact2 && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-ville-DEFAULT" />
              <span>{item.contact2}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Contacter</Button>
      </CardFooter>
    </Card>
  );
}

// SellForm component
function SellForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    vendeur: "",
    titre: "",
    description: "",
    prix: "",
    contact1: "",
    contact2: "",
    is_for_sale: true
  });
  
  const addItemMutation = useMutation({
    mutationFn: (data: any) => {
      // Convert prix to a number
      return addMarketItem({
        ...data,
        prix: parseFloat(data.prix)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketItems'] });
      toast({
        title: "Annonce publiée",
        description: "Votre annonce a été publiée avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de l'annonce",
        variant: "destructive"
      });
      console.error("Error adding market item:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.vendeur || !formData.description || !formData.prix || !formData.contact1) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    addItemMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendeur">Nom et prénom</Label>
          <Input
            id="vendeur"
            name="vendeur"
            value={formData.vendeur}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="titre">Objet à vendre</Label>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Caractéristiques</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prix">Prix (CFA)</Label>
          <Input
            id="prix"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact1">Contact 1</Label>
          <Input
            id="contact1"
            name="contact1"
            value={formData.contact1}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact2">Contact 2 (optionnel)</Label>
          <Input
            id="contact2"
            name="contact2"
            value={formData.contact2}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="submit" 
          className="bg-ville-DEFAULT hover:bg-ville-dark"
          disabled={addItemMutation.isPending}
        >
          {addItemMutation.isPending ? "Publication en cours..." : "Publier la vente"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// BuyForm component
function BuyForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    vendeur: "",
    titre: "",
    description: "",
    prix: "",
    contact1: "",
    contact2: "",
    is_for_sale: false
  });
  
  const addItemMutation = useMutation({
    mutationFn: (data: any) => {
      // Convert prix to a number
      return addMarketItem({
        ...data,
        prix: parseFloat(data.prix)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketItems'] });
      toast({
        title: "Demande publiée",
        description: "Votre demande d'achat a été publiée avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de la demande",
        variant: "destructive"
      });
      console.error("Error adding market item:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.vendeur || !formData.description || !formData.prix || !formData.contact1) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    addItemMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vendeur">Nom et prénom</Label>
          <Input
            id="vendeur"
            name="vendeur"
            value={formData.vendeur}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="titre">Objet recherché</Label>
          <Input
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Caractéristiques souhaitées</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prix">Prix d'achat maximum (CFA)</Label>
          <Input
            id="prix"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact1">Contact 1</Label>
          <Input
            id="contact1"
            name="contact1"
            value={formData.contact1}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact2">Contact 2 (optionnel)</Label>
          <Input
            id="contact2"
            name="contact2"
            value={formData.contact2}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="submit" 
          className="bg-ville-DEFAULT hover:bg-ville-dark"
          disabled={addItemMutation.isPending}
        >
          {addItemMutation.isPending ? "Publication en cours..." : "Publier la demande"}
        </Button>
      </DialogFooter>
    </form>
  );
}

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
