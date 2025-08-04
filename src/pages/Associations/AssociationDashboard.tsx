import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  MessageSquare,
  UserPlus,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { associationService } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";
import { MembersTab } from "./dashboard/MembersTab";
import { AnnouncementsTab } from "./dashboard/AnnouncementsTab";
import { StatisticsTab } from "./dashboard/StatisticsTab";
import { ExpensesTab } from "./dashboard/ExpensesTab";

export default function AssociationDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("membres");

  const { data: association, isLoading, error } = useQuery({
    queryKey: ['association', id],
    queryFn: () => associationService.getById(id!),
    enabled: !!id
  });

  const { data: statistics } = useQuery({
    queryKey: ['association-statistics', id],
    queryFn: () => associationService.getStatistics(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !association) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Association introuvable</p>
          <Button variant="outline" onClick={() => navigate('/associations')} className="mt-4">
            Retour aux associations
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Membres",
      value: statistics?.totalMembres || 0,
      icon: Users,
      description: `${statistics?.membresAJour || 0} à jour, ${statistics?.membresEnRetard || 0} en retard`,
      color: "text-blue-600"
    },
    {
      title: "Cotisations",
      value: `${statistics?.totalCotisations || 0}€`,
      icon: DollarSign,
      description: "Total collecté",
      color: "text-green-600"
    },
    {
      title: "Dépenses",
      value: `${statistics?.totalDepenses || 0}€`,
      icon: TrendingUp,
      description: `${statistics?.depensesEnAttente || 0} en attente`,
      color: "text-orange-600"
    },
    {
      title: "Annonces",
      value: statistics?.totalAnnonces || 0,
      icon: MessageSquare,
      description: "Publications actives",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/associations')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux associations
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {association.logo_url ? (
              <img 
                src={association.logo_url} 
                alt={association.nom}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{association.nom}</h1>
              <p className="text-muted-foreground mt-1">{association.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={association.statut === 'active' ? 'default' : 'outline'}>
                  {association.statut}
                </Badge>
                <Badge variant="secondary">
                  {association.nombre_membres} membres
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="membres">Membres</TabsTrigger>
          <TabsTrigger value="annonces">Annonces</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
        </TabsList>

        <TabsContent value="membres">
          <MembersTab associationId={association.id} />
        </TabsContent>

        <TabsContent value="annonces">
          <AnnouncementsTab associationId={association.id} />
        </TabsContent>

        <TabsContent value="statistiques">
          <StatisticsTab associationId={association.id} statistics={statistics} />
        </TabsContent>

        <TabsContent value="depenses">
          <ExpensesTab associationId={association.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}