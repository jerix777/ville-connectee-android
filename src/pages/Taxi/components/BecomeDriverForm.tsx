import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  vehicle_type: z.string().min(1, 'Le type de véhicule est requis'),
  vehicle_model: z.string().optional(),
  license_plate: z.string().optional(),
});

type BecomeDriverFormValues = z.infer<typeof formSchema>;

type BecomeDriverFormProps = {
  onSuccess: () => void;
};

export const BecomeDriverForm = ({ onSuccess }: BecomeDriverFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BecomeDriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: '',
      vehicle_model: '',
      license_plate: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { vehicle_type: string; vehicle_model?: string; license_plate?: string }) => {
      if (!user) throw new Error('User not authenticated');
      return createDriverProfile(data);
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Vous êtes maintenant enregistré comme chauffeur !',
      });
      queryClient.invalidateQueries({ queryKey: ['driverProfile', user?.id] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BecomeDriverFormValues) => {
    if (!data.vehicle_type) return;
    
    mutation.mutate({
      vehicle_type: data.vehicle_type as any,
      vehicle_model: data.vehicle_model,
      license_plate: data.license_plate,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devenir chauffeur</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de véhicule</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de véhicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="voiture">Voiture</SelectItem>
                      <SelectItem value="minibus">Minibus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enregistrement...' : "S'enregistrer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
