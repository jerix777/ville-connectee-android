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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taxiService } from '@/services/taxiService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  vehicle_type: z.enum(['moto', 'voiture']),
  line_ids: z.array(z.string()).min(1, 'Veuillez sélectionner au moins une ligne.'),
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
      vehicle_type: 'moto',
      line_ids: [],
    },
  });

  const { data: lines } = useQuery({
    queryKey: ['taxiLines'],
    queryFn: taxiService.getTaxiLines,
  });

  const mutation = useMutation({
    mutationFn: (data: BecomeDriverFormValues) => {
      if (!user) throw new Error('User not authenticated');
      return taxiService.createDriverProfile({ ...data, user_id: user.id });
    },
    onSuccess: () => {
      toast.success('Vous êtes maintenant enregistré comme chauffeur !');
      queryClient.invalidateQueries({ queryKey: ['driverProfile', user?.id] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Une erreur est survenue: ${error.message}`);
    },
  });

  const onSubmit = (data: BecomeDriverFormValues) => {
    mutation.mutate(data);
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lignes désservies</FormLabel>
                  <Select onValueChange={(value) => field.onChange([...field.value, value])}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez les lignes que vous désservez" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lines?.map((line) => (
                        <SelectItem key={line.id} value={line.id.toString()}>
                          {line.name} ({line.start_point} - {line.end_point})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <div className="mt-2">
                    {field.value.map((lineId) => {
                      const line = lines?.find((l) => l.id.toString() === lineId);
                      return (
                        <span key={lineId} className="mr-2 inline-block bg-gray-200 px-2 py-1 rounded">
                          {line?.name}
                        </span>
                      );
                    })}
                  </div>
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
