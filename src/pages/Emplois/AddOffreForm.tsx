
import React, { useState } from "react";
import { addOffreEmploi } from "@/services/offresEmploiService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddOffreFormProps {
  onAdded: () => void;
}

export function AddOffreForm({ onAdded }: AddOffreFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    employeur: "",
    type_contrat: "",
    localisation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const added = await addOffreEmploi(form);
    setLoading(false);
    if (added) {
      toast({ title: "Offre ajoutée avec succès" });
      setForm({ titre: "", description: "", employeur: "", type_contrat: "", localisation: "" });
      setIsOpen(false);
      onAdded();
    } else {
      toast({ title: "Erreur", description: "Impossible d'ajouter l'offre", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle offre d'emploi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle offre d'emploi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Input name="titre" placeholder="Titre du poste" value={form.titre} onChange={handleChange} required />
            <Input name="employeur" placeholder="Employeur" value={form.employeur} onChange={handleChange} required />
            <Input name="type_contrat" placeholder="Type de contrat" value={form.type_contrat} onChange={handleChange} required />
            <Input name="localisation" placeholder="Localisation" value={form.localisation} onChange={handleChange} required />
          </div>
          <Textarea name="description" placeholder="Description du poste" value={form.description} onChange={handleChange} required />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter l'offre"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
