import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Image as ImageIcon, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getCatalogueItems, getCatalogueCategories, deleteCatalogueItem } from '@/services/catalogueService';
import { toast } from '@/hooks/use-toast';
import { CreateItemForm } from './components/CreateItemForm';
import { EditItemForm } from './components/EditItemForm';
import type { CatalogueItem, CatalogueCategorie } from '@/services/catalogueService';

export function CategorieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [category, setCategory] = useState<CatalogueCategorie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);

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

  const handleItemUpdated = (updatedItem: CatalogueItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteCatalogueItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Élément supprimé",
        description: "L'élément a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément.",
        variant: "destructive",
      });
    }
  };

  const openEditItem = (item: CatalogueItem) => {
    setSelectedItem(item);
    setShowEditForm(true);
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
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditItem(item)}>
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
                          <AlertDialogTitle>Supprimer l'élément</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <img
                src={item.image_url || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
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
      <EditItemForm
        item={selectedItem}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSuccess={handleItemUpdated}
      />
    </MainLayout>
  );
}
