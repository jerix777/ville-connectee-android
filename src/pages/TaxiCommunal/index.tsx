import { useState } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { getAvailableCommunalDrivers } from '@/services/taxiCommunalService';
import { CommunalFindRide } from './components/CommunalFindRide';
import { BecomeCommunalDriverForm } from './components/BecomeCommunalDriverForm';
import { CommunalDriverDashboard } from './components/CommunalDriverDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from 'lucide-react';
import { useDataManagement } from '@/hooks/useDataManagement';

const TaxiCommunal: React.FC = () => {
  const { user } = useAuth();
  const [isDriver, setIsDriver] = useState(false);

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
    isEmpty: driversEmpty,
    isFiltered: driversFiltered
  } = useDataManagement({
    fetchData: () => getAvailableCommunalDrivers('moto', searchQuery),
    searchFields: ['id'],
    itemsPerPage: 6,
    enableRealTimeRefresh: true
  });

  const renderListContent = () => (
    <CommunalFindRide 
      drivers={(driversPagination.paginatedData || []) as any[]}
      loading={driversLoading}
      onRefresh={refreshDrivers}
    />
  );

  const renderAddContent = () => (
    isDriver ? (
      <CommunalDriverDashboard />
    ) : (
      <BecomeCommunalDriverForm onSuccess={() => setIsDriver(true)} />
    )
  );

  return (
    <PageLayout
      title="Taxi Communal"
      description="Service de transport communal local - motos, tricycles et taxis brousse"
      icon={Car}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderListContent()}
      addContent={renderAddContent()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un chauffeur..."
      loading={driversLoading}
      hasData={hasDrivers}
      currentPage={driversPagination.currentPage}
      totalPages={driversPagination.totalPages}
      onPageChange={driversPagination.goToPage}
      canGoNext={driversPagination.canGoNext}
      canGoPrevious={driversPagination.canGoPrevious}
      skeletonType="grid"
      skeletonCount={6}
    />
  );
};

export default TaxiCommunal;
