import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, Calendar, CheckCircle, XCircle, Edit } from "lucide-react";
import { associationService, AssociationMembre } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";
import { AddMemberForm } from "./AddMemberForm";
import { EditMemberForm } from "./EditMemberForm";

interface MembersTabProps {
  associationId: string;
}

export function MembersTab({ associationId }: MembersTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<AssociationMembre | null>(null);

  const { data: members, isLoading, refetch } = useQuery({
    queryKey: ['association-members', associationId],
    queryFn: () => associationService.getMembers(associationId)
  });

  const handleMemberAdded = () => {
    setShowAddForm(false);
    refetch();
  };

  const handleMemberUpdated = () => {
    setEditingMember(null);
    refetch();
  };

  if (isLoading) {
    return <LoadingSkeleton count={3} />;
  }

  if (showAddForm) {
    return (
      <AddMemberForm 
        associationId={associationId}
        onSuccess={handleMemberAdded}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingMember) {
    return (
      <EditMemberForm 
        member={editingMember}
        onSuccess={handleMemberUpdated}
        onCancel={() => setEditingMember(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des membres</h3>
          <p className="text-muted-foreground">
            {members?.length || 0} membre(s) enregistré(s)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un membre
        </Button>
      </div>

      {!members || members.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Aucun membre enregistré</p>
            <Button onClick={() => setShowAddForm(true)}>
              Ajouter le premier membre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {member.prenom} {member.nom}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingMember(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge 
                    variant={member.cotisation_a_jour ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {member.cotisation_a_jour ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {member.cotisation_a_jour ? "À jour" : "En retard"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  {member.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.telephone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Adhésion: {new Date(member.date_adhesion).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {member.montant_cotisation > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Cotisation: {member.montant_cotisation}€
                      </p>
                      {member.dernier_paiement && (
                        <p className="text-xs text-muted-foreground">
                          Dernier paiement: {new Date(member.dernier_paiement).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}