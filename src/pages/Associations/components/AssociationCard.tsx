import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Calendar, DollarSign, Eye, Edit, Trash2 } from "lucide-react";
import { Association } from "@/services/associationService";

interface AssociationCardProps {
  association: Association;
  onEdit?: (association: Association) => void;
  onDelete?: (associationId: string) => void;
  canManage?: boolean;
}

export function AssociationCard({ association, onEdit, onDelete, canManage = false }: AssociationCardProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/associations/${association.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(association);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(association.id);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {association.logo_url ? (
              <img 
                src={association.logo_url} 
                alt={association.nom}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {association.nom}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {association.nombre_membres} membres
                </Badge>
                <Badge 
                  variant={association.statut === 'active' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {association.statut}
                </Badge>
              </div>
            </div>
          </div>
          
          {canManage && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3">
          {association.description}
        </CardDescription>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Créée le {new Date(association.date_creation).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Contact: {association.contact}</span>
          </div>
        </div>

        <Button 
          onClick={handleView}
          variant="outline" 
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
}