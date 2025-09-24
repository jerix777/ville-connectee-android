import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Radio } from 'lucide-react';
import { createSession } from '@/services/jukeboxService';
import { toast } from '@/hooks/use-toast';
import type { JukeboxSession, JukeboxSessionInsert } from '@/services/jukeboxService';

interface CreateSessionFormProps {
  onClose: () => void;
  onSuccess: (session: JukeboxSession) => void;
}

export function CreateSessionForm({ onClose, onSuccess }: CreateSessionFormProps) {
  const [formData, setFormData] = useState<Partial<JukeboxSessionInsert>>({
    nom: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom?.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour la session.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      const newSession = await createSession(formData as JukeboxSessionInsert);
      onSuccess(newSession);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Créer une Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la session *</Label>
            <Input
              id="nom"
              value={formData.nom || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Ma session musicale"
              disabled={creating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la session (optionnel)"
              disabled={creating}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={creating}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={creating || !formData.nom?.trim()}
            >
              {creating ? (
                <>
                  <Radio className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 mr-2" />
                  Créer la Session
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
