
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMetiers, getProfessionals, Metier, Professional } from "@/services/professionalService";
import { WorkerCard } from "./MainDoeuvre/WorkerCard";
import { AddWorkerForm } from "./MainDoeuvre/AddWorkerForm";
import { usePagination } from "@/hooks/usePagination";
import { PageLayout } from "@/components/common/PageLayout";

export default function MainDoeuvrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [activeTab, setActiveTab] = useState("liste");

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

  // Pagination for filtered results
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedWorkers,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredWorkers,
    itemsPerPage: 6,
  });

  return (
    <PageLayout
      title="Les Professionnels"
      description="Trouvez des professionnels qualifiés dans votre zone"
      icon={User}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un professionnel..."
      addContent={<AddWorkerForm />}
      loading={isLoading}
      hasData={filteredWorkers.length > 0}
      emptyStateIcon={User}
      emptyStateTitle="Aucun professionnel trouvé"
      emptyStateDescription="Essayez de modifier vos filtres ou inscrivez-vous"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      resultCount={filteredWorkers.length}
      listContent={
        <div className="space-y-6">
          <div className="flex gap-4 mb-6">
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
          </div>
          
          {domainFilter && domainFilter !== "all" ? (
            <div className="space-y-4">
              {paginatedWorkers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div>
              {Object.entries(workersByDomain).map(([domainId, { metier, workers }]) => (
                <div key={domainId} className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 text-ville-dark">{metier.nom}</h2>
                  <div className="space-y-4">
                    {workers.map(worker => (
                      <WorkerCard key={worker.id} worker={worker} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
}
