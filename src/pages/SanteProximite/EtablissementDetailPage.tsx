import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Etablissement, getEtablissements } from '@/services/santeService';
import { PageLayout } from '@/components/common/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Building } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { getCategoryInfo } from './utils/categoryIcons';

export default function EtablissementDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: etablissement, isLoading } = useQuery<Etablissement>({
    queryKey: ['etablissement', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const etablissements = await getEtablissements();
      const etablissement = etablissements.find(e => e.id === id);
      if (!etablissement) throw new Error('Établissement non trouvé');
      return etablissement;
    },
    enabled: !!id,
  });

  const handleCall = () => {
    if (etablissement?.telephone) {
      navigator.clipboard.writeText(etablissement.telephone);
      toast('Numéro copié !', {
        description: `Le numéro de téléphone a été copié dans le presse-papier.`
      });
    }
  };

  const handleDirections = () => {
    if (etablissement?.latitude && etablissement?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${etablissement.latitude},${etablissement.longitude}`,
        '_blank'
      );
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Détails de l'établissement"
        moduleId="sante"
        icon={Building}
      >
        <LoadingSkeleton />
      </PageLayout>
    );
  }

  if (!etablissement) {
    return (
      <PageLayout
        title="Établissement non trouvé"
        moduleId="sante"
        icon={Building}
      >
        <div className="p-4 text-center">
          <p>L'établissement demandé n'existe pas.</p>
        </div>
      </PageLayout>
    );
  }

  const categoryInfo = getCategoryInfo(etablissement.categorie?.nom || '');

  return (
    <PageLayout
      title={etablissement.nom}
      moduleId="sante"
      icon={Building}
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={\`flex items-center gap-1 \${categoryInfo.bgColor} \${categoryInfo.textColor}\`}
              >
                <categoryInfo.Icon size={12} />
                {etablissement.categorie?.nom}
              </Badge>
              {etablissement.urgences && (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  Urgences
                </Badge>
              )}
              {etablissement.garde_permanente && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  Garde permanente
                </Badge>
              )}
            </div>

            {etablissement.adresse && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{etablissement.adresse}</span>
              </div>
            )}

            {etablissement.horaires && (
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{etablissement.horaires}</span>
              </div>
            )}

            {etablissement.description && (
              <p className="text-sm text-muted-foreground">{etablissement.description}</p>
            )}

            {etablissement.services && etablissement.services.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Services :</span>
                <div className="flex flex-wrap gap-1">
                  {etablissement.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {etablissement.telephone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="flex-1"
                >
                  <Phone size={16} className="mr-1" />
                  Appeler
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleDirections}
                className="flex-1"
              >
                <MapPin size={16} className="mr-1" />
                Itinéraire
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}