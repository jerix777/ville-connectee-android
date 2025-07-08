
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Heart } from "lucide-react";
import { Obituary, getObituaries, addObituary, updateObituary, deleteObituary } from "@/services/necrologieService";
import { ObituaryCard } from "./ObituaryCard";
import { ObituaryForm, ObituaryFormData } from "./ObituaryForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Heart className="mr-2" />
              Nécrologie
            </h1>
            <p className="text-gray-500 mt-1">
              Hommages et mémoire de nos proches disparus
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "liste" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher par nom, message ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedObituary(undefined);
                  setActiveTab("ajouter");
                }}
                className="whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredObituaries.length === 0 ? (
              <div className="text-center py-10">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "Aucun avis de décès trouvé avec ces critères." : "Aucun avis de décès pour le moment."}
                </p>
                {searchQuery ? (
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedObituary(undefined);
                      setActiveTab("ajouter");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter le premier avis
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredObituaries.length} avis de décès
                    {searchQuery && ` trouvé${filteredObituaries.length > 1 ? 's' : ''} pour "${searchQuery}"`}
                  </p>
                </div>
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
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                />
              </div>
            )}
          </div>
        )}
        
        {activeTab === "ajouter" && (
          <div className="max-w-2xl mx-auto">
            <ObituaryForm
              open={true}
              onOpenChange={(open) => !open && setActiveTab("liste")}
              onSubmit={handleSubmitForm}
              initialData={selectedObituary}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

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
    </MainLayout>
  );
}
