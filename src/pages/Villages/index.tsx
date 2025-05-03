
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getVillages, addVillage, updateVillage, deleteVillage, Village } from "@/services/villageService";
import { VillageCard } from "./VillageCard";
import VillageForm from "./VillageForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function VillagesPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [villageToDelete, setVillageToDelete] = useState<Village | null>(null);

  const fetchVillages = async () => {
    setLoading(true);
    const data = await getVillages();
    setVillages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  const handleAddVillage = async (villageData: Omit<Village, "id" | "created_at">) => {
    const result = await addVillage(villageData);
    if (result) {
      await fetchVillages();
      setShowForm(false);
    }
  };

  const handleUpdateVillage = async (villageData: Omit<Village, "id" | "created_at">) => {
    if (!editingVillage) return;
    
    const result = await updateVillage(editingVillage.id, villageData);
    if (result) {
      await fetchVillages();
      setEditingVillage(null);
    }
  };

  const confirmDelete = async () => {
    if (!villageToDelete) return;
    
    const success = await deleteVillage(villageToDelete.id);
    if (success) {
      toast({
        title: "Village supprimé",
        description: `Le village "${villageToDelete.nom}" a été supprimé`
      });
      setVillageToDelete(null);
      await fetchVillages();
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le village",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (village: Village) => {
    setEditingVillage(village);
    setShowForm(false);
  };

  const handleDelete = (village: Village) => {
    setVillageToDelete(village);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingVillage(null);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Villages de la commune</h1>
        </div>

        {!showForm && !editingVillage && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un village
          </Button>
        )}

        {showForm && (
          <VillageForm
            onSubmit={handleAddVillage}
            onCancel={handleCancelForm}
          />
        )}

        {editingVillage && (
          <VillageForm
            village={editingVillage}
            onSubmit={handleUpdateVillage}
            onCancel={handleCancelForm}
          />
        )}

        {loading && <div className="py-4">Chargement...</div>}
        {!loading && villages.length === 0 && (
          <div className="text-gray-600 py-8 text-center">
            Aucun village n'a été ajouté pour le moment.
          </div>
        )}
        
        <div className="mt-6 space-y-6">
          {villages.map((village) => (
            <VillageCard 
              key={village.id} 
              village={village} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>

        {/* Confirmation dialog for delete */}
        <AlertDialog open={!!villageToDelete} onOpenChange={(open) => !open && setVillageToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va supprimer définitivement le village "{villageToDelete?.nom}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster />
    </MainLayout>
  );
}
