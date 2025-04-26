
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Group } from "lucide-react";

const associations = [
  {
    nom: "Association des Jeunes de la Ville",
    description: "Favorise l’engagement des jeunes dans des projets sociaux et culturels.",
    contact: "07 01 23 45 67",
  },
  {
    nom: "Les Femmes Solidaires",
    description: "Soutien et entraide pour l’autonomisation des femmes.",
    contact: "07 12 34 56 78",
  },
  {
    nom: "Amicale des Anciens Élèves",
    description: "Maintient le lien entre les anciens élèves et leur établissement.",
    contact: "07 23 45 67 89",
  },
];

export default function AssociationsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Group className="text-ville-DEFAULT" size={28} />
        Associations de la ville
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {associations.map((asso, i) => (
          <Card key={asso.nom + i}>
            <CardHeader>
              <CardTitle>{asso.nom}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-gray-700">{asso.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted-foreground font-medium">Contact :</span>
                <span className="text-ville-DEFAULT font-semibold">{asso.contact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
