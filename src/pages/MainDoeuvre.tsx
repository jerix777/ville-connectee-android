
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Plus, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Professional, Metier, getMetiers, getProfessionals, addProfessional } from "@/services/professionalService";

// Worker Card component
function WorkerCard({ worker }: { worker: Professional }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{worker.nom}</CardTitle>
            {worker.surnom && (
              <p className="text-sm text-gray-500">"{worker.surnom}"</p>
            )}
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {worker.metier?.nom || ""}
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
function AddWorkerForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nom: "",
    surnom: "",
    metier_id: "",
    contact1: "",
    contact2: "",
    base: ""
  });
  
  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });
  
  const addWorkerMutation = useMutation({
    mutationFn: addProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast({
        title: "Professionnel ajouté",
        description: "Le professionnel a été ajouté avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du professionnel",
        variant: "destructive"
      });
      console.error("Error adding professional:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, metier_id: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkerMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metier_id">Domaine d'activité</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un domaine" />
            </SelectTrigger>
            <SelectContent>
              {metiers.map(metier => (
                <SelectItem key={metier.id} value={metier.id}>{metier.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nom">Nom et prénoms</Label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="surnom">Surnom (optionnel)</Label>
          <Input
            id="surnom"
            name="surnom"
            value={formData.surnom}
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
        <Button 
          type="submit" 
          className="bg-ville-DEFAULT hover:bg-ville-dark"
          disabled={addWorkerMutation.isPending}
        >
          {addWorkerMutation.isPending ? "Inscription en cours..." : "Je m'inscris"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function MainDoeuvrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });
  
  const { data: workers = [], isLoading, error } = useQuery({
    queryKey: ['professionals'],
    queryFn: getProfessionals
  });
  
  // Filter workers based on search and domain
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = searchQuery === "" || 
      worker.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.surnom && worker.surnom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.base.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDomain = domainFilter === "" || worker.metier_id === domainFilter;
    
    return matchesSearch && matchesDomain;
  });
  
  // Group workers by domain
  const workersByDomain = metiers.reduce((acc, metier) => {
    const workersInDomain = filteredWorkers.filter(worker => worker.metier_id === metier.id);
    if (workersInDomain.length > 0) {
      acc[metier.id] = {
        metier,
        workers: workersInDomain
      };
    }
    return acc;
  }, {} as Record<string, { metier: Metier, workers: Professional[] }>);
  
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
            {metiers.map(metier => (
              <SelectItem key={metier.id} value={metier.id}>{metier.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <AddWorkerForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Results section */}
      {isLoading ? (
        <div className="text-center py-10">
          <p>Chargement des professionnels...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Une erreur est survenue lors du chargement des professionnels</p>
        </div>
      ) : filteredWorkers.length === 0 ? (
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
        Object.entries(workersByDomain).map(([domainId, { metier, workers }]) => (
          <div key={domainId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-ville-dark">{metier.nom}</h2>
            {workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ))
      )}
    </MainLayout>
  );
}
