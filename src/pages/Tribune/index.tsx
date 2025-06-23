
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { TribuneCard } from "./TribuneCard";
import { AddTribuneForm } from "./AddTribuneForm";
import { fetchTribunes } from "@/services/tribuneService";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, Plus, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function TribunePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tribunes, isLoading } = useQuery({
    queryKey: ["tribunes"],
    queryFn: fetchTribunes,
  });

  const filteredTribunes = tribunes?.filter(
    (tribune) =>
      tribune.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tribune.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tribune.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tribune.quartiers?.nom &&
        tribune.quartiers.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedTribunes,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredTribunes,
    itemsPerPage: 5,
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 mr-2 text-ville-DEFAULT" />
            <h1 className="text-3xl font-bold text-gray-800">Tribune Libre</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une tribune
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter une tribune</DialogTitle>
                <DialogDescription>
                  Partagez votre opinion avec la communauté. Les tribunes doivent être approuvées avant d'être visibles par tous.
                </DialogDescription>
              </DialogHeader>
              <AddTribuneForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une tribune..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="xl" />
          </div>
        ) : filteredTribunes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Aucune tribune trouvée. Soyez le premier à partager votre opinion !
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-6">
              {paginatedTribunes.map((tribune) => (
                <TribuneCard key={tribune.id} tribune={tribune} />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
