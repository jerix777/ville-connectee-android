import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface AnnouncementsTabProps {
  associationId: string;
}

export function AnnouncementsTab({ associationId }: AnnouncementsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Annonces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}