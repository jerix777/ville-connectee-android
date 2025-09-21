import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, MapPin } from "lucide-react";
import { DirectoryEntry } from "@/services/directoryService";

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Building size={24} className="text-blue-500 mt-1" />
          <div>
            <CardTitle className="text-lg font-semibold">{entry.name}</CardTitle>
            <p className="text-sm text-gray-600">{entry.service_type}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow text-sm space-y-3">
        {entry.phone1 && (
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-500" />
            <span>{entry.phone1}</span>
          </div>
        )}
        {entry.phone2 && (
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-500" />
            <span>{entry.phone2}</span>
          </div>
        )}
        {entry.email && (
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-500" />
            <span className="truncate">{entry.email}</span>
          </div>
        )}
        {entry.address && (
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-500" />
            <span>{entry.address}</span>
          </div>
        )}
        {entry.village?.nom && (
          <div className="flex items-center gap-3">
            <Building size={16} className="text-gray-500" />
            <span>{entry.village.nom}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
