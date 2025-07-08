import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getNews, News } from "@/services/newsService";
import { NewsCard } from "./NewsCard";
import { AddNewsForm } from "./AddNewsForm";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Newspaper, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function ActualitesPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const refresh = async () => {
    setLoading(true);
    const data = await getNews();
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch = !searchQuery || 
      item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.auteur && item.auteur.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedNews,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: filteredNews,
    itemsPerPage: 6,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Newspaper className="mr-2" />
              Actualités & Communiqués
            </h1>
            <p className="text-gray-500 mt-1">
              Suivez les dernières nouvelles et annonces de la communauté
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "liste" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher une actualité..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("ajouter");
                }}
                className="whitespace-nowrap"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredNews.length > 0 ? (
              <div>
                <div className="space-y-6">
                  {paginatedNews.map((item) => (
                    <NewsCard news={item} key={item.id}/>
                  ))}
                </div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                />
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucune actualité trouvée.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "ajouter" && (
          <AddNewsForm onAdded={refresh} />
        )}
      </div>
      <Toaster />
    </MainLayout>
  );
}