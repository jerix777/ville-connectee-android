import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaxiDriver } from "@/services/taxiService";
import { Car, MapPin, Phone } from "lucide-react";

interface DriverCardProps {
  driver: TaxiDriver;
  onSelect?: () => void;
}

export const DriverCard = ({ driver, onSelect }: DriverCardProps) => {
  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "moto":
        return "🏍️";
      case "voiture":
        return "🚗";
      case "minibus":
        return "🚐";
      default:
        return "🚕";
    }
  };

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case "moto":
        return "Moto-taxi";
      case "voiture":
        return "Taxi voiture";
      case "minibus":
        return "Minibus";
      default:
        return "Véhicule";
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {getVehicleLabel(driver.vehicle_type)}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {getVehicleIcon(driver.vehicle_type)}{" "}
                {driver.vehicle_model || "Véhicule standard"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {driver.license_plate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="font-mono">{driver.license_plate}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // Logique pour contacter le chauffeur
            }}
          >
            <Phone className="h-4 w-4 mr-1" />
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
