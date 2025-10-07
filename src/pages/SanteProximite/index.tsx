import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/common/PageLayout";
import { Calculator, Stethoscope, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSanteProximiteForm from "./components/AddSanteProximiteForm";
import { MedicamentSearch } from "./components/MedicamentSearch";
import { MedicamentPanierDialog } from "./components/MedicamentPanier";
import { MedicamentImport } from "./components/MedicamentImport";
import { EtablissementCard } from "./components/EtablissementCard";
import { Medicament, MedicamentPanier, RegimeType } from "@/services/medicamentService";
import { EtablissementSante, santeService } from "@/services/santeService";

export default function SanteProximite() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"liste" | "ajouter">("liste");
  const [medicamentSearchOpen, setMedicamentSearchOpen] = useState(false);
  const [panierOpen, setPanierOpen] = useState(false);
  const [panier, setPanier] = useState<MedicamentPanier[]>([]);
  const [regime, setRegime] = useState<RegimeType>("public");

  const { data: etablissements = [], isLoading, error } = useQuery<
    EtablissementSante[]
  >({
    queryKey: ["etablissements"],
    queryFn: () => santeService.getEtablissements(),
  });

  // Filtrer les établissements selon la recherche
  const filteredEtablissements = etablissements.filter(
    (etab: EtablissementSante) => {
      const q = searchQuery.trim().toLowerCase();
      if (q === "") return true;

      return (
        etab.nom.toLowerCase().includes(q) ||
        (etab.adresse?.toLowerCase()?.includes(q) ?? false)
      );
    },
  );

  const handleAddToPanier = (medicament: Medicament) => {
    setPanier((prev) => {
      const exists = prev.find((p) => p.id === medicament.id);
      if (exists) return prev;
      return [...prev, { ...medicament, quantite: 1 }];
    });
  };

  const handleUpdateQuantite = (id: string, quantite: number) => {
    setPanier((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantite: Math.max(1, quantite) } : item
      )
    );
  };

  const handleRemoveFromPanier = (id: string) => {
    setPanier((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenPanier = () => {
    setMedicamentSearchOpen(false);
    setPanierOpen(true);
  };

  return (
    <>
      <PageLayout
        moduleId="sante"
        title="Hôpitaux et Pharmacies"
        description="Trouvez la liste des professionnels de la santé"
        icon={Stethoscope}
        iconClassName="text-blue-600"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeView}
        onTabChange={(tab: string) => setActiveView(tab as "liste" | "ajouter")}
        customTabs={[
          { value: "liste", label: "Liste" },
          { value: "ajouter", label: "Ajouter" },
        ]}
        showAddButton={activeView === "liste"}
        onAddClick={() => setActiveView("ajouter")}
        hasData={etablissements.length > 0}
        loading={isLoading}
        listContent={activeView === "liste"
          ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Button
                  onClick={() => setMedicamentSearchOpen(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Calculator size={20} />
                  Calculer mon ordonnance
                </Button>
              </div>

              <MedicamentImport />

              {error
                ? (
                  <div className="text-center py-10 text-red-500">
                    <p>Erreur lors du chargement des établissements.</p>
                  </div>
                )
                : (
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEtablissements.map((
                      etablissement: EtablissementSante,
                    ) => (
                      <EtablissementCard
                        key={etablissement.id}
                        etablissement={etablissement}
                      />
                    ))}
                  </div>
                )}
            </div>
          )
          : null}
        addContent={activeView === "ajouter" ? <AddSanteProximiteForm /> : null}
      />

      <MedicamentSearch
        open={medicamentSearchOpen}
        onOpenChange={setMedicamentSearchOpen}
        onPanierOpen={handleOpenPanier}
        panier={panier}
        onAddToPanier={handleAddToPanier}
        regime={regime}
        onRegimeChange={setRegime}
      />

      <MedicamentPanierDialog
        open={panierOpen}
        onOpenChange={setPanierOpen}
        panier={panier}
        onUpdateQuantite={handleUpdateQuantite}
        onRemoveFromPanier={handleRemoveFromPanier}
        regime={regime}
      />
    </>
  );
}
