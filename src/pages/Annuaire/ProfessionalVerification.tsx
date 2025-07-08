import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { verifyProfessional, type Professional } from '@/services/professionalService';
import { useMutation } from '@tanstack/react-query';
import { Loader2, ArrowLeft, CheckCircle, Mail, Phone } from 'lucide-react';

interface ProfessionalVerificationProps {
  profile: Professional;
  onVerified: () => void;
  onBack: () => void;
}

export const ProfessionalVerification: React.FC<ProfessionalVerificationProps> = ({
  profile,
  onVerified,
  onBack
}) => {
  const [verificationCode, setVerificationCode] = useState('');

  const verifyMutation = useMutation({
    mutationFn: (code: string) => verifyProfessional(profile.id, code),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Vérification réussie",
          description: "Votre profil professionnel a été vérifié avec succès!"
        });
        onVerified();
      } else {
        toast({
          title: "Erreur de vérification",
          description: data.error || "Code de vérification invalide",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le code",
        variant: "destructive"
      });
    }
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez saisir le code de vérification",
        variant: "destructive"
      });
      return;
    }
    verifyMutation.mutate(verificationCode);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CheckCircle className="h-5 w-5 text-primary" />
          <CardTitle>Vérification du profil</CardTitle>
        </div>
        <CardDescription>
          Saisissez le code de vérification que vous avez reçu pour valider votre profil professionnel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Profil à vérifier :</h4>
            <p className="text-sm text-muted-foreground">{profile.nom}</p>
            <p className="text-sm text-muted-foreground">{profile.metier?.nom}</p>
            
            <div className="mt-2 flex items-center space-x-4 text-sm">
              {profile.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Saisissez le code à 6 chiffres"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Le code de vérification contient 6 chiffres
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={verifyMutation.isPending || verificationCode.length !== 6}
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Vérifier le code'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Une fois vérifié, votre profil sera visible publiquement dans l'annuaire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};