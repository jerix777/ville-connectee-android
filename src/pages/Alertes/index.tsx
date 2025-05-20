
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAlertes, deleteAlerte, ImmobilierAlerte } from "@/services/alertesService";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertesPage() {
  const { toast } = useToast();
  const [alertes, setAlertes] = useState<ImmobilierAlerte[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAlertes = async (emailToSearch: string) => {
    if (!emailToSearch) return;
    
    setLoading(true);
    const data = await getAlertes(emailToSearch);
    setAlertes(data);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAlertes(email);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAlerte(id);
    
    if (success) {
      setAlertes(alertes.filter(alerte => alerte.id !== id));
      toast({
        title: "Alerte supprimée",
        description: "L'alerte a été supprimée avec succès",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gérer mes alertes</h1>
            <p className="text-gray-600">
              Retrouvez et gérez toutes vos alertes immobilières
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search-email">Rechercher vos alertes</Label>
              <Input
                id="search-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email pour rechercher vos alertes"
                className="mt-1"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary" 
              className="md:w-auto w-full"
              disabled={loading}
            >
              {loading ? "Recherche..." : "Rechercher"}
            </Button>
          </form>
        </div>

        {alertes.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type d'alerte</TableHead>
                  <TableHead>Prix maximum</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertes.map((alerte) => (
                  <TableRow key={alerte.id}>
                    <TableCell className="font-medium">
                      {alerte.is_vente && alerte.is_location
                        ? "Vente et Location"
                        : alerte.is_vente
                        ? "Vente"
                        : "Location"}
                    </TableCell>
                    <TableCell>
                      {alerte.prix_max
                        ? formatPrice(alerte.prix_max)
                        : "Pas de maximum"}
                    </TableCell>
                    <TableCell>{alerte.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(alerte.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : email ? (
          <Alert>
            <BellOff className="h-4 w-4" />
            <AlertTitle>Aucune alerte trouvée</AlertTitle>
            <AlertDescription>
              Nous n'avons trouvé aucune alerte associée à cet email. Vous pouvez créer une nouvelle alerte depuis la page Immobilier.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Recherchez vos alertes</AlertTitle>
            <AlertDescription>
              Entrez votre adresse email pour rechercher vos alertes enregistrées.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </MainLayout>
  );
}
