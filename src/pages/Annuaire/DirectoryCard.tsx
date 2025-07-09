import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, User, MessageCircle, CheckCircle, Mail, UserPlus } from "lucide-react";
import { Professional } from "@/services/professionalService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function DirectoryCard({ professional }: { professional: Professional }) {
  const navigate = useNavigate();

  const handleStartConversation = () => {
    if (professional.user_id) {
      // Utiliser le vrai user_id si le professionnel est authentifié
      navigate(`/messages?userId=${professional.user_id}&userName=${encodeURIComponent(professional.nom)}`);
      toast({
        title: "Redirection vers la messagerie",
        description: `Conversation avec ${professional.nom}`
      });
    } else {
      // Professionnel non authentifié - pas de messagerie disponible
      toast({
        title: "Messagerie non disponible",
        description: "Ce professionnel n'a pas encore créé de compte utilisateur",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User size={20} className="text-purple-500" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{professional.nom}</CardTitle>
              {professional.is_verified && (
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
              {!professional.user_id && (
                <Badge variant="secondary" className="text-xs">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Peut se connecter
                </Badge>
              )}
            </div>
            {professional.surnom && (
              <p className="text-xs text-gray-500 italic">"{professional.surnom}"</p>
            )}
          </div>
          {professional.user_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartConversation}
              className="ml-auto"
            >
              <MessageCircle size={16} className="mr-1" />
              Message
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div>
          <span className="font-semibold text-secondary-purple">Domaine :</span>{" "}
          {professional.metier?.nom || ""}
        </div>
        <div>
          <span className="font-semibold">Base :</span> {professional.base}
        </div>
        <div className="flex items-center gap-1">
          <Phone size={14} className="text-purple-400" />
          <span>{professional.contact1}</span>
        </div>
        {professional.contact2 && (
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-purple-400" />
            <span>{professional.contact2}</span>
          </div>
        )}
        {professional.email && (
          <div className="flex items-center gap-1">
            <Mail size={14} className="text-purple-400" />
            <span className="text-xs">{professional.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}