import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { radioService } from "@/services/radioService";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  category_id: z.string().uuid("Catégorie invalide"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  logo_url: z.string().url("URL invalide").optional().or(z.literal("")),
  flux_url: z.string().url("URL du flux requis"),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface AddRadioFormProps {
  onSuccess?: () => void;
}

export function AddRadioForm({ onSuccess }: AddRadioFormProps) {
  const { toast } = useToast();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["radioCategories"],
    queryFn: radioService.getCategories,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: undefined,
      nom: "",
      description: "",
      logo_url: "",
      flux_url: "",
      is_active: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await radioService.create({
        category_id: data.category_id,
        nom: data.nom,
        flux_url: data.flux_url,
        is_active: data.is_active,
        logo_url: data.logo_url || undefined,
        description: data.description || undefined,
      });

      toast({
        title: "Succès",
        description: "Station radio ajoutée avec succès",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating radio:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la station radio",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une station radio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCategories ? "Chargement..." : "Sélectionner une catégorie"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la station</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Radio France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la station..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du logo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemple.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flux_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du flux audio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://stream.exemple.com/radio.mp3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Station active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      La station sera visible par les utilisateurs
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

            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Annuler
            </Button>
            <Button type="submit" className="w-full">
              Ajouter la station
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
