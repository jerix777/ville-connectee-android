import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDriverProfile, type TaxiDriverInsert } from "@/services/taxiService";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  name: z.string().min(2, "Le nom ou surnom est requis"),
  contact1: z.string().min(8, "Le contact principal est requis"),
  contact2: z.string().optional(),
  description: z.string().optional(),
  localite: z.string().min(2, "La localité est requise"),
});

type AddDriverFormValues = z.infer<typeof formSchema>;

interface AddDriverFormProps {
  onClose: () => void;
}

export const AddDriverForm = ({ onClose }: AddDriverFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<AddDriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: "",
      name: "",
      contact1: "",
      contact2: "",
      description: "",
      localite: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createDriverProfile,
    onSuccess: () => {
      toast({
        title: "Enregistrement réussi !",
        description:
          "Le chauffeur a été enregistré avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["availableDrivers"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'enregistrement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddDriverFormValues) => {
    const driverData: any = {
      name: data.name || '',
      contact1: data.contact1 || '',
      contact2: data.contact2,
      vehicle_type: data.vehicle_type,
      description: data.description,
      localite: data.localite,
      // use the provided localite as the location fallback (adjust as needed)
      location: data.localite || '',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active'
    };
    mutation.mutate(driverData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Enregistrer un chauffeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom et prénoms ou Surnom du chauffeur *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Kouassi Jean"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="moto">Moto-taxi</SelectItem>
                        <SelectItem value="mototruck">Tricycle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contact1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact principal *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 0709080706" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact secondaire</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 0102030405" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="localite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localité *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="moto">Moto-taxi</SelectItem>
                        <SelectItem value="mototruck">Tricycle</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="Informations supplémentaires sur le chauffeur..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={mutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <UserPlus className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};