
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AddOffreForm } from "./AddOffreForm";
import { getOffresEmploi, OffreEmploi } from "@/services/offresEmploiService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EmploisPage() {
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getOffresEmploi();
    setOffres(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <AddOffreForm onAdded={refresh} />
        <h1 className="text-2xl font-bold mb-6 mt-3">Offres d’emploi</h1>
        {loading && <div>Chargement...</div>}
        {!loading && offres.length === 0 && <div className="text-gray-600">Aucune offre pour le moment.</div>}
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
      </div>
    </MainLayout>
  );
}
