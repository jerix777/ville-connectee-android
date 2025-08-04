
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Building2, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLayout, SearchBar } from "@/components/common";
import { useDataManagement } from "@/hooks";
import { associationService, Association } from "@/services/associationService";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateAssociationForm } from "./CreateAssociationForm";

export default function AssociationsPage() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleViewAssociation = (associationId: string) => {
    navigate(`/associations/${associationId}`);
  };

  const renderAssociationCard = (association: Association) => (
    <Card 
      key={association.id} 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => handleViewAssociation(association.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {association.logo_url ? (
              <img 
                src={association.logo_url} 
                alt={association.nom}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {association.nom}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {association.nombre_membres} membres
                </Badge>
                <Badge 
                  variant={association.statut === 'active' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {association.statut}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3">
          {association.description}
        </CardDescription>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Créée le {new Date(association.date_creation).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Contact: {association.contact}</span>
          </div>
        </div>
      </CardContent>
    </Card>
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
      addContent={showCreateForm ? (
        <AuthGuard>
          <CreateAssociationForm 
            onSuccess={handleAssociationCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </AuthGuard>
      ) : undefined}
    />
  );
}
