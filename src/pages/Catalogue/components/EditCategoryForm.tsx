import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { updateCatalogueCategory } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import type { CatalogueCategorie } from '@/services/catalogueService';

const categorySchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().optional(),
});

interface EditCategoryFormProps {
  category: CatalogueCategorie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedCategory: CatalogueCategorie) => void;
}

export function EditCategoryForm({ category, open, onOpenChange, onSuccess }: EditCategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nom: '',
      description: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        nom: category.nom,
        description: category.description || '',
      });
    }
  }, [category, form]);

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    if (!category) return;
    
    setIsSubmitting(true);
    try {
      const updatedCategory = await updateCatalogueCategory(category.id, values);
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
      });
      onSuccess(updatedCategory);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la catégorie.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
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
                    <Input placeholder="Ex: Photos de famille" {...field} />
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
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la catégorie..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Modification..." : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}