import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMetiers,
  getProfessionals,
  Metier,
  Professional,
} from "@/services/professionalService";
import { WorkerCard } from "./components/WorkerCard";
import { AddWorkerForm } from "./components/AddWorkerForm";
import { usePagination } from "@/hooks/usePagination";
import { PageLayout } from "@/components/common/PageLayout";

export default function MainDoeuvrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeViewTab, setActiveViewTab] = useState("liste");
  const [activeTab, setActiveTab] = useState<string>("tous");

  const { data: metiers = [] } = useQuery({
    queryKey: ["metiers"],
    queryFn: getMetiers,
  });

  const { data: workers = [], isLoading, error } = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });

  // Filter workers based on search
  const filteredWorkers = workers.filter((worker) => {
    const q = searchQuery.trim().toLowerCase();
    const nom = (worker.nom || "").toLowerCase();
    const surnom = (worker.surnom || "").toLowerCase();
    const base = (worker.base || "").toLowerCase();
    const metierNom = (worker.metier?.nom || "").toLowerCase();

    const matchesSearch = q === "" ||
      nom.includes(q) ||
      surnom.includes(q) ||
      base.includes(q) ||
      metierNom.includes(q);

    return matchesSearch;
  });

  // Helper to get data for current tab
  const getTabData = () => {
    if (activeTab === "tous") return filteredWorkers;
    return filteredWorkers.filter((w) => w.metier_id === activeTab);
  };

  // Pagination for current tab
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedWorkers,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });


  const handleOpenAdd = () => setActiveViewTab("ajouter");

  return (
    <PageLayout
      moduleId="main_doeuvre"
      title="Les Professionnels"
      description="Trouvez facilement les personnes ressources que vous recherchez. Exemple: plombier, électricien, pâtissière, informaticien..."
      icon={User}
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un professionnel (nom, métier, localisation)..."
      addContent={
        <AddWorkerForm
          inline
          onClose={() => setActiveViewTab("liste")}
        />
      }
      onAddClick={handleOpenAdd}
      showAddButton={true}
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
      skeletonType="grid"
      skeletonCount={6}
      listContent={
        <div className="space-y-6">
          {error
            ? (
              <div className="text-center py-10 text-red-500">
                <p>Erreur lors du chargement des professionnels.</p>
              </div>
            )
            : (
              <div>
                <div className="mb-6 max-w-sm">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par métier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">
                        Tous ({filteredWorkers.length})
                      </SelectItem>
                      {metiers.map((m: Metier) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nom} (
                          {
                            filteredWorkers.filter((w) => w.metier_id === m.id)
                              .length
                          }
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedWorkers.map((worker: Professional) => (
                    <WorkerCard key={worker.id} worker={worker} />
                  ))}
                </div>
              </div>
            )}
        </div>
      }
    />
  );
}
