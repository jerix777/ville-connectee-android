import { useState, useEffect } from "react";
import { Phone, Plus } from "lucide-react";
import { PageLayout } from "@/components/common/PageLayout";
import { ServiceCard } from "./ServiceCard";
import { AddServiceForm } from "./AddServiceForm";
import { serviceRapideService, ServiceRapide } from "@/services/serviceRapideService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AppelsRapides() {
  const [services, setServices] = useState<ServiceRapide[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceType, setServiceType] = useState<'public' | 'prive'>('public');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'prive'>('all');
  const { user } = useAuth();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceRapideService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      await serviceRapideService.delete(id);
      toast.success("Service supprimé avec succès");
      fetchServices();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression du service");
    }
  };

  const handleAddSuccess = () => {
    setDialogOpen(false);
    fetchServices();
  };

  const openDialog = (type: 'public' | 'prive') => {
    setServiceType(type);
    setDialogOpen(true);
  };

  const filteredServices = services.filter(service => {
    if (filterType === 'all') return true;
    return service.type_service === filterType;
  });

  const addButtons = user ? (
    <div className="flex gap-2">
      <Button onClick={() => openDialog('public')} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Service Public
      </Button>
      <Button onClick={() => openDialog('prive')} variant="secondary" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Service Privé
      </Button>
    </div>
  ) : null;

  return (
    <>
      <PageLayout
        moduleId="appels-rapides"
        title="Appels Rapides"
        description="Numéros d'urgence et services essentiels"
        icon={Phone}
        activeTab="liste"
        onTabChange={() => {}}
        onAddClick={undefined}
        additionalOptions={addButtons}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="public">Services Publics</TabsTrigger>
              <TabsTrigger value="prive">Services Privés</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun service disponible
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  canEdit={!!user}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </PageLayout>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ajouter un service {serviceType === 'public' ? 'public' : 'privé'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du service d'urgence
            </DialogDescription>
          </DialogHeader>
          <AddServiceForm type={serviceType} onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
