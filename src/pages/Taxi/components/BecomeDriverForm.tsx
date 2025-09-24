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
import { createDriverProfile } from "@/services/taxiService";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  vehicle_type: z.string().min(1, "Le type de moto est requis"),
  name: z.string().min(2, "Le nom ou surnom est requis"),
  contact1: z.string().min(8, "Le contact principal est requis"),
  contact2: z.string().optional(),
});

type BecomeDriverFormValues = z.infer<typeof formSchema>;

interface BecomeDriverFormProps {
  onClose: () => void;
}

export const BecomeDriverForm = ({ onClose }: BecomeDriverFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<BecomeDriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: "",
      name: "",
      contact1: "",
      contact2: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createDriverProfile,
    onSuccess: () => {
      toast({
        title: "Inscription réussie !",
        description:
          "Vous êtes maintenant enregistré comme chauffeur de moto-taxi.",
      });
      queryClient.invalidateQueries({ queryKey: ["availableDrivers"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BecomeDriverFormValues) => {
    mutation.mutate({
      ...data,
    });
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
                    <FormLabel>Nom et prénoms ou Surnom chauffeur *</FormLabel>
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
                name="contact1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact principal *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 0102030405"
                        {...field}
                      />
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
                    <FormLabel>Contact 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 0506070809"
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
                    <FormLabel>Type de moto *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de moto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deux_places">
                          Moto deux places
                        </SelectItem>
                        <SelectItem value="jaune_saloni">
                          Moto jaune Saloni
                        </SelectItem>
                        <SelectItem value="tricycle_bagages">
                          Moto tricycle bagages
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                  size="lg"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {mutation.isPending
                    ? (
                      "Enregistrement en cours..."
                    )
                    : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Enregistrer le chauffeur
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
