import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createCatalogueCategory } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import type { CatalogueCategorie } from '@/services/catalogueService';

const categorySchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().optional(),
});

interface CreateCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (category: CatalogueCategorie) => void;
}

export function CreateCategoryForm({ open, onOpenChange, onSuccess }: CreateCategoryFormProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nom: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    if (!values.nom) return;
    
    try {
      const newCategory = await createCatalogueCategory({
        nom: values.nom,
        description: values.description,
      });
      toast({
        title: "Catégorie créée",
        description: `La catégorie "${newCategory.nom}" a été créée avec succès.`,
      });
      onSuccess(newCategory);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Coiffures" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Une brève description de la catégorie..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
