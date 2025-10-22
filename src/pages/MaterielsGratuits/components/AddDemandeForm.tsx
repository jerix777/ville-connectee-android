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
  nom_demandeur: z.string().min(2, "Nom du demandeur requis"),
  date_debut_evenement: z.string().min(1, "Date de début requise"),
  heure_debut_evenement: z.string().min(1, "Heure de début requise"),
  date_fin_evenement: z.string().min(1, "Date de fin requise"),
  heure_fin_evenement: z.string().min(1, "Heure de fin requise"),
  lieu_evenement: z.string().min(2, "Lieu de l'événement requis"),
  materiel_id: z.number().min(1, "Sélectionnez un matériel"),
  quantite: z.number().min(1, "Quantité requise"),
  justification: z.string().optional(),
  contact1: z.string().min(1, "Contact 1 requis"),
  contact2: z.string().optional(),
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
            <FormField name="nom_demandeur" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du demandeur</FormLabel>
                <FormControl><Input {...field} placeholder="Nom de l'association ou de la personne" /></FormControl>
              </FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="date_debut_evenement" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                </FormItem>
              )}/>
              <FormField name="heure_debut_evenement" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de début</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                </FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="date_fin_evenement" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                </FormItem>
              )}/>
              <FormField name="heure_fin_evenement" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure de fin</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                </FormItem>
              )}/>
            </div>
            <FormField name="lieu_evenement" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de l'événement</FormLabel>
                <FormControl><Input {...field} placeholder="Adresse ou lieu de l'événement" /></FormControl>
              </FormItem>
            )}/>
            <FormField name="materiel_id" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Matériel souhaité</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded" onChange={(e) => field.onChange(Number(e.target.value))}>
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
            <FormField name="contact1" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Contact 1</FormLabel>
                <FormControl><Input type="tel" {...field} placeholder="Numéro de téléphone principal" /></FormControl>
              </FormItem>
            )}/>
            <FormField name="contact2" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Contact 2 (optionnel)</FormLabel>
                <FormControl><Input type="tel" {...field} placeholder="Numéro de téléphone secondaire" /></FormControl>
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
