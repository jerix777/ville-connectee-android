import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader, PageTitle } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Plus, Image, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getCatalogueCategories, deleteCatalogueCategory } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { CreateCategoryForm } from './components/CreateCategoryForm';
import { EditCategoryForm } from './components/EditCategoryForm';
import type { CatalogueCategorie } from '@/services/catalogueService';

export function CataloguePage() {
  const [categories, setCategories] = useState<CatalogueCategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CatalogueCategorie | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCatalogueCategories();
        setCategories(data as any);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les catégories du catalogue.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryCreated = (newCategory: CatalogueCategorie) => {
    setCategories(prev => [newCategory, ...prev]);
  };

  const handleCategoryUpdated = (updatedCategory: CatalogueCategorie) => {
    setCategories(prev => prev.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCatalogueCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie.",
        variant: "destructive",
      });
    }
  };

  const openEditCategory = (category: CatalogueCategorie) => {
    setSelectedCategory(category);
    setShowEditForm(true);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <PageTitle
          title="Catalogue d'idées"
          description="Parcourez les différentes catégories d'images."
          icon={Lightbulb}
        />
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Catégorie
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          categories.map((categorie) => (
            <Card key={categorie.id} className="hover:shadow-lg transition-shadow duration-300 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditCategory(categorie)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et supprimera également tous les éléments qu'elle contient.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(categorie.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to={`/catalogue/category/${categorie.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image size={20} />
                    {categorie.nom}
                  </CardTitle>
                  <CardDescription>{categorie.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {(categorie as any).catalogue_items?.[0]?.count || 0} éléments
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>
      <CreateCategoryForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCategoryCreated}
      />
      <EditCategoryForm
        category={selectedCategory}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSuccess={handleCategoryUpdated}
      />
    </MainLayout>
  );
}
