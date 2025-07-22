import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getImmobilier } from "@/services/immobilierService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Home, Maximize, Bed } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { toast } from "@/hooks/use-toast";

export default function ImmobilierDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: bien, isLoading, error } = useQuery({
    queryKey: ['immobilier', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const allBiens = await getImmobilier();
      return allBiens.find(b => b.id === id);
    },
    enabled: !!id,
  });

  const handleContact = () => {
    if (bien?.contact) {
      navigator.clipboard.writeText(bien.contact);
      toast({
        title: "Numéro copié !",
        description: `Le numéro de ${bien.vendeur} a été copié dans le presse-papier.`,
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <DetailPageHeader title="Détail du bien immobilier" />
        <LoadingSkeleton />
      </MainLayout>
    );
  }

  if (error || !bien) {
    return (
      <MainLayout>
        <DetailPageHeader title="Bien immobilier non trouvé" />
        <div className="p-4 text-center">
          <p>Ce bien immobilier n'existe pas ou a été supprimé.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailPageHeader title="Détail du bien immobilier" />
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{bien.titre}</CardTitle>
              <Badge variant={bien.is_for_sale ? "default" : "secondary"}>
                {bien.is_for_sale ? "À vendre" : "Recherché"}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-ville-DEFAULT">
              {bien.prix.toLocaleString()} CFA
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Home size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Type:</span>
                <span>{bien.type}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Maximize size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Surface:</span>
                <span>{bien.surface} m²</span>
              </div>
              
              {bien.pieces && (
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-ville-DEFAULT" />
                  <span className="font-medium">Pièces:</span>
                  <span>{bien.pieces}</span>
                </div>
              )}
              
              {bien.chambres && (
                <div className="flex items-center gap-2">
                  <Bed size={18} className="text-ville-DEFAULT" />
                  <span className="font-medium">Chambres:</span>
                  <span>{bien.chambres}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Adresse:</span>
                <span>{bien.adresse}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Vendeur:</span>
                <span>{bien.vendeur} - {bien.contact}</span>
              </div>
            </div>
            
            {bien.description && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {bien.description}
                </p>
              </div>
            )}
            
            <Button onClick={handleContact} className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Contacter le vendeur
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}