
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Obituary, getObituaries, addObituary, updateObituary, deleteObituary } from "@/services/necrologieService";
import { ObituaryCard } from "./ObituaryCard";
import { ObituaryForm, ObituaryFormData } from "./ObituaryForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function NecrologiePage() {
  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedObituary, setSelectedObituary] = useState<Obituary | undefined>(undefined);
  const [obituaryToDelete, setObituaryToDelete] = useState<Obituary | null>(null);
  const { toast } = useToast();

  // Chargement des avis de décès
  useEffect(() => {
    async function fetchObituaries() {
      setIsLoading(true);
      const data = await getObituaries();
      setObituaries(data);
      setIsLoading(false);
    }
    
    fetchObituaries();
  }, []);

  // Gestion de l'ouverture du formulaire pour édition
  const handleEditObituary = (obituary: Obituary) => {
    setSelectedObituary(obituary);
    setIsFormOpen(true);
  };

  // Gestion de la suppression
  const handleDeleteClick = (obituary: Obituary) => {
    setObituaryToDelete(obituary);
  };

  const handleConfirmDelete = async () => {
    if (!obituaryToDelete) return;
    
    const success = await deleteObituary(obituaryToDelete.id);
    
    if (success) {
      setObituaries(prev => prev.filter(o => o.id !== obituaryToDelete.id));
      toast({
        title: "Avis de décès supprimé",
        description: "L'avis de décès a été supprimé avec succès."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis de décès.",
        variant: "destructive"
      });
    }
    
    setObituaryToDelete(null);
  };

  // Gestion de soumission du formulaire
  const handleSubmitForm = async (data: ObituaryFormData) => {
    setIsSubmitting(true);
    
    if (selectedObituary) {
      // Mise à jour
      const updated = await updateObituary(selectedObituary.id, data);
      
      if (updated) {
        setObituaries(prev => prev.map(o => o.id === selectedObituary.id ? updated : o));
        toast({
          title: "Avis de décès mis à jour",
          description: "L'avis de décès a été mis à jour avec succès."
        });
        setIsFormOpen(false);
        setSelectedObituary(undefined);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'avis de décès.",
          variant: "destructive"
        });
      }
    } else {
      // Création
      const created = await addObituary(data);
      
      if (created) {
        setObituaries(prev => [created, ...prev]);
        toast({
          title: "Avis de décès ajouté",
          description: "L'avis de décès a été ajouté avec succès."
        });
        setIsFormOpen(false);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'avis de décès.",
          variant: "destructive"
        });
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="container py-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nécrologie</h1>
        <Button onClick={() => {
          setSelectedObituary(undefined);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un avis de décès
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-4">Chargement des avis de décès...</p>
      ) : obituaries.length === 0 ? (
        <p className="text-center py-4">Aucun avis de décès disponible.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {obituaries.map((obituary) => (
            <ObituaryCard
              key={obituary.id}
              obituary={obituary}
              onEdit={handleEditObituary}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      <ObituaryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitForm}
        initialData={selectedObituary}
        isSubmitting={isSubmitting}
      />

      {/* Modal de confirmation de suppression */}
      <Dialog open={!!obituaryToDelete} onOpenChange={(open) => !open && setObituaryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'avis de décès de {obituaryToDelete?.prenom} {obituaryToDelete?.nom} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObituaryToDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
