import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { Gift, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Materiel = Database['public']['Tables']['materiels']['Row'];

export default function MaterielsGestion() {
  const [activeTab, setActiveTab] = useState<'liste' | 'ajouter'>('liste');

  const { data: materiels = [], isLoading, refetch } = useQuery({
    queryKey: ['materiels-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materiels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Materiel[];
    },
  });

  const updateDisponibilite = async (id: string, disponible: boolean) => {
    const { error } = await supabase
      .from('materiels')
      .update({ disponible })
      .eq('id', id);

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    refetch();
  };

  const getStatusBadge = (disponible: boolean, quantite_disponible: number) => {
    if (!disponible) {
      return <Badge variant="secondary">Indisponible</Badge>;
    }
    if (quantite_disponible === 0) {
      return <Badge variant="destructive">Épuisé</Badge>;
    }
    return <Badge variant="default">Disponible ({quantite_disponible})</Badge>;
  };

  return (
    <PageLayout
      moduleId="admin-materiels"
      title="Gestion des Matériels"
      description="Gérer le stock et la disponibilité des équipements prêtés"
      icon={Gift}
      iconClassName="text-pink-600"
      activeTab={activeTab}
      onTabChange={(tab: string) => setActiveTab(tab as 'liste' | 'ajouter')}
      customTabs={[
        { value: 'liste', label: 'Matériels' },
        { value: 'ajouter', label: 'Ajouter' },
      ]}
      showAddButton={activeTab === 'liste'}
      onAddClick={() => setActiveTab('ajouter')}
      hasData={materiels.length > 0}
      loading={isLoading}
      listContent={
        <div className="space-y-4">
          {materiels.map((materiel) => (
            <Card key={materiel.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{materiel.nom}</CardTitle>
                    <p className="text-sm text-muted-foreground">{materiel.description}</p>
                  </div>
                  {getStatusBadge(materiel.disponible || false, materiel.quantite_disponible || 0)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Quantité totale:</span> {materiel.quantite_totale}
                  </div>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant={materiel.disponible ? "destructive" : "default"}
                      onClick={() => updateDisponibilite(materiel.id, !materiel.disponible)}
                    >
                      {materiel.disponible ? 'Rendre indisponible' : 'Rendre disponible'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }
      addContent={
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un nouveau matériel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Formulaire d'ajout de matériel à implémenter
            </p>
          </CardContent>
        </Card>
      }
    />
  );
}