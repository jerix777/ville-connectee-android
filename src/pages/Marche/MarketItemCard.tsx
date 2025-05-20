
import { Phone } from "lucide-react";
import { MarketItem } from "@/services/marketService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export function MarketItemCard({ item }: { item: MarketItem }) {
  const handleContact = () => {
    // Copier le numéro dans le presse-papier
    navigator.clipboard.writeText(item.contact1);
    
    // Afficher une notification
    toast({
      title: "Numéro copié !",
      description: `Le numéro de ${item.vendeur} a été copié dans le presse-papier.`,
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.titre}</CardTitle>
            <p className="text-sm text-gray-500">{item.vendeur}</p>
          </div>
          <div className={`${item.is_for_sale ? "bg-ville-light text-ville-DEFAULT" : "bg-blue-100 text-blue-600"} px-3 py-1 rounded-full text-sm font-medium`}>
            {item.is_for_sale ? `${item.prix} CFA` : `Budget: ${item.prix} CFA`}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-ville-DEFAULT" />
            <span>{item.contact1}</span>
          </div>
          {item.contact2 && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-ville-DEFAULT" />
              <span>{item.contact2}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full" onClick={handleContact}>
          <Phone className="h-4 w-4 mr-1" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
}
