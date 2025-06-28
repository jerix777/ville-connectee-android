
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { addNews, NewsType } from "@/services/newsService";
import { Plus } from "lucide-react";

interface FormValues {
  titre: string;
  contenu: string;
  type: NewsType;
  auteur?: string;
  image_url?: string;
}

export function AddNewsForm({ onAdded }: { onAdded?: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FormValues>({
    defaultValues: { type: "actualité" }
  });
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    const news = await addNews(data);
    if (!news) {
      setError("Erreur lors de l'ajout.");
      toast({ title: "Erreur", description: "Impossible d'ajouter l'actualité", variant: "destructive" });
      return;
    }
    toast({ title: "Succès", description: "Actualité ajoutée !" });
    reset();
    setIsOpen(false);
    onAdded?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Nouvelle actualité
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle actualité</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input id="titre" {...register("titre", { required: true })}/>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" {...register("type", { required: true })} className="input-modern w-full">
              <option value="actualité">Actualité</option>
              <option value="communiqué">Communiqué</option>
            </select>
          </div>
          <div>
            <Label htmlFor="auteur">Auteur (optionnel)</Label>
            <Input id="auteur" {...register("auteur")} />
          </div>
          <div>
            <Label htmlFor="image_url">Image (URL, optionnel)</Label>
            <Input id="image_url" {...register("image_url")} />
          </div>
          <div>
            <Label htmlFor="contenu">Contenu</Label>
            <Textarea id="contenu" {...register("contenu", { required: true })} rows={5} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              Publier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
