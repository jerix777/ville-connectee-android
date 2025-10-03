
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TribuneInput, addTribune, uploadTribuneImage } from "@/services/tribuneService";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Schéma de validation pour le formulaire
const tribuneSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  contenu: z.string().min(1, "Le contenu est requis"),
  auteur: z.string().min(1, "L'auteur est requis"),
  quartier_id: z.string().optional(),
});

type TribuneFormValues = z.infer<typeof tribuneSchema>;

interface AddTribuneFormProps {
  onSuccess: () => void;
}

export function AddTribuneForm({ onSuccess }: AddTribuneFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TribuneFormValues>({
    resolver: zodResolver(tribuneSchema),
    defaultValues: {
      titre: "",
      contenu: "",
      auteur: "",
      quartier_id: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: TribuneFormValues) => {
    setIsSubmitting(true);

    try {
      let imageUrl;
      if (image) {
        imageUrl = await uploadTribuneImage(image);
      }

      const tribuneData: TribuneInput = {
        titre: data.titre,
        contenu: data.contenu,
        auteur: data.auteur,
        quartier_id: data.quartier_id || undefined,
      };

      if (imageUrl) {
        tribuneData.image_url = imageUrl;
      }

      const success = await addTribune(tribuneData);

      if (success) {
        queryClient.invalidateQueries({ queryKey: ["tribunes"] });
        form.reset();
        setImage(null);
        setIsOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tribune", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tribune
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle tribune</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de votre tribune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contenu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Partagez votre opinion..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Image (optionnel)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormDescription>
                Vous pouvez ajouter une image à votre tribune
              </FormDescription>
            </FormItem>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Envoi en cours...
                  </>
                ) : (
                  "Publier la tribune"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
