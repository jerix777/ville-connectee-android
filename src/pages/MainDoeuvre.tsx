
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Plus, User } from "lucide-react";
import { useState } from "react";

// Types for our worker
interface Worker {
  id: string;
  name: string;
  domain: string;
  nickname?: string;
  contact1: string;
  contact2?: string;
  base: string;
}

// Sample domains
const domains = [
  "Maçonnerie",
  "Plomberie",
  "Électricité",
  "Menuiserie",
  "Peinture",
  "Jardinage",
  "Nettoyage",
  "Cuisine",
  "Transport",
  "Coiffure",
  "Couture",
  "Informatique",
  "Réparation Auto",
  "Autre"
];

// Sample workers data
const sampleWorkers: Worker[] = [
  {
    id: "1",
    name: "Jean Dupont",
    domain: "Plomberie",
    contact1: "0123456789",
    contact2: "0987654321",
    base: "Centre-ville"
  },
  {
    id: "2",
    name: "Marie Martin",
    nickname: "Marie la Menuisière",
    domain: "Menuiserie",
    contact1: "0123456789",
    base: "Quartier Nord"
  },
  {
    id: "3",
    name: "Pierre Dubois",
    domain: "Électricité",
    contact1: "0123456789",
    base: "Quartier Sud"
  },
  {
    id: "4",
    name: "Sophie Leroy",
    domain: "Peinture",
    contact1: "0123456789",
    contact2: "0987654321",
    base: "Quartier Est"
  }
];

// Worker Card component
function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{worker.name}</CardTitle>
            {worker.nickname && (
              <p className="text-sm text-gray-500">"{worker.nickname}"</p>
            )}
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {worker.domain}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-ville-DEFAULT" />
            <span>{worker.contact1}</span>
          </div>
          {worker.contact2 && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-ville-DEFAULT" />
              <span>{worker.contact2}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Search size={16} className="text-ville-DEFAULT" />
            <span>Base: {worker.base}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Contacter</Button>
      </CardFooter>
    </Card>
  );
}

// AddWorkerForm component
function AddWorkerForm() {
  const [formData, setFormData] = useState({
    domain: "",
    name: "",
    nickname: "",
    contact1: "",
    contact2: "",
    base: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, domain: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Professionnel ajouté:", formData);
    // Ici, vous ajouteriez normalement le travailleur à votre état ou base de données
    // puis vous fermeriez la dialogue
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="domain">Domaine d'activité</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent>
              {domains.map(domain => (
                <SelectItem key={domain} value={domain}>{domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nom et prénoms</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nickname">Surnom (optionnel)</Label>
          <Input
            id="nickname"
            name="nickname"
            value={formData.nickname}
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
        
        <div className="space-y-2">
          <Label htmlFor="base">Base (quartier/zone)</Label>
          <Input
            id="base"
            name="base"
            value={formData.base}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" className="bg-ville-DEFAULT hover:bg-ville-dark">
          Je m'inscris
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function MainDoeuvrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  
  // Filter workers based on search and domain
  const filteredWorkers = sampleWorkers.filter(worker => {
    const matchesSearch = searchQuery === "" || 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.nickname && worker.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.base.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDomain = domainFilter === "" || worker.domain === domainFilter;
    
    return matchesSearch && matchesDomain;
  });
  
  // Group workers by domain
  const workersByDomain = domains.reduce((acc, domain) => {
    const workersInDomain = filteredWorkers.filter(worker => worker.domain === domain);
    if (workersInDomain.length > 0) {
      acc[domain] = workersInDomain;
    }
    return acc;
  }, {} as Record<string, Worker[]>);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Main d'œuvre</h1>
        <p className="text-gray-600">
          Trouvez des professionnels qualifiés dans votre zone
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un professionnel..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tous les domaines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les domaines</SelectItem>
            {domains.map(domain => (
              <SelectItem key={domain} value={domain}>{domain}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-ville-DEFAULT hover:bg-ville-dark">
              <Plus size={16} className="mr-2" />
              Je m'inscris
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Inscription comme professionnel</DialogTitle>
              <DialogDescription>
                Inscrivez-vous comme professionnel pour proposer vos services
              </DialogDescription>
            </DialogHeader>
            <AddWorkerForm />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Results section */}
      {filteredWorkers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <User size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Aucun professionnel trouvé</p>
          <p className="text-sm">Essayez de modifier vos filtres ou inscrivez-vous</p>
        </div>
      ) : domainFilter ? (
        // Show filtered results for a specific domain
        <div>
          {filteredWorkers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        // Group by domain when no specific domain is selected
        Object.entries(workersByDomain).map(([domain, workers]) => (
          <div key={domain} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-ville-dark">{domain}</h2>
            {workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ))
      )}
    </MainLayout>
  );
}
