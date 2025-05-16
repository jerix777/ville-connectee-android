
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ServiceCommerce } from "@/services/serviceCommerceService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ServiceCommerceCardProps {
  service: ServiceCommerce;
}

export function ServiceCommerceCard({ service }: ServiceCommerceCardProps) {
  const handleContact = () => {
    navigator.clipboard.writeText(service.contact);
    
    toast("Numéro copié !", {
      description: `Le numéro de contact pour ${service.nom} a été copié dans le presse-papier.`,
    });
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

  const categoryColor = categoryColorMap[service.categorie.toLowerCase()] || "bg-gray-100 text-gray-800";

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      {service.image_url && (
        <div className="w-full h-40">
          <img
            src={service.image_url}
            alt={service.nom}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold leading-tight text-gray-800">
              {service.nom}
            </h3>
            <Badge className={categoryColor}>{service.categorie}</Badge>
          </div>
          {service.quartiers && (
            <p className="text-sm text-gray-500">
              Quartier: {service.quartiers.nom}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="text-gray-700">
          {service.description}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="mr-2 h-4 w-4" />
            {service.adresse}
          </div>
          
          {service.horaires && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="mr-2 h-4 w-4" />
              {service.horaires}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="ville" 
          className="w-full" 
          onClick={handleContact}
        >
          <Phone className="h-4 w-4 mr-2" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
}
