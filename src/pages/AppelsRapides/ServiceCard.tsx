import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Trash2, Edit } from "lucide-react";
import { ServiceRapide } from "@/services/serviceRapideService";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: ServiceRapide;
  canEdit?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (service: ServiceRapide) => void;
}

export function ServiceCard({ service, canEdit, onDelete, onEdit }: ServiceCardProps) {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {service.logo_url && (
              <img 
                src={service.logo_url} 
                alt={service.nom_etablissement}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{service.nom_etablissement}</h3>
              <Badge variant={service.type_service === 'public' ? 'default' : 'secondary'}>
                {service.type_service === 'public' ? 'Service Public' : 'Service Privé'}
              </Badge>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit?.(service)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete?.(service.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleCall(service.contact1)}
          >
            <Phone className="mr-2 h-4 w-4" />
            {service.contact1}
          </Button>
          
          {service.contact2 && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleCall(service.contact2)}
            >
              <Phone className="mr-2 h-4 w-4" />
              {service.contact2}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
