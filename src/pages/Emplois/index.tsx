import React, { useEffect, useState } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { AddOffreForm } from "./AddOffreForm";
import { getOffresEmploi, OffreEmploi } from "@/services/offresEmploiService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Briefcase } from "lucide-react";

export default function EmploisPage() {
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getOffresEmploi();
    setOffres(data);
    setLoading(false);
  };

  const renderListContent = () => {
    if (loading) {
      return <div>Chargement...</div>;
    }
    
    if (offres.length === 0) {
      return <div className="text-gray-600">Aucune offre pour le moment.</div>;
    }
    
    return (
      <div>
        {offres.map((offre) => (
          <Card key={offre.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex flex-col md:flex-row md:justify-between items-baseline">
                <span>{offre.titre}</span>
                <span className="ml-2 px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs uppercase">{offre.type_contrat}</span>
              </CardTitle>
              <div className="text-sm text-gray-400 italic">
                {offre.employeur} — {offre.localisation}
                {offre.publie_le && (
                  <span className="ml-2 text-xs">{format(new Date(offre.publie_le), "PPP", { locale: fr })}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-gray-800">{offre.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAddContent = () => (
    <AddOffreForm onAdded={refresh} />
  );

  return (
    <PageLayout
      title="Offres d'emploi"
      description="Consultez les offres d'emploi locales et publiez vos annonces"
      icon={Briefcase}
      activeTab="liste"
      onTabChange={() => {}}
      listContent={renderListContent()}
      addContent={renderAddContent()}
      loading={loading}
      hasData={offres.length > 0}
    />
  );
}