import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { serviceRapideService, ServiceRapideInsert } from "@/services/serviceRapideService";
import { Loader2 } from "lucide-react";

interface AddServiceFormProps {
  type: 'public' | 'prive';
  onSuccess: () => void;
}

export function AddServiceForm({ type, onSuccess }: AddServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceRapideInsert>();

  const onSubmit = async (data: ServiceRapideInsert) => {
    setLoading(true);
    try {
      await serviceRapideService.create({
        ...data,
        type_service: type
      });
      toast.success(`Service ${type === 'public' ? 'public' : 'privé'} ajouté avec succès`);
      reset();
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du service:', error);
      toast.error("Erreur lors de l'ajout du service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nom_etablissement">Nom de l'établissement *</Label>
        <Input
          id="nom_etablissement"
          {...register("nom_etablissement", { required: "Ce champ est requis" })}
          placeholder="Ex: Préfecture, CIE, etc."
        />
        {errors.nom_etablissement && (
          <p className="text-sm text-destructive mt-1">{errors.nom_etablissement.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact1">Contact 1 *</Label>
        <Input
          id="contact1"
          {...register("contact1", { required: "Ce champ est requis" })}
          placeholder="Numéro de téléphone principal"
        />
        {errors.contact1 && (
          <p className="text-sm text-destructive mt-1">{errors.contact1.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact2">Contact 2</Label>
        <Input
          id="contact2"
          {...register("contact2")}
          placeholder="Numéro de téléphone secondaire (optionnel)"
        />
      </div>

      <div>
        <Label htmlFor="logo_url">URL du logo</Label>
        <Input
          id="logo_url"
          {...register("logo_url")}
          placeholder="https://example.com/logo.png (optionnel)"
          type="url"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ajouter le service
      </Button>
    </form>
  );
}
