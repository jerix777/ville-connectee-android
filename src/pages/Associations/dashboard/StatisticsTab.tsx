
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import { TrendingUp, Users, DollarSign, MessageSquare } from "lucide-react";
=======
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Euro, AlertCircle, CheckCircle } from "lucide-react";
import { associationService } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";
>>>>>>> c6af4b3e3c646733aa07faa2fd5d7ff5b80771f6

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
<<<<<<< HEAD
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
              <div>{statistics?.totalMembres ?? 0} membres</div>
              <div className="text-xs text-muted-foreground">{statistics?.membresAJour ?? 0} à jour, {statistics?.membresEnRetard ?? 0} en retard</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-bold">Cotisations</div>
              <div>{statistics?.totalCotisations ?? 0} €</div>
              <div className="text-xs text-muted-foreground">Total collecté</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded">
            <DollarSign className="h-6 w-6 text-orange-600" />
            <div>
              <div className="font-bold">Dépenses</div>
              <div>{statistics?.totalDepenses ?? 0} €</div>
              <div className="text-xs text-muted-foreground">{statistics?.depensesEnAttente ?? 0} en attente</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <div>
              <div className="font-bold">Annonces</div>
              <div>{statistics?.totalAnnonces ?? 0} annonces</div>
              <div className="text-xs text-muted-foreground">Publications actives</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
=======
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
>>>>>>> c6af4b3e3c646733aa07faa2fd5d7ff5b80771f6
  );
}