
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { addSouvenir, uploadSouvenirPhoto } from "@/services/souvenirService";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  date_souvenir: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  auteur: z.string().min(2, "L'auteur doit contenir au moins 2 caractères"),
  quartier_id: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const AddSouvenirForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: quartiers, isLoading: isLoadingQuartiers } = useQuery({
    queryKey: ["quartiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quartiers")
        .select("id, nom")
        .order("nom");

      if (error) throw error;
      return data || [];
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      description: "",
      auteur: "",
      quartier_id: undefined,
    },
  });

  const souvenirMutation = useMutation({
    mutationFn: async (data: FormData) => {
      let photo_url = undefined;
      
      if (photoFile) {
        setIsUploading(true);
        try {
          photo_url = await uploadSouvenirPhoto(photoFile);
        } finally {
          setIsUploading(false);
        }
      }
      
      return addSouvenir({
        titre: data.titre,
        description: data.description,
        date_souvenir: format(data.date_souvenir, "yyyy-MM-dd"),
        auteur: data.auteur,
        quartier_id: data.quartier_id,
        photo_url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["souvenirs"] });
      toast({
        title: "Souvenir ajouté",
        description: "Votre souvenir a été ajouté avec succès.",
      });
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le souvenir. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Erreur lors de l'ajout du souvenir:", error);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    souvenirMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du souvenir" {...field} />
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
                  placeholder="Décrivez votre souvenir..."
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
          name="date_souvenir"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date du souvenir</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auteur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
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
              <FormControl>
                <select
                  className="w-full p-2 border rounded-md"
                  {...field}
                  value={field.value || ""}
                >
                  <option value="">Sélectionner un quartier</option>
                  {quartiers?.map((quartier) => (
                    <option key={quartier.id} value={quartier.id}>
                      {quartier.nom}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Photo (optionnel)</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="cursor-pointer"
          />
          {photoPreview && (
            <div className="mt-2 relative w-full h-40">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={souvenirMutation.isPending || isUploading}
        >
          {(souvenirMutation.isPending || isUploading) && (
            <Spinner className="mr-2 h-4 w-4" />
          )}
          Ajouter le souvenir
        </Button>
      </form>
    </Form>
  );
};
