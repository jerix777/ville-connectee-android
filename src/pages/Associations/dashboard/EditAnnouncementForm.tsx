import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { associationService } from "@/services/associationService";
import { toast } from "@/hooks/use-toast";

interface EditAnnouncementFormProps {
  announcement: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditAnnouncementForm({ announcement, onSuccess, onCancel }: EditAnnouncementFormProps) {
  const [formData, setFormData] = useState({
    titre: announcement.titre || '',
    contenu: announcement.contenu || '',
    priorite: announcement.priorite || 'normale' as 'haute' | 'moyenne' | 'normale',
    visible_jusqu: announcement.visible_jusqu ? new Date(announcement.visible_jusqu).toISOString().split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.contenu.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await associationService.updateAnnonce(announcement.id, {
        titre: formData.titre,
        contenu: formData.contenu,
        priorite: formData.priorite,
        visible_jusqu: formData.visible_jusqu || null
      });
      
      toast({
        title: "Succès",
        description: "L'annonce a été modifiée avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'annonce. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Modifier l'annonce</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre de l'annonce *</Label>
            <Input
              id="titre"
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              placeholder="Titre de l'annonce"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenu">Contenu *</Label>
            <Textarea
              id="contenu"
              value={formData.contenu}
              onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
              placeholder="Contenu de l'annonce"
              rows={5}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priorite">Priorité</Label>
              <Select 
                value={formData.priorite} 
                onValueChange={(value: 'haute' | 'moyenne' | 'normale') => 
                  setFormData(prev => ({ ...prev, priorite: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visible_jusqu">Visible jusqu'au (optionnel)</Label>
              <Input
                id="visible_jusqu"
                type="date"
                value={formData.visible_jusqu}
                onChange={(e) => setFormData(prev => ({ ...prev, visible_jusqu: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Modification...' : 'Modifier l\'annonce'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}