import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface ExpensesTabProps {
  associationId: string;
}

export function ExpensesTab({ associationId }: ExpensesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Dépenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}