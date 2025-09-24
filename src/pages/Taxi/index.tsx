import { useState } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { getAvailableDrivers, getUserBookings } from '@/services/taxiService';
import { FindRide } from './components/FindRide';
import { BecomeDriverForm } from './components/BecomeDriverForm';
import { DriverDashboard } from './components/DriverDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from 'lucide-react';
import { useDataManagement } from '@/hooks/useDataManagement';

const TaxiPage = () => {
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
    fetchData: getAvailableDrivers,
    searchFields: ['vehicle_type'],
    itemsPerPage: 6,
    enableRealTimeRefresh: true
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: getUserBookings,
    enabled: !!user,
  });

  const renderListContent = () => (
    <FindRide 
      drivers={driversPagination.paginatedData}
      loading={driversLoading}
      onRefresh={refreshDrivers}
    />
  );

  const renderAddContent = () => (
    isDriver ? (
      <DriverDashboard 
        bookings={bookings}
        loading={bookingsLoading}
      />
    ) : (
      <BecomeDriverForm onSuccess={() => setIsDriver(true)} />
    )
  );

  return (
    <PageLayout
      moduleId="taxi"
      title="Motos taxis"
      description="Vous avez besoin d'une moto taxi pour une course ?
                  Trouvez la liste et les contacts des chauffeurs ici puis appelez pour solliciter leurs services"
      icon={Car}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderListContent()}
      addContent={renderAddContent()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un type de véhicule..."
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

export default TaxiPage;
