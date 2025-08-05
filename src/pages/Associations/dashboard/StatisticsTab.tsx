
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, MessageSquare } from "lucide-react";

interface StatisticsTabProps {
  associationId: string;
  statistics?: any;
}

export function StatisticsTab({ associationId, statistics }: StatisticsTabProps) {
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
  );
}