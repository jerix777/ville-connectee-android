import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateEtablissementSanteDTO,
  santeService,
} from "@/services/santeService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  type: z.enum(["hopital", "pharmacie", "clinique", "centre_sante"], {
    required_error: "Veuillez sélectionner un type d'établissement",
  }),
  adresse: z.string().min(1, "L'adresse est requise"),
  telephone: z.string().optional().nullable(),
  telephone2: z.string().optional().nullable(),
  horaires: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  urgences: z.boolean().default(false),
  garde_permanente: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  inline?: boolean;
  onClose?: () => void;
}

export function AddEtablissementForm({ inline, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const TYPES_ETABLISSEMENT = [
    { id: "hopital", label: "Hôpital" },
    { id: "pharmacie", label: "Pharmacie" },
    { id: "clinique", label: "Clinique" },
    { id: "centre_sante", label: "Centre de santé" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      type: undefined,
      adresse: "",
      telephone: "",
      telephone2: "",
      horaires: "",
      description: "",
      urgences: false,
      garde_permanente: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await santeService.addEtablissement(data as CreateEtablissementSanteDTO);
      toast.success("Établissement ajouté avec succès");
      form.reset();
      // Invalider le cache pour recharger la liste
      queryClient.invalidateQueries({ queryKey: ["etablissements"] });
      onClose?.();
    } catch (error) {
      console.error("Error adding etablissement:", error);
      toast.error("Erreur lors de l'ajout de l'établissement");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'établissement</FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'établissement</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPES_ETABLISSEMENT.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
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
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse postale</FormLabel>
              <FormControl>
                <Input placeholder="Adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact 1</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact 2 (optionnel)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Numéro de téléphone alternatif"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {
          /* <FormField
          control={form.control}
          name="horaires"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horaires</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Lun-Ven: 8h-18h, Sam: 8h-12h"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */
        }
        {
          /*
        <FormField
          control={form.control}
          name="is_open"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Ouvert</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        /> */
        }

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Ajout en cours..." : "Ajouter l'établissement"}
        </Button>
      </form>
    </Form>
  );

  if (inline) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un établissement</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
