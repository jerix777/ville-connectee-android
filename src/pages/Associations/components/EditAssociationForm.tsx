import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { associationService, Association } from "@/services/associationService";
import { ArrowLeft, Edit } from "lucide-react";

const editAssociationSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contact: z.string().min(5, "Le contact est obligatoire"),
  logo_url: z.string().url().optional().or(z.literal("")),
  statut: z.enum(['active', 'inactive', 'suspendu']),
});

type EditAssociationFormData = z.infer<typeof editAssociationSchema>;

interface EditAssociationFormProps {
  association: Association;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspendu', label: 'Suspendue' },
];

export function EditAssociationForm({ association, onSuccess, onCancel }: EditAssociationFormProps) {
  const { toast } = useToast();
  
  const form = useForm<EditAssociationFormData>({
    resolver: zodResolver(editAssociationSchema),
    defaultValues: {
      nom: association.nom,
      description: association.description,
      contact: association.contact,
      logo_url: association.logo_url || "",
      statut: association.statut as 'active' | 'inactive' | 'suspendu',
    },
  });

  const onSubmit = async (data: EditAssociationFormData) => {
    try {
      await associationService.update(association.id, {
        nom: data.nom,
        description: data.description,
        contact: data.contact,
        logo_url: data.logo_url || undefined,
        statut: data.statut,
      });

      toast({
        title: "Association modifiée",
        description: "Les informations ont été mises à jour avec succès",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'association",
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
          <Edit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Modifier l'association</h1>
        </div>
        <p className="text-muted-foreground">
          Modifiez les informations de votre association
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'association</CardTitle>
          <CardDescription>
            Ces informations seront visibles par tous les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'association *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {form.formState.isSubmitting ? "Modification..." : "Modifier l'association"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}