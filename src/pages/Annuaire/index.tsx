
import { useQuery } from "@tanstack/react-query";
import { getMetiers, getProfessionals, Metier, Professional } from "@/services/professionalService";
import { PageLayout } from "@/components/common/PageLayout";
import { DirectoryCard } from "./DirectoryCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LinkToProfessional } from "@/components/professional/LinkToProfessional";

export default function AnnuairePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });

  const { data: professionals = [], isLoading, error, refetch } = useQuery({
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

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-10">Chargement de l'annuaire...</div>;
    }
    
    if (error) {
      return <div className="text-center py-10 text-red-500">Erreur de chargement de l'annuaire</div>;
    }
    
    if (Object.keys(professionalsByMetier).length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Aucun professionnel trouvé</p>
        </div>
      );
    }
    
    return Object.entries(professionalsByMetier).map(([metierId, { metier, list }]) => (
      <div key={metierId} className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-primary-purple">{metier.nom}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(professional => (
            <DirectoryCard key={professional.id} professional={professional} />
          ))}
        </div>
      </div>
    ));
  };

  const renderAddContent = () => (
    <div className="space-y-6">
      {user && (
        <div className="flex flex-col sm:flex-row gap-3">
          <LinkToProfessional 
            professionals={professionals} 
            onLinked={() => refetch()} 
          />
          <Button onClick={() => navigate('/annuaire/mon-profil')} className="flex items-center justify-center space-x-2 whitespace-nowrap">
            <UserPlus className="h-4 w-4" />
            <span>Mon profil professionnel</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <PageLayout
      title="Annuaire"
      description="Trouvez les professionnels, artisans et contacts utiles de la ville regroupés par domaine."
      icon={Search}
      activeTab="liste"
      onTabChange={() => {}}
      listContent={renderContent()}
      addContent={renderAddContent()}
      searchQuery={search}
      onSearchChange={setSearch}
      searchPlaceholder="Rechercher un professionnel, un domaine, une base..."
      loading={isLoading}
      hasData={Object.keys(professionalsByMetier).length > 0}
    />
  );
}
