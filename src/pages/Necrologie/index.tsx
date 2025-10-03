
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/common/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Obituary, getObituaries, addObituary, updateObituary, deleteObituary } from "@/services/necrologieService";
import { ObituaryCard } from "./ObituaryCard";
import { ObituaryForm, ObituaryFormData } from "./ObituaryForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";

export default function NecrologiePage() {
  const [obituaries, setObituaries] = useState<Obituary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedObituary, setSelectedObituary] = useState<Obituary | undefined>(undefined);
  const [obituaryToDelete, setObituaryToDelete] = useState<Obituary | null>(null);
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const filteredObituaries = obituaries.filter((obituary) => {
    const matchesSearch = !searchQuery || 
      `${obituary.prenom} ${obituary.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (obituary.message && obituary.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (obituary.lieu_deces && obituary.lieu_deces.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedObituaries,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredObituaries,
    itemsPerPage: 6,
  });

  const renderListContent = () => {
    if (filteredObituaries.length === 0 && !searchQuery) {
      return (
        <div className="text-center py-10">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-4">Aucun avis de décès pour le moment.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedObituaries.map((obituary) => (
            <ObituaryCard
              key={obituary.id}
              obituary={obituary}
              onEdit={handleEditObituary}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
        {filteredObituaries.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {filteredObituaries.length} avis de décès
                {searchQuery && ` trouvé${filteredObituaries.length > 1 ? 's' : ''} pour "${searchQuery}"`}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex">
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={!canGoPrevious}
                >
                  Précédent
                </Button>
                <span className="px-4 py-2 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!canGoNext}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAddContent = () => (
    <div className="max-w-2xl mx-auto">
      <ObituaryForm
        open={true}
        onOpenChange={(open) => !open && setActiveTab("liste")}
        onSubmit={handleSubmitForm}
        initialData={selectedObituary}
        isSubmitting={isSubmitting}
      />
    </div>
  );

  return (
    <>
      <PageLayout
        moduleId="necrologie"
        title="Nécrologie"
        description="Restez informé(e) de l'actualité funèbre et prions pour le repos de nos proches"
        icon={Heart}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        listContent={renderListContent()}
        addContent={renderAddContent()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par nom, message ou lieu..."
        loading={isLoading}
        hasData={filteredObituaries.length > 0}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        resultCount={filteredObituaries.length}
        skeletonType="grid"
        skeletonCount={4}
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
    </>
  );
}
