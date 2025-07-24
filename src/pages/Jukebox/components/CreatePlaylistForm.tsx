import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createPlaylist } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { Playlist } from '@/services/jukeboxService';

const playlistSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
});

interface CreatePlaylistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (playlist: Playlist) => void;
}

export function CreatePlaylistForm({ open, onOpenChange, onSuccess }: CreatePlaylistFormProps) {
  const form = useForm<z.infer<typeof playlistSchema>>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      nom: '',
      description: '',
      is_public: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof playlistSchema>) => {
    if (!values.nom) return;
    
    try {
      const newPlaylist = await createPlaylist({
        nom: values.nom,
        description: values.description,
        is_public: values.is_public,
      });
      toast({
        title: "Playlist créée",
        description: `La playlist "${newPlaylist.nom}" a été créée avec succès.`,
      });
      onSuccess(newPlaylist);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la playlist:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la playlist.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle playlist</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la playlist</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma super playlist" {...field} />
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
                    <Textarea placeholder="Une brève description de votre playlist..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Playlist publique</FormLabel>
                    <FormDescription>
                      Rendre cette playlist visible par les autres utilisateurs.
                    </FormDescription>
                  </div>
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
