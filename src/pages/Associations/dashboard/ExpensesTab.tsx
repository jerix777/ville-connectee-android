
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { associationService, AssociationDepense } from '@/services/associationService';

interface ExpensesTabProps {
  associationId: string;
}

export function ExpensesTab({ associationId }: ExpensesTabProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AssociationDepense | null>(null);
  const [form, setForm] = useState({ description: '', montant: '', categorie: '', date_depense: '' });

  const { data: depenses = [], isLoading } = useQuery({
    queryKey: ['association-depenses', associationId],
    queryFn: () => associationService.getDepenses(associationId),
    enabled: !!associationId
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await associationService.createDepense({
        association_id: associationId,
        description: form.description,
        montant: Number(form.montant),
        categorie: form.categorie,
        responsable_id: 'admin', // à remplacer par l'utilisateur courant
        date_depense: form.date_depense,
        approuve: false,
      });
    },
    onSuccess: () => {
      setForm({ description: '', montant: '', categorie: '', date_depense: '' });
      queryClient.invalidateQueries({ queryKey: ['association-depenses', associationId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      await associationService.updateDepense(editing.id, {
        description: form.description,
        montant: Number(form.montant),
        categorie: form.categorie,
        date_depense: form.date_depense,
      });
    },
    onSuccess: () => {
      setEditing(null);
      setForm({ description: '', montant: '', categorie: '', date_depense: '' });
      queryClient.invalidateQueries({ queryKey: ['association-depenses', associationId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await associationService.deleteDepense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-depenses', associationId] });
    }
  });

  const handleEdit = (depense: AssociationDepense) => {
    setEditing(depense);
    setForm({
      description: depense.description,
      montant: String(depense.montant),
      categorie: depense.categorie,
      date_depense: depense.date_depense,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Dépenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <Input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Montant (€)"
            value={form.montant}
            onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
            required
          />
          <Input
            placeholder="Catégorie"
            value={form.categorie}
            onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
          />
          <Input
            type="date"
            placeholder="Date de la dépense"
            value={form.date_depense}
            onChange={e => setForm(f => ({ ...f, date_depense: e.target.value }))}
            required
          />
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editing ? 'Modifier' : 'Ajouter'}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ description: '', montant: '', categorie: '', date_depense: '' }); }}>
              Annuler
            </Button>
          )}
        </form>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : depenses.length === 0 ? (
            <p className="text-muted-foreground">Aucune dépense pour cette association.</p>
          ) : (
            depenses.map(depense => (
              <Card key={depense.id} className="border p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{depense.description}</div>
                    <div className="text-sm text-muted-foreground">Montant : {depense.montant} €</div>
                    <div className="text-xs mt-1">Catégorie : {depense.categorie} | Date : {depense.date_depense}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(depense)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(depense.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}