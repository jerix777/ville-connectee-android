
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Building2, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageLayout, SearchBar } from "@/components/common";
import { useDataManagement } from "@/hooks";
import { associationService, Association } from "@/services/associationService";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateAssociationForm } from "./CreateAssociationForm";
import { EditAssociationForm } from "./components/EditAssociationForm";
import { AssociationCard } from "./components/AssociationCard";
import { useToast } from "@/hooks/use-toast";

export default function AssociationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [associationToDelete, setAssociationToDelete] = useState<string | null>(null);

  const {
    data: associations,
    loading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    pagination,
    hasData,
    isEmpty,
    isFiltered,
    refresh
  } = useDataManagement<Association>({
    fetchData: associationService.getAll,
    searchFields: ['nom', 'description'],
    itemsPerPage: 9
  });

  const handleCreateAssociation = () => {
    setShowCreateForm(true);
  };

  const handleAssociationCreated = () => {
    setShowCreateForm(false);
    refresh();
  };

  const handleEditAssociation = (association: Association) => {
    setEditingAssociation(association);
  };

  const handleAssociationUpdated = () => {
    setEditingAssociation(null);
    refresh();
  };

  const handleDeleteAssociation = (associationId: string) => {
    setAssociationToDelete(associationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!associationToDelete) return;
    
    try {
      await associationService.delete(associationToDelete);
      toast({
        title: "Association supprimée",
        description: "L'association a été supprimée avec succès",
      });
      refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAssociationToDelete(null);
    }
  };

  const renderAssociationCard = (association: Association) => (
    <AssociationCard
      key={association.id}
      association={association}
      onEdit={handleEditAssociation}
      onDelete={handleDeleteAssociation}
      canManage={true} // TODO: Vérifier les permissions utilisateur
    />
  );

  const renderContent = () => {
    if (showCreateForm) {
      return (
        <AuthGuard>
          <CreateAssociationForm 
            onSuccess={handleAssociationCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </AuthGuard>
      );
    }

    if (editingAssociation) {
      return (
        <AuthGuard>
          <EditAssociationForm
            association={editingAssociation}
            onSuccess={handleAssociationUpdated}
            onCancel={() => setEditingAssociation(null)}
          />
        </AuthGuard>
      );
    }

    if (hasData) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pagination.paginatedData.map(renderAssociationCard)}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <PageLayout
        title="Associations"
        description="Découvrez et gérez les associations locales de votre communauté"
        icon={Users}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
        hasData={hasData}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        onAddClick={handleCreateAssociation}
        addButtonText="Créer une association"
        searchPlaceholder="Rechercher une association..."
        emptyStateTitle={isEmpty ? "Aucune association trouvée" : isFiltered ? "Aucune association ne correspond à votre recherche" : "Aucune association"}
        emptyStateDescription={isEmpty ? "Soyez le premier à créer une association dans votre communauté." : undefined}
        emptyStateIcon={Users}
        onAddFirst={isEmpty ? handleCreateAssociation : undefined}
        addFirstText="Créer la première association"
        resultCount={pagination.paginatedData.length}
        listContent={renderContent()}
        addContent={(showCreateForm || editingAssociation) ? (
          <AuthGuard>
            {showCreateForm && (
              <CreateAssociationForm 
                onSuccess={handleAssociationCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            )}
            {editingAssociation && (
              <EditAssociationForm
                association={editingAssociation}
                onSuccess={handleAssociationUpdated}
                onCancel={() => setEditingAssociation(null)}
              />
            )}
          </AuthGuard>
        ) : undefined}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'association</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette association ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
