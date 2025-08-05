import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Euro, AlertCircle, CheckCircle } from "lucide-react";
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotisations Collectées</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCotisations}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalCotisations - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalCotisations - totalExpenses}€
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              État des Cotisations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cotisationStats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stat.count} membre(s)
                    </span>
                    <Badge variant="outline">{stat.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stat.color}`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Gestion des Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Dépenses approuvées</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {approvedExpenses}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">En attente d'approbation</span>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                {pendingExpenses}
              </Badge>
            </div>

            {members && members.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Membres en retard de cotisation</h4>
                <div className="space-y-2">
                  {members
                    .filter(m => !m.cotisation_a_jour)
                    .slice(0, 3)
                    .map((member) => (
                      <div key={member.id} className="flex items-center justify-between text-sm">
                        <span>{member.prenom} {member.nom}</span>
                        <Badge variant="destructive" className="text-xs">
                          En retard
                        </Badge>
                      </div>
                    ))}
                  {membersOverdue > 3 && (
                    <p className="text-xs text-muted-foreground">
                      Et {membersOverdue - 3} autre(s)...
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}