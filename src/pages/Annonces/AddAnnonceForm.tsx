
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { addAnnonce } from "@/services/annonceService";
import { Shield, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormValues {
  titre: string;
  contenu: string;
  emetteur: string;
  image_url?: string;
}

export function AddAnnonceForm({ onAdded }: { onAdded?: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    const annonce = await addAnnonce(data);
    if (!annonce) {
      setError("Erreur lors de la publication du communiqué.");
      toast({ 
        title: "Erreur", 
        description: "Impossible de publier le communiqué", 
        variant: "destructive" 
      });
      return;
    }
    toast({ 
      title: "Succès", 
      description: "Communiqué officiel publié !" 
    });
    reset();
    setIsOpen(false);
    onAdded?.();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          <Shield className="h-4 w-4 mr-2" />
          Nouveau communiqué
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Nouveau communiqué officiel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input id="titre" {...register("titre", { required: true })}/>
          </div>
          
          <div>
            <Label htmlFor="emetteur">Émetteur</Label>
            <Input id="emetteur" {...register("emetteur", { required: true })} />
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
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Shield className="h-4 w-4 mr-2" />
              Publier le communiqué
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
