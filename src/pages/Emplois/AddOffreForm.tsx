
import React, { useState } from "react";
import { addOffreEmploi } from "@/services/offresEmploiService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddOffreFormProps {
  onAdded: () => void;
}

export function AddOffreForm({ onAdded }: AddOffreFormProps) {
  const { toast } = useToast();

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
      onAdded();
    } else {
      toast({ title: "Erreur", description: "Impossible d’ajouter l’offre", variant: "destructive" });
    }
  };

  return (
    <form className="mb-6 p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        <Input name="titre" placeholder="Titre du poste" value={form.titre} onChange={handleChange} required />
        <Input name="employeur" placeholder="Employeur" value={form.employeur} onChange={handleChange} required />
        <Input name="type_contrat" placeholder="Type de contrat" value={form.type_contrat} onChange={handleChange} required />
        <Input name="localisation" placeholder="Localisation" value={form.localisation} onChange={handleChange} required />
      </div>
      <Textarea className="mt-2" name="description" placeholder="Description du poste" value={form.description} onChange={handleChange} required />
      <Button type="submit" className="mt-2" disabled={loading}>
        {loading ? "Ajout..." : "Ajouter l’offre"}
      </Button>
    </form>
  );
}
