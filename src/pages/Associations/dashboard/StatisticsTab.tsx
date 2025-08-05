
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, MessageSquare } from "lucide-react";
import { associationService } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";

interface StatisticsTabProps {
  associationId: string;
}

export function StatisticsTab({ associationId }: StatisticsTabProps) {
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['association-members', associationId],
    queryFn: () => associationService.getMembers(associationId)
  });

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['association-expenses', associationId],
    queryFn: () => associationService.getDepenses(associationId)
  });

  if (loadingMembers || loadingExpenses) {
    return <LoadingSkeleton count={4} />;
  }

  const totalMembers = members?.length || 0;
  const membersUpToDate = members?.filter(m => m.cotisation_a_jour)?.length || 0;
  const membersOverdue = totalMembers - membersUpToDate;
  const totalCotisations = members?.reduce((sum, m) => sum + (m.montant_cotisation || 0), 0) || 0;
  const totalExpenses = expenses?.reduce((sum, e) => sum + (e.montant || 0), 0) || 0;
  const approvedExpenses = expenses?.filter(e => e.approuve)?.length || 0;
  const pendingExpenses = (expenses?.length || 0) - approvedExpenses;

  const cotisationStats = [
    {
      label: "À jour",
      count: membersUpToDate,
      percentage: totalMembers > 0 ? Math.round((membersUpToDate / totalMembers) * 100) : 0,
      color: "bg-green-500"
    },
    {
      label: "En retard",
      count: membersOverdue,
      percentage: totalMembers > 0 ? Math.round((membersOverdue / totalMembers) * 100) : 0,
      color: "bg-red-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <div className="font-bold">Membres</div>
              <div>{totalMembers} membres</div>
              <div className="text-xs text-muted-foreground">{membersUpToDate} à jour, {membersOverdue} en retard</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-bold">Cotisations</div>
              <div>{totalCotisations} €</div>
              <div className="text-xs text-muted-foreground">Total collecté</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded">
            <DollarSign className="h-6 w-6 text-orange-600" />
            <div>
              <div className="font-bold">Dépenses</div>
              <div>{totalExpenses} €</div>
              <div className="text-xs text-muted-foreground">{pendingExpenses} en attente</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <div>
              <div className="font-bold">Annonces</div>
              {/* À compléter si tu veux afficher le nombre d'annonces */}
              <div>—</div>
              <div className="text-xs text-muted-foreground">Publications actives</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

