import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';
import { PageLayout } from '@/components/common';
import { useDataManagement } from '@/hooks/useDataManagement';
import { radioService, Radio } from '@/services/radioService';
import { RadioCard } from './RadioCard';
import { AddRadioForm } from './AddRadioForm';

export default function RadioPage() {
  const {
    data: radios,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    pagination,
    hasData,
    isEmpty,
    isFiltered
  } = useDataManagement<Radio>({
    fetchData: radioService.getAll,
    searchFields: ['nom', 'description'],
    itemsPerPage: 6
  });

  const renderRadioList = () => (
    <div className="space-y-4">
      {pagination.paginatedData.map((radio) => (
        <RadioCard key={radio.id} radio={radio} />
      ))}
    </div>
  );

  return (
    <PageLayout
      title="Ecouter la radio"
      description="Désormais vous pouvez écouter les radios dont le signal n'arrive pas à Ouellé. Des radios en anglais, espagnol et allemand ont été ajoutées à la liste pour les élèves et les amoureux de ces langues. Souhaiteriez-vous qu'on vous ajoute une chaîne que vous aimez ? Veuillez nous le dire en cliquant ici"
      icon={RadioIcon}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      
      // Content
      loading={loading}
      hasData={hasData}
      listContent={renderRadioList()}
      addContent={<AddRadioForm onSuccess={refresh} />}
      
      // Empty state
      emptyStateIcon={RadioIcon}
      emptyStateTitle={
        isFiltered 
          ? "Aucune station trouvée" 
          : "Aucune station radio disponible"
      }
      emptyStateDescription={
        isFiltered
          ? "Essayez de modifier vos critères de recherche"
          : "Les administrateurs peuvent ajouter des stations radio"
      }
      
      // Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPageChange={pagination.goToPage}
      canGoNext={pagination.canGoNext}
      canGoPrevious={pagination.canGoPrevious}
      resultCount={pagination.paginatedData.length}
    />
  );
}
