import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchServicesCommerces } from "@/services/serviceCommerceService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { toast } from "@/hooks/use-toast";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const allServices = await fetchServicesCommerces();
      return allServices.find(s => s.id === id);
    },
    enabled: !!id,
  });

  const handleContact = () => {
    if (service?.contact) {
      navigator.clipboard.writeText(service.contact);
      toast({
        title: "Numéro copié !",
        description: `Le numéro de contact pour ${service.nom} a été copié dans le presse-papier.`,
      });
    }
  };

  const categoryColorMap: Record<string, string> = {
    "alimentation": "bg-green-100 text-green-800",
    "santé": "bg-blue-100 text-blue-800",
    "beauté": "bg-pink-100 text-pink-800",
    "éducation": "bg-yellow-100 text-yellow-800",
    "transport": "bg-orange-100 text-orange-800",
    "loisirs": "bg-purple-100 text-purple-800",
    "administration": "bg-gray-100 text-gray-800",
    "banque": "bg-emerald-100 text-emerald-800",
    "artisanat": "bg-amber-100 text-amber-800",
    "autre": "bg-slate-100 text-slate-800"
  };

  if (isLoading) {
    return (
      <MainLayout>
        <DetailPageHeader title="Détail du service" />
        <LoadingSkeleton />
      </MainLayout>
    );
  }

  if (error || !service) {
    return (
      <MainLayout>
        <DetailPageHeader title="Service non trouvé" />
        <div className="p-4 text-center">
          <p>Ce service n'existe pas ou a été supprimé.</p>
        </div>
      </MainLayout>
    );
  }

  const categoryColor = categoryColorMap[service.categorie.toLowerCase()] || "bg-gray-100 text-gray-800";

  return (
    <MainLayout>
      <DetailPageHeader title="Détail du service" />
      <div className="p-4">
        <Card>
          {service.image_url && (
            <div className="w-full h-64">
              <img
                src={service.image_url}
                alt={service.nom}
                className="h-full w-full object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{service.nom}</CardTitle>
              <Badge className={categoryColor}>{service.categorie}</Badge>
            </div>
            {service.quartiers && (
              <p className="text-muted-foreground">
                Quartier: {service.quartiers.nom}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Adresse:</span>
                <span>{service.adresse}</span>
              </div>
              
              {service.horaires && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-ville-DEFAULT" />
                  <span className="font-medium">Horaires:</span>
                  <span>{service.horaires}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Contact:</span>
                <span>{service.contact}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
            
            <Button onClick={handleContact} className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Contacter
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}