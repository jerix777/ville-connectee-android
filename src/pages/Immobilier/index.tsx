
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getImmobilier, Immobilier } from "@/services/immobilierService";
import { ImmobilierCard } from "./ImmobilierCard";
import { AddImmobilierForm } from "./AddImmobilierForm";
import { Button } from "@/components/ui/button";
import { Building, Plus, X } from "lucide-react";

export default function ImmobilierPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tous");

  const { data: immobilier, isLoading, error } = useQuery({
    queryKey: ["immobilier"],
    queryFn: getImmobilier
  });

  const ventes = immobilier?.filter(bien => bien.is_for_sale) || [];
  const locations = immobilier?.filter(bien => !bien.is_for_sale) || [];

  const renderBiens = (biens: Immobilier[]) => {
    if (biens.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          Aucune annonce disponible dans cette catégorie.
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {biens.map((bien) => (
          <ImmobilierCard key={bien.id} bien={bien} />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="text-ville-DEFAULT" />
            Espace Immobilier
          </h1>

          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            variant={showAddForm ? "outline" : "ville"}
          >
            {showAddForm ? (
              <>
                <X size={16} /> Annuler
              </>
            ) : (
              <>
                <Plus size={16} /> Publier une annonce
              </>
            )}
          </Button>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <AddImmobilierForm />
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Chargement des annonces immobilières...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>Erreur lors du chargement des annonces immobilières.</p>
          </div>
        )}

        {!isLoading && !error && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tous">
                Toutes les annonces ({immobilier?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="ventes">
                Ventes ({ventes.length})
              </TabsTrigger>
              <TabsTrigger value="locations">
                Locations ({locations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tous">
              {renderBiens(immobilier || [])}
            </TabsContent>
            <TabsContent value="ventes">
              {renderBiens(ventes)}
            </TabsContent>
            <TabsContent value="locations">
              {renderBiens(locations)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}
