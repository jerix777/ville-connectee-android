import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemandeMateriel } from "@/services/materielsGratuitsService";
import { Phone, Calendar, Package, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

interface DemandeCardProps {
  demande: DemandeMateriel;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: "approuvee" | "rejetee") => void;
  onClick?: () => void;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'en_attente':
      return {
        icon: <Clock className="w-4 h-4" />,
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800'
      };
    case 'approuvee':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approuvée',
        color: 'bg-green-100 text-green-800'
      };
    case 'rejetee':
      return {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rejetée',
        color: 'bg-red-100 text-red-800'
      };
    default:
      return {
        icon: <Clock className="w-4 h-4" />,
        label: 'Statut inconnu',
        color: 'bg-gray-100 text-gray-800'
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

export const DemandeCard = ({ demande, isAdmin = false, onStatusChange, onClick }: DemandeCardProps) => {
  const statusInfo = getStatusInfo(demande.statut);
  const materielInfo = getMaterielInfo(demande.materiel_id);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string>("");

  const availableContacts = [
    demande.contact1 && { label: "Contact 1", value: demande.contact1 },
    demande.contact2 && { label: "Contact 2", value: demande.contact2 },
  ].filter(Boolean);

  const handleAppeler = () => {
    if (availableContacts.length === 1) {
      // Si un seul contact, appeler directement
      window.location.href = `tel:${availableContacts[0].value}`;
    } else if (availableContacts.length > 1) {
      // Si plusieurs contacts, afficher le sélecteur
      setShowContactSelector(true);
    } else {
      toast.error("Aucun numéro de contact disponible");
    }
  };

  const handleContactSelected = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact}`;
      setShowContactSelector(false);
      setSelectedContact("");
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour, concernant ma demande de matériel (${demande.reference}).`
    );
    const whatsappUrl = `https://wa.me/2250102030405?text=${message}`; // TODO: Remplacer par un numéro réel
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{materielInfo.icon}</span>
            <CardTitle className="text-lg font-semibold">
              {materielInfo.name}
            </CardTitle>
          </div>
          <Badge className={`${statusInfo.color} text-xs font-medium`}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          Référence: {demande.reference}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Demandé le:</span>
            <span className="font-medium">
              {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Quantité:</span>
            <span className="font-medium">{demande.quantite}</span>
          </div>
        </div>

        {demande.date_validation && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">Validé le:</span>
            <span className="font-medium text-green-600">
              {new Date(demande.date_validation).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        {demande.quantite_accordee && (
          <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">Quantité accordée:</span>
            <span className="font-medium text-green-600">{demande.quantite_accordee}</span>
          </div>
        )}

        {demande.justification && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Justification:</strong> {demande.justification}
            </p>
          </div>
        )}

        {demande.commentaires && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-800">
              <strong>Commentaires:</strong> {demande.commentaires}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          {isAdmin && demande.statut === "en_attente" && (
            <>
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => onStatusChange?.(demande.id, "approuvee")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onStatusChange?.(demande.id, "rejetee")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeter
              </Button>
            </>
          )}

          {!isAdmin && demande.statut === "approuvee" && (
            <>
              {showContactSelector ? (
                <div className="flex gap-2 w-full">
                  <Select value={selectedContact} onValueChange={setSelectedContact}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choisir un contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableContacts.map((contact) => (
                        <SelectItem key={contact.value} value={contact.value}>
                          {contact.label}: {contact.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="default"
                    onClick={handleContactSelected}
                    disabled={!selectedContact}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowContactSelector(false)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleAppeler}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleWhatsApp}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};