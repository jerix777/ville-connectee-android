import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle, UserPlus } from "lucide-react";

const formSchema = z.object({
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  vehicle_model: z.string().min(1, "Le modèle du véhicule est requis"),
  license_plate: z.string().min(1, "La plaque d'immatriculation est requise"),
});

type BecomeDriverFormValues = z.infer<typeof formSchema>;

interface BecomeDriverFormProps {
  onSuccess: () => void;
}

export const BecomeDriverForm = ({ onSuccess }: BecomeDriverFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BecomeDriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: "",
      vehicle_model: "",
      license_plate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createDriverProfile,
    onSuccess: () => {
      toast({
        title: "Inscription réussie !",
        description:
          "Vous êtes maintenant enregistré comme chauffeur de taxi communal.",
      });
      queryClient.invalidateQueries({ queryKey: ["availableDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["driverProfile", user?.id] });
      form.reset();
      onSuccess();
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
      vehicle_type: data.vehicle_type,
      vehicle_model: data.vehicle_model,
      license_plate: data.license_plate,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <Car className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Devenir chauffeur de Moto-taxi
          </CardTitle>
          <p className="text-muted-foreground">
            Rejoignez le groupe de chauffeurs et proposez vos services de
            transport local
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Avantages de devenir chauffeur
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground ml-7">
              <li>• Vous devenez plus visible</li>
              <li>• Aidez votre communauté locale</li>
              <li>• Vos revenues accroissent significativement</li>
            </ul>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehicle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de votre véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="moto">
                          🏍️ Moto-taxi (1-2 passagers)
                        </SelectItem>
                        <SelectItem value="tricyclejaune">
                          🚗 Tricycle Jaune (3-4 passagers)
                        </SelectItem>
                        <SelectItem value="tricyclebenne">
                          🚗 Tricycle bène (1 passagers)
                        </SelectItem>
                        <SelectItem value="voiture">
                          🚐 Taxi-brousse (5-9 passagers)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez le type de véhicule que vous utilisez pour le
                      transport
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle du véhicule *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Apsonic 125-30, Toyota Corolla, Mercedes..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Précisez la marque et le modèle de votre véhicule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license_plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaque d'immatriculation *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 1234AB05"
                        {...field}
                        style={{ textTransform: "uppercase" }}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Numéro d'immatriculation de votre véhicule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {mutation.isPending
                    ? (
                      "Inscription en cours..."
                    )
                    : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        S'inscrire comme chauffeur
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
