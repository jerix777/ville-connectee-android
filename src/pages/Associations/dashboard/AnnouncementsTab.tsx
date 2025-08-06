
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { associationService, AssociationAnnonce } from '@/services/associationService';

interface AnnouncementsTabProps {
  associationId: string;
}

export function AnnouncementsTab({ associationId }: AnnouncementsTabProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AssociationAnnonce | null>(null);
  const [form, setForm] = useState<{ titre: string; contenu: string; priorite: 'normale' | 'haute' | 'moyenne' }>({ titre: '', contenu: '', priorite: 'normale' });

  const { data: annonces = [], isLoading } = useQuery({
    queryKey: ['association-annonces', associationId],
    queryFn: () => associationService.getAnnonces(associationId),
    enabled: !!associationId
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await associationService.createAnnonce({
        association_id: associationId,
        titre: form.titre,
        contenu: form.contenu,
        auteur_id: 'admin', // à remplacer par l'utilisateur courant
        priorite: form.priorite,
      });
    },
    onSuccess: () => {
      setForm({ titre: '', contenu: '', priorite: 'normale' });
      queryClient.invalidateQueries({ queryKey: ['association-annonces', associationId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      await associationService.updateAnnonce(editing.id, {
        titre: form.titre,
        contenu: form.contenu,
        priorite: form.priorite,
      });
    },
    onSuccess: () => {
      setEditing(null);
      setForm({ titre: '', contenu: '', priorite: 'normale' });
      queryClient.invalidateQueries({ queryKey: ['association-annonces', associationId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await associationService.deleteAnnonce(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['association-annonces', associationId] });
    }
  });

  const handleEdit = (annonce: AssociationAnnonce) => {
    setEditing(annonce);
    setForm({ titre: annonce.titre, contenu: annonce.contenu, priorite: annonce.priorite });
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
          <MessageSquare className="h-5 w-5" />
          Annonces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <Input
            placeholder="Titre de l'annonce"
            value={form.titre}
            onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            required
          />
          <Textarea
            placeholder="Contenu de l'annonce"
            value={form.contenu}
            onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
            required
          />
          <select
            value={form.priorite}
            onChange={e => setForm(f => ({ ...f, priorite: e.target.value as 'normale' | 'haute' | 'moyenne' }))}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
          </select>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editing ? 'Modifier' : 'Publier'}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ titre: '', contenu: '', priorite: 'normale' }); }}>
              Annuler
            </Button>
          )}
        </form>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : annonces.length === 0 ? (
            <p className="text-muted-foreground">Aucune annonce pour cette association.</p>
          ) : (
            annonces.map(annonce => (
              <Card key={annonce.id} className="border p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{annonce.titre}</div>
                    <div className="text-sm text-muted-foreground">{annonce.contenu}</div>
                    <div className="text-xs mt-1">Priorité : {annonce.priorite}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(annonce)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(annonce.id)}><Trash2 className="h-4 w-4" /></Button>
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