import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
        <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}