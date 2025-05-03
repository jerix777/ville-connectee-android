
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAnnonces, Annonce } from "@/services/annonceService";
import { AnnonceCard } from "./AnnonceCard";
import { AddAnnonceForm } from "./AddAnnonceForm";
import { Toaster } from "@/components/ui/toaster";
import { Shield } from "lucide-react";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getAnnonces();
    setAnnonces(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">Communiqués officiels</h1>
        </div>
        
        {/* Form for admins (visible to all for now, can be restricted later) */}
        <AddAnnonceForm onAdded={refresh} />

        {loading && <div className="py-4">Chargement...</div>}
        {!loading && annonces.length === 0 && (
          <div className="text-gray-600 py-8 text-center">
            Aucun communiqué officiel pour le moment.
          </div>
        )}
        <div className="mt-6 space-y-6">
          {annonces.map((item) => (
            <AnnonceCard annonce={item} key={item.id} />
          ))}
        </div>
      </div>
      <Toaster />
    </MainLayout>
  );
}
