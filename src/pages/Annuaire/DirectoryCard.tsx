import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, User, MessageCircle } from "lucide-react";
import { Professional } from "@/services/professionalService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function DirectoryCard({ professional }: { professional: Professional }) {
  const navigate = useNavigate();

  const handleStartConversation = () => {
    // Pour l'instant, on simule un ID utilisateur basé sur le nom du professionnel
    // Dans un vrai scénario, il faudrait avoir un vrai ID utilisateur
    const userId = `user_${professional.id}`;
    navigate(`/messages?userId=${userId}&userName=${encodeURIComponent(professional.nom)}`);
    toast({
      title: "Redirection vers la messagerie",
      description: `Conversation avec ${professional.nom}`
    });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User size={20} className="text-purple-500" />
          <div className="flex-1">
            <CardTitle className="text-lg">{professional.nom}</CardTitle>
            {professional.surnom && (
              <p className="text-xs text-gray-500 italic">"{professional.surnom}"</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartConversation}
            className="ml-auto"
          >
            <MessageCircle size={16} className="mr-1" />
            Message
          </Button>
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
      </CardContent>
    </Card>
  );
}