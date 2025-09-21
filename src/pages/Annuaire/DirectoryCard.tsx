import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, User } from "lucide-react";
import { DirectoryEntry } from "@/services/directoryService";

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building size={20} className="text-purple-500" />
          <div className="flex-1">
            <CardTitle className="text-lg">{entry.denomination}</CardTitle>
            <p className="text-xs text-gray-500">{entry.type_service}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {entry.contact1 && (
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-purple-400" />
            <span>{entry.contact1}</span>
          </div>
        )}
        {entry.contact2 && (
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-purple-400" />
            <span>{entry.contact2}</span>
          </div>
        )}
        {
          /* {entry.postal_box && (
          <div className="flex items-center gap-1">
            <User size={14} className="text-purple-400" />
            <span>{entry.postal_box}</span>
          </div>
        )} */
        }
        {entry.email && (
          <div className="flex items-center gap-1">
            <Mail size={14} className="text-purple-400" />
            <span className="text-xs">{entry.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
