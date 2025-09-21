import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDirectoryEntry, getVillages, NewDirectoryEntry } from "@/services/directoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  service_type: z.string().min(2, { message: "Le type de service est requis." }),
  village_id: z.string({ required_error: "Veuillez sélectionner un village." }).uuid({ message: "Sélection invalide." }),
  address: z.string().optional(),
  phone1: z.string().min(8, { message: "Le contact principal est requis." }),
  phone2: z.string().optional(),
  email: z.string().email({ message: "Email invalide." }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddDirectoryEntryFormProps {
  onCancel: () => void;
}

export function AddDirectoryEntryForm({ onCancel }: AddDirectoryEntryFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: villages = [], isLoading: isLoadingVillages } = useQuery({
    queryKey: ["villages"],
    queryFn: getVillages,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      service_type: "",
      village_id: "",
      address: "",
      phone1: "",
      phone2: "",
      email: "",
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: addDirectoryEntry,
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La nouvelle entrée a été ajoutée à l'annuaire.",
      });
      queryClient.invalidateQueries({ queryKey: ["directory_entries"] });
      form.reset();
      onCancel();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'entrée: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    // Ensure the object passed to the mutation matches the NewDirectoryEntry interface
    const newEntry: NewDirectoryEntry = {
      name: values.name,
      service_type: values.service_type,
      village_id: values.village_id,
      phone1: values.phone1,
      address: values.address || null,
      phone2: values.phone2 || null,
      email: values.email || null,
    };
    addEntryMutation.mutate(newEntry);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Ajouter une entrée à l'annuaire</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nom du service / de la personne *</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Mairie de Ouellé" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Type de service *</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Administration Publique" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="village_id"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Village *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingVillages}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={isLoadingVillages ? "Chargement..." : "Sélectionnez un village"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {villages.map((village) => (
                        <SelectItem key={village.id} value={village.id}>
                        {village.nom}
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
            name="address"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Rue des écoles" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="phone1"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact principal *</FormLabel>
                    <FormControl>
                        <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact secondaire</FormLabel>
                    <FormControl>
                        <Input placeholder="Autre numéro" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="adresse@email.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" disabled={addEntryMutation.isPending}>
                {addEntryMutation.isPending ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                    </>
                ) : (
                    "Ajouter à l'annuaire"
                )}
                </Button>
            </div>
        </form>
        </Form>
    </div>
  );
}
