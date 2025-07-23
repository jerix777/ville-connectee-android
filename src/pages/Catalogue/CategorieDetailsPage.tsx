import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getCatalogueItems, getCatalogueCategories } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { CreateItemForm } from './components/CreateItemForm';
import type { CatalogueItem, CatalogueCategorie } from '@/services/catalogueService';

export function CategorieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [category, setCategory] = useState<CatalogueCategorie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          getCatalogueItems(id),
          getCatalogueCategories(),
        ]);
        setItems(itemsData as any);
        const currentCategory = (categoriesData as any[]).find(c => c.id === id);
        setCategory(currentCategory);
      } catch (error) {
        console.error("Erreur lors du chargement des détails de la catégorie:", error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetails();
  }, [id]);

  const handleItemCreated = (newItem: CatalogueItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/catalogue">
            <Button variant="outline" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          {category && (
            <PageTitle
              title={category.nom}
              description={category.description || ''}
              icon={ImageIcon}
            />
          )}
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un élément
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="aspect-square">
              <div className="h-full bg-gray-200 rounded-lg"></div>
            </Card>
          ))
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <img
                src={item.image_url}
                alt={item.titre}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold text-lg">{item.titre}</h3>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            </Card>
          ))
        )}
      </div>
      {id && (
        <CreateItemForm
          categoryId={id}
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          onSuccess={handleItemCreated}
        />
      )}
    </MainLayout>
  );
}
