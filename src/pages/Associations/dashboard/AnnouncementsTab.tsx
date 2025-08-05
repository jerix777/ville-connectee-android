<<<<<<< HEAD

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { associationService, AssociationAnnonce } from '@/services/associationService';
=======
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { associationService } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";
import { AddAnnouncementForm } from "./AddAnnouncementForm";
import { EditAnnouncementForm } from "./EditAnnouncementForm";
>>>>>>> c6af4b3e3c646733aa07faa2fd5d7ff5b80771f6

interface AnnouncementsTabProps {
  associationId: string;
}

export function AnnouncementsTab({ associationId }: AnnouncementsTabProps) {
<<<<<<< HEAD
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AssociationAnnonce | null>(null);
  const [form, setForm] = useState({ titre: '', contenu: '', priorite: 'normale' });

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
          <Input
            placeholder="Priorité (normale, urgente...)"
            value={form.priorite}
            onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))}
          />
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
=======
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  const { data: announcements, isLoading, refetch } = useQuery({
    queryKey: ['association-announcements', associationId],
    queryFn: () => associationService.getAnnonces(associationId)
  });

  const handleAnnouncementAdded = () => {
    setShowAddForm(false);
    refetch();
  };

  const handleAnnouncementUpdated = () => {
    setEditingAnnouncement(null);
    refetch();
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await associationService.deleteAnnonce(announcementId);
        refetch();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton count={3} />;
  }

  if (showAddForm) {
    return (
      <AddAnnouncementForm 
        associationId={associationId}
        onSuccess={handleAnnouncementAdded}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingAnnouncement) {
    return (
      <EditAnnouncementForm 
        announcement={editingAnnouncement}
        onSuccess={handleAnnouncementUpdated}
        onCancel={() => setEditingAnnouncement(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des annonces</h3>
          <p className="text-muted-foreground">
            {announcements?.length || 0} annonce(s) publiée(s)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle annonce
        </Button>
      </div>

      {!announcements || announcements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Aucune annonce publiée</p>
            <Button onClick={() => setShowAddForm(true)}>
              Créer la première annonce
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{announcement.titre}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Créée le {new Date(announcement.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <Badge variant={announcement.priorite === 'haute' ? 'destructive' : 
                                   announcement.priorite === 'moyenne' ? 'default' : 'outline'}>
                        {announcement.priorite}
                      </Badge>
                      {announcement.visible_jusqu && (
                        <span>Expire le {new Date(announcement.visible_jusqu).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAnnouncement(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{announcement.contenu}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
>>>>>>> c6af4b3e3c646733aa07faa2fd5d7ff5b80771f6
  );
}