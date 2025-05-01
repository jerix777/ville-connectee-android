import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addImmobilier, Immobilier } from "@/services/immobilierService";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  titre: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  type: z.string().min(1, "Veuillez sélectionner un type"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  prix: z.coerce.number().positive("Le prix doit être positif"),
  surface: z.coerce.number().positive("La surface doit être positive"),
  pieces: z.coerce.number().int().min(0).optional(),
  chambres: z.coerce.number().int().min(0).optional(),
  adresse: z.string().min(3, "L'adresse est requise"),
  contact: z.string().min(8, "Le contact doit contenir au moins 8 caractères"),
  is_for_sale: z.boolean().default(true),
  vendeur: z.string().min(2, "Le nom du vendeur est requis")
});

// Define the form values type to match what addImmobilier expects
type FormValues = z.infer<typeof formSchema>;

export function AddImmobilierForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      type: "",
      description: "",
      prix: 0,
      surface: 0,
      pieces: undefined,
      chambres: undefined,
      adresse: "",
      contact: "",
      is_for_sale: true,
      vendeur: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Cast the form values to the expected type to ensure all required fields are present
      const immobilierData: Omit<Immobilier, "id" | "created_at"> = {
        titre: values.titre,
        type: values.type,
        description: values.description,
        prix: values.prix,
        surface: values.surface,
        pieces: values.pieces,
        chambres: values.chambres,
        adresse: values.adresse,
        contact: values.contact,
        is_for_sale: values.is_for_sale,
        vendeur: values.vendeur
      };

      const response = await addImmobilier(immobilierData);

      if (response) {
        toast({
          title: "Annonce ajoutée",
          description: "Votre annonce immobilière a été publiée avec succès."
        });

        // Réinitialiser le formulaire
        form.reset();

        // Rafraîchir les données dans la page
        queryClient.invalidateQueries({ queryKey: ["immobilier"] });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter l'annonce immobilière."
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'annonce."
      });
      console.error("Erreur lors de l'ajout:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Publier une annonce immobilière</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre de l'annonce</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Appartement T3 centre-ville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de bien</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="commerce">Local commercial</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_for_sale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Type d'annonce</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "À vendre" : "À louer"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez le bien en détail..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="prix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix {!form.getValues("is_for_sale") && "(mensuel)"}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse / Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Centre-ville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pieces"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Nombre de pièces (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      value={value === undefined ? "" : value}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val ? parseInt(val) : undefined);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chambres"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Nombre de chambres (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      value={value === undefined ? "" : value}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val ? parseInt(val) : undefined);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 77 12 34 56" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendeur / Agence</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Agence Immovilla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Publier l'annonce
          </Button>
        </form>
      </Form>
    </div>
  );
}
