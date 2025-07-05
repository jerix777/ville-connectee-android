import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getVillages, Village } from "@/services/villageService";
import { VillageCard } from "./VillageCard";
import { AddVillageForm } from "./AddVillageForm";
import { Button } from "@/components/ui/button";
import { Building, Plus, X } from "lucide-react";

export default function VillagesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tous");

  const { data: villages, isLoading, error } = useQuery({
    queryKey: ["villages"],
    queryFn: getVillages
  });

  const renderVillages = (villagesList: Village[]) => {
    if (villagesList.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          Aucun village disponible dans cette catégorie.
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {villagesList.map((village) => (
          <VillageCard key={village.id} village={village} />
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
            Villages
          </h1>

          <div className="flex items-center gap-2">
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
                  <Plus size={16} /> Ajouter un village
                </>
              )}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <AddVillageForm />
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Chargement des villages...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>Erreur lors du chargement des villages.</p>
          </div>
        )}

        {!isLoading && !error && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tous">
                Tous les villages ({villages?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tous">
              {renderVillages(villages || [])}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}