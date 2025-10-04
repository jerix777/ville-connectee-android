import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDriverProfile } from '@/services/taxiService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Car, UserCheck } from 'lucide-react';

const formSchema = z.object({
  vehicle_type: z.string().min(1, 'Le type de véhicule est requis'),
  vehicle_model: z.string().optional(),
  license_plate: z.string().optional(),
});

type BecomeCommunalDriverFormValues = z.infer<typeof formSchema>;

type BecomeCommunalDriverFormProps = {
  onSuccess: () => void;
};

export const BecomeCommunalDriverForm = ({ onSuccess }: BecomeCommunalDriverFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BecomeCommunalDriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: '',
      vehicle_model: '',
      license_plate: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: any) => {
      if (!user) throw new Error('User not authenticated');
      return createDriverProfile({
        ...formData,
        name: user.email || 'Chauffeur',
        contact1: user.email || '',
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        location: ''
      } as any);
    },
    onSuccess: () => {
      toast({
        title: 'Inscription réussie',
        description: 'Vous êtes maintenant enregistré comme chauffeur communal !',
      });
      queryClient.invalidateQueries({ queryKey: ['communalDriverProfile', user?.id] });
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Erreur d\'inscription',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BecomeCommunalDriverFormValues) => {
    if (!data.vehicle_type) return;
    mutation.mutate({
      vehicle_type: data.vehicle_type,
      vehicle_model: data.vehicle_model || undefined,
      license_plate: data.license_plate || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Devenir chauffeur communal</h2>
        <p className="text-muted-foreground">
          Rejoignez notre réseau de chauffeurs et proposez vos services de transport
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de véhicule *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre type de véhicule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="moto">
                      <div className="flex items-center gap-2">
                        🏍️ Moto-taxi
                      </div>
                    </SelectItem>
                    <SelectItem value="tricycle">
                      <div className="flex items-center gap-2">
                        🛺 Tricycle
                      </div>
                    </SelectItem>
                    <SelectItem value="brousse">
                      <div className="flex items-center gap-2">
                        🚐 Taxi brousse
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle du véhicule (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Honda 125, Yamaha NMAX..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="license_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plaque d'immatriculation (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: AB-123-CD"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit"
            variant="secondary"
            disabled={mutation.isPending}
            className="w-full"
            size="lg"
          >
            <Car className="h-4 w-4 mr-2" />
            {mutation.isPending ? 'Inscription en cours...' : "S'inscrire comme chauffeur"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
