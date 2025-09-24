import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProfessional, getMetiers } from "@/services/professionalService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddWorkerFormProps {
  inline?: boolean;
  onClose?: () => void;
}

export function AddWorkerForm({ inline = false, onClose }: AddWorkerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    surnom: "",
    metier_id: "",
    contact1: "",
    contact2: "",
    base: "",
  });

  const { data: metiers = [] } = useQuery({
    queryKey: ["metiers"],
    queryFn: getMetiers,
  });

  const addWorkerMutation = useMutation({
    mutationFn: addProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast({
        title: "Professionnel ajouté",
        description: "Le professionnel a été ajouté avec succès",
      });
      setFormData({
        nom: "",
        surnom: "",
        metier_id: "",
        contact1: "",
        contact2: "",
        base: "",
      });
      setIsOpen(false);
      if (onClose) onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du professionnel",
        variant: "destructive",
      });
      console.error("Error adding professional:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, metier_id: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkerMutation.mutate(formData);
  };

  const formContent = (
    <div className={inline ? "" : ""}>
      {!inline && <div className="sr-only" />}
      <div
        className={inline
          ? "max-w-2xl"
          : "max-w-2xl max-h-[90vh] overflow-y-auto"}
      >
        {(!inline) ? <div className="hidden" /> : null}
        <div>
          {!inline && (
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                Ajouter un nouveau professionnel
              </h3>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metier_id">Domaine d'activité</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.metier_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    {metiers.map((metier) => (
                      <SelectItem key={metier.id} value={metier.id}>
                        {metier.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom et prénoms</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom complet du professionnel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surnom">Surnom (optionnel)</Label>
                <Input
                  id="surnom"
                  name="surnom"
                  value={formData.surnom}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact1">Contact 1</Label>
                <Input
                  id="contact1"
                  name="contact1"
                  value={formData.contact1}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone principal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact2">Contact 2 (optionnel)</Label>
                <Input
                  id="contact2"
                  name="contact2"
                  value={formData.contact2}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base">Zone de couverture</Label>
                <Input
                  id="base"
                  name="base"
                  value={formData.base}
                  onChange={handleChange}
                  placeholder="Lieu de résidence ou zone de travail"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (inline) {
                    if (onClose) onClose();
                  } else {
                    setIsOpen(false);
                  }
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="secondary"
                disabled={addWorkerMutation.isPending}
              >
                {addWorkerMutation.isPending
                  ? "Ajout en cours..."
                  : "Ajouter le professionnel"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un professionnel
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau professionnel</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
