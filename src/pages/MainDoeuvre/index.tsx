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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Build dynamic tabs (Tous + metiers)
  const customTabs = [
    { value: "tous", label: `Tous (${filteredWorkers.length})` },
    ...metiers.map((m) => ({
      value: m.id,
      label: `${m.nom} (${
        filteredWorkers.filter((w) => w.metier_id === m.id).length
      })`,
    })),
  ];

  const handleOpenAdd = () => setActiveViewTab("ajouter");

  return (
    <PageLayout
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
      customTabs={customTabs}
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  {customTabs.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {customTabs.map((t) => (
                  <TabsContent key={t.value} value={t.value}>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {paginatedWorkers.map((worker) => (
                        <WorkerCard key={worker.id} worker={worker} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
        </div>
      }
    />
  );
}
