// src/pages/MaterielsGratuits/index.tsx
import { useEffect } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { Gift, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { materielsGratuitsService, type DemandeMateriel } from '@/services/materielsGratuitsService';
import { AddDemandeForm } from './components/AddDemandeForm';
import { ListeDemandes } from './components/ListeDemandes';
import { useAuth } from '@/contexts/AuthContext';
import { useDataManagement } from '@/hooks/useDataManagement';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const MaterielsGratuits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email?.includes("admin");

  const {
    data: demandes,
    loading: demandesLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh: refreshDemandes,
    pagination: demandesPagination,
    hasData: hasDemandes,
  } = useDataManagement({
    fetchData: materielsGratuitsService.getDemandes,
    searchFields: ['reference'],
    itemsPerPage: 6,
  });

  // Écoute en temps réel des changements sur la table demandes_materiels
  useEffect(() => {
    const channel = supabase
      .channel('demandes-materiels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demandes_materiels'
        },
        () => {
          refreshDemandes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshDemandes]);

  const renderListContent = () => (
    <ListeDemandes
      demandes={demandesPagination.paginatedData}
      isLoading={demandesLoading}
      error={null}
      isAdmin={isAdmin}
    />
  );

  const renderAddContent = () => (
    <AddDemandeForm onClose={() => setActiveTab('liste')} />
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gratuit avec Steve YOBOUET</h1>
          <p className="text-gray-600 mt-1">
            Sollicitez gratuitement nos équipements pour vos réunions, cérémonies et autres événements.
            Seules conditions : assurer le transport et l'entretien.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin/materiels')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gestion des matériels
          </Button>
        )}
      </div>

      <PageLayout
        moduleId="materiels-gratuits"
        title=""
        description=""
        icon={Gift}
        iconClassName="text-pink-600"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par référence..."
        addButtonText="Nouvelle demande"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasData={hasDemandes}
        listContent={renderListContent()}
        addContent={renderAddContent()}
        showAddButton={!isAdmin && activeTab !== "ajouter"}
        hideHeader={true}
      />
    </div>
  );
};

export default MaterielsGratuits;
