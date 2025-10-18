// src/pages/MaterielsGratuits/components/ListeDemandes.tsx
import { DemandeMateriel, materielsGratuitsService } from "@/services/materielsGratuitsService";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { DemandeCard } from "./DemandeCard";

interface Props {
  demandes: DemandeMateriel[];
  isLoading: boolean;
  error: any;
  isAdmin?: boolean;
}

export function ListeDemandes({ demandes, isLoading, error, isAdmin = false }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const handleStatut = async (id: number, statut: "approuvee" | "rejetee") => {
    try {
      await materielsGratuitsService.updateStatut(id, statut, user?.id || "", `Demande ${statut === "approuvee" ? "approuvée" : "rejetée"}`);
      toast.success(`Demande ${statut === "approuvee" ? "approuvée" : "rejetée"}`);
      queryClient.invalidateQueries({ queryKey: ["demandes-materiels"] });
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const filteredDemandes = isAdmin
    ? demandes
    : user
    ? demandes.filter(d => d.user_id === user.id)
    : demandes.filter(d => d.statut === "approuvee");

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {filteredDemandes.map((demande) => (
        <DemandeCard
          key={demande.id}
          demande={demande}
          isAdmin={isAdmin}
          onStatusChange={handleStatut}
        />
      ))}
    </div>
  );
}
