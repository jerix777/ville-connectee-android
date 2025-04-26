
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Group } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Association = {
  id: string;
  nom: string;
  description: string;
  contact: string;
  created_at?: string;
};

export default function AssociationsPage() {
  // Récupération des associations via Supabase
  const { data: associations, isLoading, error } = useQuery({
    queryKey: ["associations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("associations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Association[];
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Group className="text-ville-DEFAULT" size={28} />
        Associations de la ville
      </h2>

      {isLoading && <p className="text-muted-foreground">Chargement des associations…</p>}
      {error && (
        <p className="text-destructive">
          Erreur lors du chargement des associations.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {associations &&
          associations.map((asso) => (
            <Card key={asso.id}>
              <CardHeader>
                <CardTitle>{asso.nom}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-gray-700">
                  {asso.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-muted-foreground font-medium">Contact :</span>
                  <span className="text-ville-DEFAULT font-semibold">{asso.contact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {/* Message si aucune association */}
      {!isLoading && !error && (!associations || associations.length === 0) && (
        <div className="text-center text-muted-foreground mt-8">
          Aucune association enregistrée pour le moment.
        </div>
      )}
    </div>
  );
}
