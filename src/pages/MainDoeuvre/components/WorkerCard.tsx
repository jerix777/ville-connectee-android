
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Search } from "lucide-react";
import type { Professional } from "@/services/professionalService";

export function WorkerCard({ worker }: { worker: Professional }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{worker.nom}</CardTitle>
            {worker.surnom && (
              <p className="text-sm text-gray-500">"{worker.surnom}"</p>
            )}
          </div>
          <div className="bg-ville-light text-ville-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
            {worker.metier?.nom || ""}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-ville-DEFAULT" />
            <span>{worker.contact1}</span>
          </div>
          {worker.contact2 && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-ville-DEFAULT" />
              <span>{worker.contact2}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Search size={16} className="text-ville-DEFAULT" />
            <span>Base: {worker.base}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Phone className="h-4 w-4 mr-1" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
}
