import React from 'react';
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";
import { EtablissementCard } from "../components/EtablissementCard";
import type { EtablissementSante } from "@/services/santeService";

interface EtablissementsListProps {
  etablissements: EtablissementSante[];
  error: unknown;
  onMedicamentSearchOpen: () => void;
}

export function EtablissementsList({ 
  etablissements, 
  error, 
  onMedicamentSearchOpen 
}: EtablissementsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button
          onClick={onMedicamentSearchOpen}
          size="lg"
          className="gap-2"
        >
          <Pill size={20} />
          Calculer mon ordonnance
        </Button>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-500">
          <p>Erreur lors du chargement des établissements.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {etablissements.map((etablissement) => (
            <EtablissementCard
              key={etablissement.id}
              etablissement={etablissement}
            />
          ))}
        </div>
      )}
    </div>
  );
}