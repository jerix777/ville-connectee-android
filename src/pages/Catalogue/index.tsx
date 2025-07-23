import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader, PageTitle } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image } from 'lucide-react';
import { getCatalogueCategories } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { CreateCategoryForm } from './components/CreateCategoryForm';
import type { CatalogueCategorie } from '@/services/catalogueService';

export function CataloguePage() {
  const [categories, setCategories] = useState<CatalogueCategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <PageTitle
          title="Catalogue"
          description="Parcourez les différentes catégories d'images."
          icon={Image}
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
            <Link to={`/catalogue/${categorie.id}`} key={categorie.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image size={20} />
                    {categorie.nom}
                  </CardTitle>
                  <CardDescription>{categorie.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {/* @ts-ignore */}
                    {categorie.catalogue_items[0]?.count || 0} éléments
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      <CreateCategoryForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCategoryCreated}
      />
    </MainLayout>
  );
}
