// src/pages/MaterielsGratuits/components/AddDemandeForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { materielsGratuitsService, CreateDemandeMaterielDTO } from "@/services/materielsGratuitsService";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  materiel_id: z.number().min(1, "Sélectionnez un matériel"),
  quantite: z.number().min(1, "Quantité requise"),
  justification: z.string().optional(),
});

interface AddDemandeFormProps {
  onClose?: () => void;
}

export function AddDemandeForm({ onClose }: AddDemandeFormProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const demandeData = { ...values, user_id: user?.id || "", date_demande: new Date().toISOString() } as CreateDemandeMaterielDTO;
      await materielsGratuitsService.addDemande(demandeData);
      toast.success("Demande envoyée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["demandes-materiels"] });
      form.reset();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remplir le formulaire suivant</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="materiel_id" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Matériel</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="">Sélectionnez un matériel</option>
                    <option value="1">Mégaphone</option>
                    <option value="2">Sonorisation</option>
                    <option value="3">Chaises</option>
                    <option value="4">Bâche</option>
                  </select>
                </FormControl>
              </FormItem>
            )}/>
            <FormField name="quantite" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
              </FormItem>
            )}/>
            <FormField name="justification" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Justification (optionnel)</FormLabel>
                <FormControl><textarea {...field} className="w-full p-2 border rounded" rows={3} /></FormControl>
              </FormItem>
            )}/>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Envoi..." : "Soumettre"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
