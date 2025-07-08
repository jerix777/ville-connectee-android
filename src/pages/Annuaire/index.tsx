
import { useQuery } from "@tanstack/react-query";
import { getMetiers, getProfessionals, Metier, Professional } from "@/services/professionalService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DirectoryCard } from "./DirectoryCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AnnuairePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });

  const { data: professionals = [], isLoading, error } = useQuery({
    queryKey: ['professionals'],
    queryFn: getProfessionals
  });

  const [search, setSearch] = useState("");

  // Filter professionals
  const filtered = professionals.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    (p.surnom && p.surnom.toLowerCase().includes(search.toLowerCase())) ||
    (p.base && p.base.toLowerCase().includes(search.toLowerCase())) ||
    (p.metier?.nom && p.metier.nom.toLowerCase().includes(search.toLowerCase()))
  );

  // Group by metier
  const professionalsByMetier: Record<string, { metier: Metier, list: Professional[] }> = {};
  metiers.forEach(metier => {
    const inMetier = filtered.filter(p => p.metier_id === metier.id);
    if (inMetier.length > 0) {
      professionalsByMetier[metier.id] = { metier, list: inMetier };
    }
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-dark-purple">Annuaire</h1>
            <p className="text-gray-600">Trouvez les professionnels, artisans et contacts utiles de la ville regroupés par domaine.</p>
          </div>
          {user && (
            <Button onClick={() => navigate('/annuaire/mon-profil')} className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Mon profil professionnel</span>
            </Button>
          )}
        </div>
      </div>
      <div className="mb-6 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10"
            placeholder="Rechercher un professionnel, un domaine, une base..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-10">Chargement de l'annuaire...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Erreur de chargement de l'annuaire</div>
      ) : Object.keys(professionalsByMetier).length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Aucun professionnel trouvé</p>
        </div>
      ) : (
        Object.entries(professionalsByMetier).map(([metierId, { metier, list }]) => (
          <div key={metierId} className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary-purple">{metier.nom}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map(professional => (
                <DirectoryCard key={professional.id} professional={professional} />
              ))}
            </div>
          </div>
        ))
      )}
    </MainLayout>
  );
}
