import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Edit, Trash2, Calendar, FileText, Check, X } from "lucide-react";
import { associationService } from "@/services/associationService";
import { LoadingSkeleton } from "@/components/common";
import { AddExpenseForm } from "./AddExpenseForm";
import { EditExpenseForm } from "./EditExpenseForm";

interface ExpensesTabProps {
  associationId: string;
}

export function ExpensesTab({ associationId }: ExpensesTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const { data: expenses, isLoading, refetch } = useQuery({
    queryKey: ['association-expenses', associationId],
    queryFn: () => associationService.getDepenses(associationId)
  });

  const handleExpenseAdded = () => {
    setShowAddForm(false);
    refetch();
  };

  const handleExpenseUpdated = () => {
    setEditingExpense(null);
    refetch();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await associationService.deleteDepense(expenseId);
        refetch();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleApproveExpense = async (expenseId: string, approve: boolean) => {
    try {
      await associationService.updateDepense(expenseId, { approuve: approve });
      refetch();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton count={3} />;
  }

  if (showAddForm) {
    return (
      <AddExpenseForm 
        associationId={associationId}
        onSuccess={handleExpenseAdded}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingExpense) {
    return (
      <EditExpenseForm 
        expense={editingExpense}
        onSuccess={handleExpenseUpdated}
        onCancel={() => setEditingExpense(null)}
      />
    );
  }

  const totalExpenses = expenses?.reduce((sum, e) => sum + (e.montant || 0), 0) || 0;
  const approvedExpenses = expenses?.filter(e => e.approuve) || [];
  const pendingExpenses = expenses?.filter(e => !e.approuve) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des dépenses</h3>
          <p className="text-muted-foreground">
            Total: {totalExpenses}€ • {expenses?.length || 0} dépense(s) enregistrée(s)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle dépense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Dépenses approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedExpenses.reduce((sum, e) => sum + (e.montant || 0), 0)}€
            </div>
            <p className="text-sm text-muted-foreground">{approvedExpenses.length} dépense(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingExpenses.reduce((sum, e) => sum + (e.montant || 0), 0)}€
            </div>
            <p className="text-sm text-muted-foreground">{pendingExpenses.length} dépense(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total général</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}€</div>
            <p className="text-sm text-muted-foreground">{expenses?.length || 0} dépense(s)</p>
          </CardContent>
        </Card>
      </div>

      {!expenses || expenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Aucune dépense enregistrée</p>
            <Button onClick={() => setShowAddForm(true)}>
              Enregistrer la première dépense
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{expense.description}</CardTitle>
                      <Badge variant={expense.approuve ? 'default' : 'secondary'}>
                        {expense.approuve ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        {expense.approuve ? 'Approuvée' : 'En attente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(expense.date_depense).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <Badge variant="outline">{expense.categorie}</Badge>
                      {expense.justificatif_url && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Justificatif disponible</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xl font-bold">{expense.montant}€</div>
                    <div className="flex items-center gap-2">
                      {!expense.approuve && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveExpense(expense.id, true)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveExpense(expense.id, false)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExpense(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}