import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { santeService, type CreateEtablissementSanteDTO } from '@/services/santeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

interface AddSanteProximiteFormProps {
  inline?: boolean;
}

export default function AddSanteProximiteForm({ inline = false }: AddSanteProximiteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEtablissementSanteDTO>();

  const addEtablissementMutation = useMutation({
    mutationFn: (data: CreateEtablissementSanteDTO) => santeService.addEtablissement(data),
    onSuccess: () => {
      toast({
        title: "Établissement ajouté",
        description: "L'établissement a été ajouté avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['etablissements'] });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'établissement.",
        variant: "destructive",
      });
      console.error('Erreur lors de l\'ajout:', error);
    },
  });

  const onSubmit = (data: CreateEtablissementSanteDTO) => {
    addEtablissementMutation.mutate(data);
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l'établissement *</Label>
        <Input
          id="nom"
          {...register('nom', { required: "Le nom est requis" })}
          placeholder="Nom de l'établissement"
        />
        {errors.nom && (
          <p className="text-sm text-red-500">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type d'établissement *</Label>
        <Select onValueChange={(value) => register('type').onChange({ target: { value } })} defaultValue="">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hopital">Hôpital</SelectItem>
            <SelectItem value="pharmacie">Pharmacie</SelectItem>
            <SelectItem value="clinique">Clinique</SelectItem>
            <SelectItem value="centre_sante">Centre de santé</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse *</Label>
        <Input
          id="adresse"
          {...register('adresse', { required: "L'adresse est requise" })}
          placeholder="Adresse de l'établissement"
        />
        {errors.adresse && (
          <p className="text-sm text-red-500">{errors.adresse.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Contact 1 *</Label>
        <Input
          id="telephone"
          {...register('telephone')}
          placeholder="Numéro de téléphone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone2">Contact 2 (optionnel)</Label>
        <Input
          id="telephone"
          {...register('telephone')}
          placeholder="Numéro de téléphone"
        />
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="horaires">Horaires d'ouverture</Label>
        <Input
          id="horaires"
          {...register('horaires')}
          placeholder="Ex: Lun-Ven: 8h-18h, Sam: 8h-12h"
        />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de l'établissement"
          className="h-24"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgences"
            {...register('urgences')}
          />
          <Label htmlFor="urgences">Service d'urgences</Label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="garde_permanente"
            {...register('garde_permanente')}
          />
          <Label htmlFor="garde_permanente">Garde permanente</Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={addEtablissementMutation.isPending}
      >
        {addEtablissementMutation.isPending ? "Ajout en cours..." : "Ajouter l'établissement"}
      </Button>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Ajouter un établissement de santé</h2>
      {formContent}
    </Card>
  );
}