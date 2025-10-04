import { PageLayout } from '@/components/common/PageLayout';
import { getAvailableDrivers, type TaxiDriver } from '@/services/taxiService';
import { FindRide } from './components/FindRide';
import { AddDriverForm } from './components/AddDriverForm';
import { BikeIcon } from 'lucide-react';
import { useDataManagement } from '@/hooks/useDataManagement';

const TaxiPage = () => {
  const {
    data: drivers,
    loading: driversLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh: refreshDrivers,
    pagination: driversPagination,
    hasData: hasDrivers,
  } = useDataManagement<TaxiDriver>({
    fetchData: getAvailableDrivers,
    searchFields: ['name', 'vehicle_type'] as (keyof TaxiDriver)[],
    itemsPerPage: 6,
    enableRealTimeRefresh: true
  });

  const renderListContent = () => (
    <FindRide 
      drivers={driversPagination.paginatedData}
      loading={driversLoading}
      onRefresh={refreshDrivers}
    />
  );

  const renderAddContent = () => (
    <AddDriverForm onClose={() => setActiveTab('list')} />
  );

  return (
    <PageLayout
      moduleId="taxi"
      title="Moto taxi"
      description="Contactez les chauffeurs de taxis de Ouellé en destination des villages pour voir leurs disponibilités"
      icon={BikeIcon}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher par nom, quartier..."
      addButtonText="Ajouter un chauffeur"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasData={hasDrivers}
      listContent={renderListContent()}
      addContent={renderAddContent()}
    />
  );
};

export default TaxiPage;
