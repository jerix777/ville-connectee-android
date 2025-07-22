import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMarketItems } from "@/services/marketService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { toast } from "@/hooks/use-toast";

export default function MarketItemDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['market-item', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const allItems = await getMarketItems();
      return allItems.find(i => i.id === id);
    },
    enabled: !!id,
  });

  const handleContact = () => {
    if (item?.contact1) {
      navigator.clipboard.writeText(item.contact1);
      toast({
        title: "Numéro copié !",
        description: `Le numéro de ${item.vendeur} a été copié dans le presse-papier.`,
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <DetailPageHeader title="Détail de l'article" />
        <LoadingSkeleton />
      </MainLayout>
    );
  }

  if (error || !item) {
    return (
      <MainLayout>
        <DetailPageHeader title="Article non trouvé" />
        <div className="p-4 text-center">
          <p>Cet article n'existe pas ou a été supprimé.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailPageHeader title="Détail de l'article" />
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{item.titre}</CardTitle>
              <Badge variant={item.is_for_sale ? "default" : "secondary"}>
                {item.is_for_sale ? `${item.prix} CFA` : `Budget: ${item.prix} CFA`}
              </Badge>
            </div>
            <p className="text-muted-foreground">Par {item.vendeur}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mt-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-ville-DEFAULT" />
                <span className="font-medium">Contact:</span>
                <span>{item.contact1}</span>
              </div>
              
              {item.contact2 && (
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-ville-DEFAULT" />
                  <span className="font-medium">Contact 2:</span>
                  <span>{item.contact2}</span>
                </div>
              )}
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