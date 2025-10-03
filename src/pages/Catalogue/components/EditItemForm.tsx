import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { updateCatalogueItem } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { SecureFileUpload } from '@/components/common/SecureFileUpload';
import { FILE_VALIDATION_OPTIONS } from '@/lib/security';
import { supabase } from '@/integrations/supabase/client';
import type { CatalogueItem } from '@/services/catalogueService';

const itemSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().optional(),
  image: z.any().optional(),
});

interface EditItemFormProps {
  item: CatalogueItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedItem: CatalogueItem) => void;
}

export function EditItemForm({ item, open, onOpenChange, onSuccess }: EditItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description: item.description || '',
      });
      setImageFile(null);
    }
  }, [item, form]);

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
    if (!item) return;
    
    setIsSubmitting(true);
    try {
      let updateData: any = {
        name: values.name,
        description: values.description,
      };
      
      if (imageFile) {
        updateData.image_url = await uploadImage(imageFile);
      }

      const updatedItem = await updateCatalogueItem(item.id, updateData);
      toast({
        title: "Élément modifié",
        description: "L'élément a été modifié avec succès.",
      });
      onSuccess(updatedItem);
      onOpenChange(false);
      setImageFile(null);
    } catch (error) {
      console.error("Erreur lors de la modification de l'élément:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'élément.",
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
          <DialogTitle>Modifier l'élément</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'élément</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Photo de vacances" {...field} />
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
                      placeholder="Description de l'élément..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Nouvelle image (optionnelle)</FormLabel>
              <SecureFileUpload
                onFileSelect={setImageFile}
                validationOptions={FILE_VALIDATION_OPTIONS.images}
                maxFiles={1}
                className="w-full"
              />
              {item?.image_url && !imageFile && (
                <div className="mt-2">
                  <img 
                    src={item.image_url} 
                    alt="Image actuelle" 
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Image actuelle</p>
                </div>
              )}
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? "Modification..." : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}