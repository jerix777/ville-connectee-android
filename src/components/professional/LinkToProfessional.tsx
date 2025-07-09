import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Professional, linkProfessionalToUser } from '@/services/professionalService';
import { Link, UserCheck } from 'lucide-react';

interface LinkToProfessionalProps {
  professionals: Professional[];
  onLinked?: () => void;
}

export function LinkToProfessional({ professionals, onLinked }: LinkToProfessionalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrer les professionnels non liés à un utilisateur
  const availableProfessionals = professionals.filter(p => !p.user_id);

  const handleSubmit = async () => {
    if (!selectedProfessional || !email.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un professionnel et saisir votre email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await linkProfessionalToUser(
        selectedProfessional,
        email.trim(),
        phone.trim() || undefined
      );

      if (result.success) {
        toast({
          title: "Liaison réussie",
          description: result.message || "Votre compte a été lié au professionnel avec succès"
        });
        setOpen(false);
        setSelectedProfessional('');
        setEmail('');
        setPhone('');
        onLinked?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de la liaison",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur liaison professionnel:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (availableProfessionals.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Link className="h-4 w-4" />
          <span>Me lier à un professionnel</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Lier mon compte à un professionnel</span>
          </DialogTitle>
          <DialogDescription>
            Si vous êtes déjà référencé dans l'annuaire, vous pouvez lier votre compte utilisateur 
            à votre profil professionnel pour pouvoir le gérer et recevoir des messages.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="professional">Professionnel *</Label>
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre profil professionnel" />
              </SelectTrigger>
              <SelectContent>
                {availableProfessionals.map((pro) => (
                  <SelectItem key={pro.id} value={pro.id}>
                    {pro.nom} - {pro.metier?.nom} ({pro.base})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Cet email sera associé à votre profil professionnel
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Liaison en cours...' : 'Lier mon compte'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}