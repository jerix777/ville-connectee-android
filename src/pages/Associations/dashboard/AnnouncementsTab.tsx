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

interface AnnouncementsTabProps {
  associationId: string;
}

export function AnnouncementsTab({ associationId }: AnnouncementsTabProps) {
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
  );
}