
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, User, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMetiers, getProfessionals, Metier, Professional } from "@/services/professionalService";
import { WorkerCard } from "./MainDoeuvre/WorkerCard";
import { AddWorkerForm } from "./MainDoeuvre/AddWorkerForm";

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
    const matchesDomain = domainFilter === "" || domainFilter === "all" || worker.metier_id === domainFilter;
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
            <SelectItem value="all">Tous les domaines</SelectItem>
            {metiers.map(metier => (
              <SelectItem key={metier.id} value={metier.id}>{metier.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
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
      ) : domainFilter && domainFilter !== "all" ? (
        // Show filtered results for a specific domain
        <div>
          {filteredWorkers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        // Group by domain when no specific domain is selected or "all"
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
