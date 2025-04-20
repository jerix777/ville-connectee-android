
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

// Types for marketplace items
interface MarketItem {
  id: string;
  title: string;
  seller: string;
  description: string;
  price: number;
  contact1: string;
  contact2?: string;
  isForSale: boolean; // true for selling, false for buying
}

// Sample market items
const sampleMarketItems: MarketItem[] = [
  {
    id: "1",
    title: "iPhone 12 Pro",
    seller: "Jean Dupont",
    description: "iPhone 12 Pro 128Go, couleur graphite, très bon état, acheté il y a 1 an.",
    price: 500,
    contact1: "0123456789",
    isForSale: true
  },
  {
    id: "2",
    title: "Vélo de montagne",
    seller: "Marie Martin",
    description: "Vélo de montagne marque Rockrider, modèle ST100, taille M, état neuf.",
    price: 200,
    contact1: "0123456789",
    contact2: "0987654321",
    isForSale: true
  },
  {
    id: "3",
    title: "Recherche guitare acoustique",
    seller: "Pierre Dubois",
    description: "Je recherche une guitare acoustique d'occasion en bon état, idéalement une Yamaha ou Martin.",
    price: 150,
    contact1: "0123456789",
    isForSale: false
  },
  {
    id: "4",
    title: "Recherche machine à laver",
    seller: "Sophie Leroy",
    description: "Je recherche une machine à laver en bon état de fonctionnement, capacité min 7kg.",
    price: 200,
    contact1: "0123456789",
    isForSale: false
  }
];

// Market Item Card component
function MarketItemCard({ item }: { item: MarketItem }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.title}</CardTitle>
            <p className="text-sm text-gray-500">{item.seller}</p>
          </div>
          <div className={`${item.isForSale ? "bg-ville-light text-ville-DEFAULT" : "bg-blue-100 text-blue-600"} px-3 py-1 rounded-full text-sm font-medium`}>
            {item.isForSale ? `${item.price} €` : `Budget: ${item.price} €`}
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
function SellForm() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    price: "",
    contact1: "",
    contact2: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Annonce de vente publiée:", formData);
    // Ici, vous ajouteriez normalement l'annonce à votre état ou base de données
    // puis vous fermeriez la dialogue
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom et prénom</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Objet à vendre</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
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
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
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
        <Button type="submit" className="bg-ville-DEFAULT hover:bg-ville-dark">
          Publier la vente
        </Button>
      </DialogFooter>
    </form>
  );
}

// BuyForm component
function BuyForm() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    price: "",
    contact1: "",
    contact2: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demande d'achat publiée:", formData);
    // Ici, vous ajouteriez normalement la demande à votre état ou base de données
    // puis vous fermeriez la dialogue
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom et prénom</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Objet recherché</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
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
          <Label htmlFor="price">Prix d'achat maximum (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
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
        <Button type="submit" className="bg-ville-DEFAULT hover:bg-ville-dark">
          Publier la demande
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function MarchePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter market items based on search
  const filteredItems = sampleMarketItems.filter(item => 
    searchQuery === "" || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const forSaleItems = filteredItems.filter(item => item.isForSale);
  const wantedItems = filteredItems.filter(item => !item.isForSale);
  
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
        <Dialog>
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
            <SellForm />
          </DialogContent>
        </Dialog>
        
        <Dialog>
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
            <BuyForm />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Market items */}
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
      
      <div className="text-center mt-8">
        <Link to="/marche">
          <Button variant="ghost" className="text-ville-DEFAULT hover:text-ville-dark flex items-center">
            <span>Voir le marché complet</span>
            <ArrowRightCircle size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
