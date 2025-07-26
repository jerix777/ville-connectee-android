import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createCatalogueItem } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { SecureFileUpload } from '@/components/common/SecureFileUpload';
import { FILE_VALIDATION_OPTIONS } from '@/lib/security';
import { supabase } from '@/integrations/supabase/client';
import type { CatalogueItem } from '@/services/catalogueService';

const itemSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  description: z.string().optional(),
  image: z.any().optional(),
});

interface CreateItemFormProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (item: CatalogueItem) => void;
}

export function CreateItemForm({ categoryId, open, onOpenChange, onSuccess }: CreateItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      titre: '',
      description: '',
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `catalogue/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('souvenirs')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('souvenirs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (values: z.infer<typeof itemSchema>) => {
    setIsSubmitting(true);
    try {
      let imageUrl = '/placeholder.svg';
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const newItem = await createCatalogueItem({
        category_id: categoryId,
        name: values.titre,
        description: values.description,
        image_url: imageUrl,
      });
      toast({
        title: "Élément créé",
        description: `L'élément "${newItem.name}" a été créé avec succès.`,
      });
      onSuccess(newItem);
      onOpenChange(false);
      form.reset();
      setImageFile(null);
    } catch (error) {
      console.error("Erreur lors de la création de l'élément:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'élément.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel élément</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Coupe Taper" {...field} />
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
                    <Textarea placeholder="Une brève description de l'élément..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Image</FormLabel>
              <SecureFileUpload
                onFileSelect={setImageFile}
                validationOptions={FILE_VALIDATION_OPTIONS.images}
                maxFiles={1}
                className="w-full"
              />
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
