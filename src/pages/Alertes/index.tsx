
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/common/PageLayout";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff, Trash2, Search, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function AlertesPage() {
  const { toast } = useToast();
  const [alertes, setAlertes] = useState<ImmobilierAlerte[]>([]);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("liste");

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

  const filteredAlertes = alertes.filter((alerte) => {
    const matchesSearch = !searchQuery || 
      alerte.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alerte.is_vente && alerte.is_location ? "Vente et Location" : 
       alerte.is_vente ? "Vente" : "Location").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedAlertes,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredAlertes,
    itemsPerPage: 10,
  });

  const renderSearchForm = () => (
    <div className="bg-card rounded-lg border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="search-email" className="text-base font-medium">
            Rechercher vos alertes
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Entrez votre adresse email pour retrouver toutes vos alertes enregistrées
          </p>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="search-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="pl-10"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="whitespace-nowrap"
              disabled={loading}
            >
              {loading ? "Recherche..." : "Rechercher mes alertes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    if (!email) {
      return (
        <div className="space-y-6">
          {renderSearchForm()}
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Recherchez vos alertes</AlertTitle>
            <AlertDescription>
              Entrez votre adresse email pour rechercher vos alertes enregistrées.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="space-y-6">
          {renderSearchForm()}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (alertes.length === 0) {
      return (
        <div className="space-y-6">
          {renderSearchForm()}
          <Alert>
            <BellOff className="h-4 w-4" />
            <AlertTitle>Aucune alerte trouvée</AlertTitle>
            <AlertDescription>
              Nous n'avons trouvé aucune alerte associée à cet email. Vous pouvez créer une nouvelle alerte depuis la page Immobilier.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderSearchForm()}
        <div className="bg-card rounded-lg border overflow-hidden">
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
              {paginatedAlertes.map((alerte) => (
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
                      onClick={() => handleDelete(alerte.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {alertes.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        )}
      </div>
    );
  };

  return (
    <PageLayout
      moduleId="alertes"
      title="Gérer mes alertes"
      description="Avertissez d'une anomalie, une panne ou un danger"
      icon={Bell}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      listContent={renderContent()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Filtrer les alertes par email ou type..."
      showSearchOnAllTabs={true}
      loading={loading}
      hasData={filteredAlertes.length > 0}
    />
  );
}
