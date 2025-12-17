import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/common/PageLayout';
import { Gift, ArrowLeft, Calendar, Package, User, Phone, MapPin, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { materielsGratuitsService, type DemandeMateriel } from '@/services/materielsGratuitsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function DemandeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email?.includes("admin");

  const { data: demande, isLoading, refetch } = useQuery({
    queryKey: ['demande-detail', id],
    queryFn: async () => {
      const demandes = await materielsGratuitsService.getDemandes();
      return demandes.find(d => d.id === id);
    },
    enabled: !!id,
  });

  const handleStatutChange = async (statut: "approuvee" | "rejetee") => {
    if (!demande) return;

    try {
      await materielsGratuitsService.updateStatut(demande.id, statut, user?.id || "", `Demande ${statut === "approuvee" ? "approuvée" : "rejetée"}`);
      toast.success(`Demande ${statut === "approuvee" ? "approuvée" : "rejetée"}`);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'en_attente':
        return {
          icon: <Clock className="w-5 h-5" />,
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'approuvee':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Approuvée',
          color: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rejetee':
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: 'Rejetée',
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          label: 'Statut inconnu',
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const getMaterielInfo = (materielId: string | number) => {
    const materiels: Record<string | number, { name: string; icon: string }> = {
      1: { name: 'Mégaphone', icon: '🎤' },
      2: { name: 'Sonorisation', icon: '🔊' },
      3: { name: 'Chaises', icon: '🪑' },
      4: { name: 'Bâche', icon: '⛺' },
    };
    return materiels[materielId] || { name: 'Matériel inconnu', icon: '❓' };
  };

  if (!demande) {
    return (
      <PageLayout
        moduleId="demande-detail"
        title="Demande introuvable"
        description="La demande demandée n'existe pas ou a été supprimée"
        icon={Gift}
        iconClassName="text-pink-600"
        activeTab="detail"
        onTabChange={() => {}}
        hasData={false}
        listContent={
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">Demande introuvable</p>
              <Button onClick={() => navigate('/materiels-gratuits')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux demandes
              </Button>
            </CardContent>
          </Card>
        }
      />
    );
  }

  const statusInfo = getStatusInfo(demande.statut);
  const materielInfo = getMaterielInfo(demande.materiel_id);

  return (
    <PageLayout
      moduleId="demande-detail"
      title={`Demande ${demande.reference}`}
      description="Détails de la demande de matériel"
      icon={Gift}
      iconClassName="text-pink-600"
      activeTab="detail"
      onTabChange={() => {}}
      hasData={true}
      listContent={
        <div className="space-y-6">
          {/* Bouton retour */}
          <Button
            variant="outline"
            onClick={() => navigate('/materiels-gratuits')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux demandes
          </Button>

          {/* Statut */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Statut de la demande</CardTitle>
                <Badge className={`${statusInfo.color} border`}>
                  {statusInfo.icon}
                  <span className="ml-2">{statusInfo.label}</span>
                </Badge>
              </div>
            </CardHeader>
            {isAdmin && demande.statut === "en_attente" && (
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatutChange("approuvee")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatutChange("rejetee")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{materielInfo.icon}</span>
                {materielInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Quantité demandée:</span>
                  <span className="font-medium">{demande.quantite}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date de demande:</span>
                  <span className="font-medium">
                    {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {demande.quantite_accordee && (
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Quantité accordée: </span>
                  <span className="font-medium text-green-600">{demande.quantite_accordee}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Événement */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {demande.date_debut_evenement && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Début:</span>
                    <span className="font-medium">
                      {new Date(demande.date_debut_evenement).toLocaleDateString('fr-FR')}
                      {demande.heure_debut_evenement && ` à ${demande.heure_debut_evenement}`}
                    </span>
                  </div>
                )}
                {demande.date_fin_evenement && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Fin:</span>
                    <span className="font-medium">
                      {new Date(demande.date_fin_evenement).toLocaleDateString('fr-FR')}
                      {demande.heure_fin_evenement && ` à ${demande.heure_fin_evenement}`}
                    </span>
                  </div>
                )}
              </div>
              {demande.lieu_evenement && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Lieu:</span>
                  <span className="font-medium">{demande.lieu_evenement}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Demandeur:</span>
                <span className="font-medium">{demande.nom_demandeur}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {demande.contact1 && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact 1:</span>
                    <a href={`tel:${demande.contact1}`} className="font-medium text-blue-600 hover:underline">
                      {demande.contact1}
                    </a>
                  </div>
                )}
                {demande.contact2 && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact 2:</span>
                    <a href={`tel:${demande.contact2}`} className="font-medium text-blue-600 hover:underline">
                      {demande.contact2}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Justification et commentaires */}
          {demande.justification && (
            <Card>
              <CardHeader>
                <CardTitle>Justification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{demande.justification}</p>
              </CardContent>
            </Card>
          )}

          {demande.commentaires && (
            <Card>
              <CardHeader>
                <CardTitle>Commentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{demande.commentaires}</p>
              </CardContent>
            </Card>
          )}

          {/* Validation */}
          {demande.date_validation && demande.valide_par && (
            <Card>
              <CardHeader>
                <CardTitle>Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Validé le {new Date(demande.date_validation).toLocaleDateString('fr-FR')} par {demande.valide_par}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      }
    />
  );
}