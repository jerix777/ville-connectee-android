import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { associationService } from "@/services/associationService";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Building2, Blend } from "lucide-react";

const createAssociationSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  contact: z.string().min(5, "Le contact est obligatoire"),
  logo_url: z.string().url().optional().or(z.literal("")),
});

type CreateAssociationFormData = z.infer<typeof createAssociationSchema>;

interface CreateAssociationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateAssociationForm({ onSuccess, onCancel }: CreateAssociationFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<CreateAssociationFormData>({
    resolver: zodResolver(createAssociationSchema),
    defaultValues: {
      nom: "",
      description: "",
      contact: "",
      logo_url: "",
    },
  });

  const onSubmit = async (data: CreateAssociationFormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une association",
        variant: "destructive",
      });
      return;
    }

    try {
      await associationService.create({
        nom: data.nom,
        description: data.description,
        contact: data.contact,
        logo_url: data.logo_url || undefined,
        responsable_id: user.id,
        statut: 'active',
        date_creation: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "Association créée",
        description: "Votre association a été créée avec succès",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'association",
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
          <Blend className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Créer une association</h1>
        </div>
        <p className="text-muted-foreground">
          Remplissez les informations de base pour créer votre association
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'association</CardTitle>
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
                      <Input 
                        placeholder="Ex: Association des jeunes de..."
                        {...field} 
                      />
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
                        placeholder="Décrivez les objectifs et activités de votre association..."
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
                      <Input 
                        placeholder="Email, téléphone ou adresse..."
                        {...field} 
                      />
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
                      <Input 
                        placeholder="https://exemple.com/logo.png"
                        {...field} 
                      />
                    </FormControl>
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
                  {form.formState.isSubmitting ? "Création..." : "Créer l'association"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}