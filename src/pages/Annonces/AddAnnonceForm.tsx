
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { addAnnonce } from "@/services/annonceService";
import { Shield } from "lucide-react";

interface FormValues {
  titre: string;
  contenu: string;
  emetteur: string;
  image_url?: string;
}

export function AddAnnonceForm({ onAdded }: { onAdded?: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);

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
    onAdded?.();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded shadow p-6 mb-8 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-red-600" />
        <h2 className="text-xl font-bold">Nouveau communiqué officiel</h2>
      </div>
      
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
      
      <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
        <Shield className="h-4 w-4 mr-2" />
        Publier le communiqué
      </Button>
    </form>
  );
}
