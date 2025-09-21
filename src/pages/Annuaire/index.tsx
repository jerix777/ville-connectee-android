import { useQuery } from "@tanstack/react-query";
import {
  DirectoryEntry,
  getDirectoryEntries,
} from "@/services/directoryService";
import { PageLayout } from "@/components/common/PageLayout";
import { DirectoryCard } from "./DirectoryCard";
import { useState } from "react";
import { Search } from "lucide-react";
import { AddDirectoryEntryForm } from "./components/AddDirectoryEntryForm";

export default function AnnuairePage() {
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ["directory_entries"],
    queryFn: getDirectoryEntries,
  });

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("liste");

  // Filter entries
  const filtered = entries.filter(
    (e) =>
      (e.denomination &&
        e.denomination.toLowerCase().includes(search.toLowerCase())) ||
      (e.type_service &&
        e.type_service.toLowerCase().includes(search.toLowerCase()))
  );

  // Group by type_service
  const entriesByServiceType: Record<string, DirectoryEntry[]> = {};
  filtered.forEach((entry) => {
    const serviceType = entry.type_service || "Non classé";
    if (!entriesByServiceType[serviceType]) {
      entriesByServiceType[serviceType] = [];
    }
    entriesByServiceType[serviceType].push(entry);
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">Chargement de l'annuaire...</div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500">
          Erreur de chargement de l'annuaire
        </div>
      );
    }

    if (Object.keys(entriesByServiceType).length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Aucune entrée trouvée</p>
        </div>
      );
    }

    return Object.entries(entriesByServiceType).map(([serviceType, list]) => (
      <div key={serviceType} className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-primary">
          {serviceType}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((entry) => <DirectoryCard key={entry.id} entry={entry} />)}
        </div>
      </div>
    ));
  };

  const renderAddContent = () => (
    <div className="space-y-6">
      <AddDirectoryEntryForm onCancel={() => setActiveTab("liste")} />
    </div>
  );

  return (
    <PageLayout
      title="Annuaire de la commune"
      description="Trouvez tous les contacts des différents services publics et privés de Ouellé. Exemple: Ministère des sports, Inspection d'école primaire, Cantonnement des eaux et forêts..."
      icon={Search}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderContent()}
      addContent={renderAddContent()}
      searchQuery={search}
      onSearchChange={setSearch}
      searchPlaceholder="Rechercher un service, un nom..."
      loading={isLoading}
      hasData={Object.keys(entriesByServiceType).length > 0}
    />
  );
}
