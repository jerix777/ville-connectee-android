import React, { useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { Stethoscope } from "lucide-react";
import AddSanteProximiteForm from "./components/AddSanteProximiteForm";
import { useQuery } from "@tanstack/react-query";
import { santeService, type EtablissementSante } from "@/services/santeService";
import { EtablissementCard } from "./components/EtablissementCard";

export default function SanteProximite() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<'liste' | 'ajouter'>('liste');

  const { data: etablissements = [], isLoading, error } = useQuery<EtablissementSante[]>({
    queryKey: ["etablissements"],
    queryFn: () => santeService.getEtablissements(),
  });

  // Filtrer les établissements selon la recherche
  const filteredEtablissements = etablissements.filter((etab: EtablissementSante) => {
    const q = searchQuery.trim().toLowerCase();
    if (q === "") return true;
    
    return (
      etab.nom.toLowerCase().includes(q) ||
      (etab.adresse?.toLowerCase()?.includes(q) ?? false)
    );
  });

  return (
    <PageLayout
      moduleId="sante"
      title="Pharmacies, Hôpitaux et Cliniques"
      description="Trouvez la liste des professionnels de la santé"
      icon={Stethoscope}
      iconClassName="text-blue-600"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTab={activeView}
      onTabChange={(tab: string) => setActiveView(tab as 'liste' | 'ajouter')}
      customTabs={[
        { value: "liste", label: "Liste" },
        { value: "ajouter", label: "Ajouter" }
      ]}
      showAddButton={activeView === 'liste'}
      onAddClick={() => setActiveView('ajouter')}
      hasData={etablissements.length > 0}
      loading={isLoading}
      listContent={
        activeView === 'liste' ? (
          <div className="space-y-6">
            {error ? (
              <div className="text-center py-10 text-red-500">
                <p>Erreur lors du chargement des établissements.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredEtablissements.map((etablissement: EtablissementSante) => (
                  <EtablissementCard
                    key={etablissement.id}
                    etablissement={etablissement}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null
      }
      addContent={
        activeView === 'ajouter' ? <AddSanteProximiteForm /> : null
      }
    />
  );
}
