import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { associationService } from "@/services/associationService";

const addMemberSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  role: z.string().min(1, "Le rôle est obligatoire"),
  date_arrivee: z.string().optional(),
  cotisation_a_jour: z.boolean().default(false),
  montant_cotisation: z.number().min(0).default(0),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberFormProps {
  associationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ROLES = [
  { value: "president", label: "Président" },
  { value: "vice-president", label: "Vice-président" },
  { value: "tresorier", label: "Trésorier" },
  { value: "secretaire", label: "Secrétaire" },
  { value: "membre", label: "Membre simple" },
  { value: "benevole", label: "Bénévole" },
];

export function AddMemberForm({ associationId, onSuccess, onCancel }: AddMemberFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      role: "membre",
      date_arrivee: "",
      cotisation_a_jour: false,
      montant_cotisation: 0,
    },
  });

  const onSubmit = async (data: AddMemberFormData) => {
    try {
      await associationService.addMember({
        association_id: associationId,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone || undefined,
        role: data.role,
        date_adhesion: new Date().toISOString().split('T')[0],
        date_arrivee: data.date_arrivee || undefined,
        cotisation_a_jour: data.cotisation_a_jour,
        montant_cotisation: data.montant_cotisation,
      });

      toast({
        title: "Membre ajouté",
        description: `${data.prenom} ${data.nom} a été ajouté avec succès`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du membre",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Ajouter un membre</h1>
        </div>
        <p className="text-muted-foreground">
          Remplissez les informations du nouveau membre
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du membre</CardTitle>
          <CardDescription>
            Tous les champs sont obligatoires sauf la date d'arrivée et le téléphone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
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
                name="date_arrivee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée dans l'association</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="montant_cotisation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant cotisation (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cotisation_a_jour"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Cotisation à jour</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Le membre a-t-il payé sa cotisation ?
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Ajout..." : "Ajouter le membre"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}