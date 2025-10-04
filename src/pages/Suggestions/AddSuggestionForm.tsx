
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SuggestionInput, addSuggestion, uploadSuggestionImage } from "@/services/suggestionService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddSuggestionFormProps {
  onSuccess: () => void;
}

const suggestionSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  contenu: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  auteur: z.string().min(3, "L'auteur doit contenir au moins 3 caractères"),
  quartier_id: z.string().optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .transform((list) => (list?.length > 0 ? list[0] : undefined)),
});

export function AddSuggestionForm({ onSuccess }: AddSuggestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      titre: "",
      contenu: "",
      auteur: "",
      quartier_id: undefined,
      image: undefined,
    },
  });

  // Récupération des quartiers
  const { data: quartiers } = useQuery({
    queryKey: ["quartiers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("quartiers")
        .select("id, nom")
        .order("nom");

      if (error) throw error;
      return data as any[];
    },
  });

  const onSubmit = async (values: z.infer<typeof suggestionSchema>) => {
    try {
      setIsSubmitting(true);

      let imageUrl = undefined;

      if (values.image) {
        imageUrl = await uploadSuggestionImage(values.image);
      }

      const suggestionData: SuggestionInput = {
        titre: values.titre,
        contenu: values.contenu,
        auteur: values.auteur,
        quartier_id: values.quartier_id,
        image_url: imageUrl || undefined,
      };

      const success = await addSuggestion(suggestionData);

      if (success) {
        form.reset();
        setIsOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle suggestion</DialogTitle>
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
                    <Input placeholder="Titre de votre suggestion" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre suggestion en détail..."
                      className="min-h-32"
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
            <FormField
              control={form.control}
              name="quartier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartier (optionnel)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un village" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(quartiers as any[] || []).map((quartier: any) => (
                        <SelectItem key={quartier.id} value={quartier.id}>
                          {quartier.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer ma suggestion"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
