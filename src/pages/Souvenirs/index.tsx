
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
import { SouvenirCard } from "./SouvenirCard";
import { AddSouvenirForm } from "./AddSouvenirForm";
import { fetchSouvenirs } from "@/services/souvenirService";
import { Spinner } from "@/components/ui/spinner";
import { BookmarkCheck, Plus, Search } from "lucide-react";

export default function SouvenirsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: souvenirs, isLoading } = useQuery({
    queryKey: ["souvenirs"],
    queryFn: fetchSouvenirs,
  });

  const filteredSouvenirs = souvenirs?.filter(
    (souvenir) =>
      souvenir.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      souvenir.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      souvenir.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (souvenir.quartiers?.nom &&
        souvenir.quartiers.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookmarkCheck className="h-8 w-8 mr-2 text-ville-DEFAULT" />
            <h1 className="text-3xl font-bold text-gray-800">Souvenirs</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un souvenir
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un souvenir</DialogTitle>
                <DialogDescription>
                  Partagez un souvenir avec la communauté. Les souvenirs sont des moments précieux qui contribuent à la mémoire collective.
                </DialogDescription>
              </DialogHeader>
              <AddSouvenirForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un souvenir..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="xl" />
          </div>
        ) : filteredSouvenirs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Aucun souvenir trouvé. Ajoutez le premier !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSouvenirs?.map((souvenir) => (
              <SouvenirCard key={souvenir.id} souvenir={souvenir} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
