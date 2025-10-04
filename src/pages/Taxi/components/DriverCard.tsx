import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaxiDriver } from "@/services/taxiService";
import { BikeIcon, MapPinIcon, PhoneIcon, MessageSquareIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DriverCardProps {
  driver: TaxiDriver;
  onSelect?: () => void;
}

export const DriverCard = ({ driver, onSelect }: DriverCardProps) => {
  const handleContact = (contact: string, driverName: string) => {
    window.location.href = `tel:${contact}`;
  };

  const handleWhatsApp = (contact: string, driverName: string, village: string) => {
    const message = encodeURIComponent(
      `Bonjour ${driverName}, je souhaiterais un transport vers ${village}.`
    );
    const whatsappUrl = `https://wa.me/${contact.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{driver.name}</CardTitle>
          {driver.is_available && (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Disponible
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <BikeIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium capitalize">
                {driver.vehicle_type === 'moto' ? 'Moto-taxi' : 'Tricycle'}
              </span>
            </div>

            {driver.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {driver.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="w-4 h-4" />
              <span>{driver.villages?.nom || 'Village non spécifié'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => handleContact(driver.contact1, driver.name)}
          >
            <PhoneIcon className="w-4 h-4 mr-2" />
            Appeler
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleWhatsApp(driver.contact1, driver.name, driver.villages?.nom || 'Village')}
          >
            <MessageSquareIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};