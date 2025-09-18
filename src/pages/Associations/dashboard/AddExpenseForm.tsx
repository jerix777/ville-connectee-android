import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { associationService } from "@/services/associationService";
import { toast } from "@/hooks/use-toast";
import { SecureFileUpload } from "@/components/common/SecureFileUpload";

interface AddExpenseFormProps {
  associationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = [
  'Communication',
  'Événement',
  'Équipement',
  'Formation',
  'Transport',
  'Restauration',
  'Administration',
  'Autre'
];

export function AddExpenseForm({ associationId, onSuccess, onCancel }: AddExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    montant: '',
    categorie: '',
    date_depense: new Date().toISOString().split('T')[0],
    justificatif_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.montant || !formData.categorie) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await associationService.createDepense({
        association_id: associationId,
        description: formData.description,
        montant: parseFloat(formData.montant),
        categorie: formData.categorie,
        responsable_id: 'system', // TODO: Récupérer l'ID de l'utilisateur connecté
        date_depense: formData.date_depense,
        justificatif_url: formData.justificatif_url || null,
        approuve: false
      });
      
      toast({
        title: "Succès",
        description: "La dépense a été enregistrée avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la dépense. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, justificatif_url: url }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Nouvelle dépense</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la dépense"
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (FCFA) *</Label>
              <Input
                id="montant"
                type="number"
                step="0.01"
                min="0"
                value={formData.montant}
                onChange={(e) => setFormData(prev => ({ ...prev, montant: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select 
                value={formData.categorie} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categorie: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_depense">Date de la dépense *</Label>
            <Input
              id="date_depense"
              type="date"
              value={formData.date_depense}
              onChange={(e) => setFormData(prev => ({ ...prev, date_depense: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Justificatif (optionnel)</Label>
            <SecureFileUpload
              onFileSelect={(file) => {
                // Mock file upload - in real app you'd upload to storage
                const mockUrl = URL.createObjectURL(file);
                handleFileUploaded(mockUrl);
              }}
              validationOptions={{
                allowedTypes: ['image/*', 'application/pdf'],
                allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
                maxSize: 5 * 1024 * 1024
              }}
            />
            {formData.justificatif_url && (
              <p className="text-sm text-green-600">
                <Upload className="h-4 w-4 inline mr-1" />
                Justificatif téléchargé avec succès
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer la dépense'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}