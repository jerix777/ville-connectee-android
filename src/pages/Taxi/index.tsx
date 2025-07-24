import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FindRide } from './components/FindRide';
import { BecomeDriverForm } from './components/BecomeDriverForm';
import { DriverDashboard } from './components/DriverDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from 'lucide-react';

const TaxiPage = () => {
  const { user } = useAuth();
  const [isDriver, setIsDriver] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageTitle
          title="Service Taxi"
          description="Transport local et déplacements"
          icon={Car}
        />
        
        <Tabs defaultValue="find-ride" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find-ride">Trouver un taxi</TabsTrigger>
            <TabsTrigger value="driver-section">Espace chauffeur</TabsTrigger>
          </TabsList>
          <TabsContent value="find-ride">
            <FindRide />
          </TabsContent>
          <TabsContent value="driver-section">
            {isDriver ? (
              <DriverDashboard />
            ) : (
              <BecomeDriverForm onSuccess={() => setIsDriver(true)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TaxiPage;
