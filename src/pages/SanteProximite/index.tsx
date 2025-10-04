import React, { useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { Stethoscope } from "lucide-react";
import AddSanteProximiteForm from "./AddSanteProximiteForm";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSanteProximiteFilters } from "./hooks/useSanteProximiteFilters";
import { EtablissementList } from "./components/EtablissementList";
import { useNavigate } from "react-router-dom";
import { EtablissementSante } from "@/services/santeService";

export default function SanteProximite() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    etablissements,
    loading,
    userLocation,
    setUserLocation,
    typeFilter,
    setTypeFilter,
    radiusFilter,
    setRadiusFilter,
    urgencesOnly,
    setUrgencesOnly,
    gardeOnly,
    setGardeOnly,
    refreshData
  } = useSanteProximiteFilters();

  const { getCurrentPosition } = useGeolocation({
    onLocationFound: (location) => setUserLocation(location),
  });

  const handleEtablissementClick = (etablissement: EtablissementSante) => {
    navigate(`/sante-proximite/${etablissement.id}`);
  };

  const renderSearchContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <EtablissementList
            etablissements={etablissements}
            loading={loading}
            onEtablissementClick={handleEtablissementClick}
          />

        </div>
      </div>
    );
  };

  return (
    <PageLayout
      moduleId="sante"
      title="Pharmacies, Hôpitaux et Cliniques"
      description="Trouvez la liste des professionnels de la santé à Ouellé, Daoukro, M'Bahiakro, Prikro et plus"
      icon={Stethoscope}
      iconClassName="text-blue-600"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      addContent={
        <AddSanteProximiteForm
          inline
          onCreated={() => refreshData()}
        />
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderSearchContent()}
      hasData={etablissements.length > 0}
      loading={loading}
      customTabs={[{ value: "liste", label: "Recherche" }]}
    />
  );
}
