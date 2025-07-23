import { useState } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FindRide } from './components/FindRide';
import { BecomeDriverForm } from './components/BecomeDriverForm';
import { DriverDashboard } from './components/DriverDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { taxiService } from '@/services/taxiService';
import { useQuery } from '@tanstack/react-query';

const TaxiPage = () => {
  const { user } = useAuth();
  const [isDriver, setIsDriver] = useState(false);

  const { data: driverProfile, isLoading } = useQuery({
    queryKey: ['driverProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const profile = await taxiService.getDriverProfile(user.id);
      if (profile) {
        setIsDriver(true);
      }
      return profile;
    },
    enabled: !!user,
  });

  return (
    <PageLayout>
      <Tabs defaultValue="find-ride" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-ride">Trouver un taxi</TabsTrigger>
          <TabsTrigger value="driver-section">Espace chauffeur</TabsTrigger>
        </TabsList>
        <TabsContent value="find-ride">
          <FindRide />
        </TabsContent>
        <TabsContent value="driver-section">
          {isLoading ? (
            <p>Chargement...</p>
          ) : isDriver && driverProfile ? (
            <DriverDashboard driverProfile={driverProfile} />
          ) : (
            <BecomeDriverForm onSuccess={() => setIsDriver(true)} />
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default TaxiPage;
