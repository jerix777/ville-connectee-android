import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/services/newsService";
import { MainLayout } from "@/components/layout/MainLayout";
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      if (!id) throw new Error('ID manquant');
      const allNews = await getNews();
      return allNews.find(n => n.id === id);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <DetailPageHeader title="Détail de l'actualité" />
        <LoadingSkeleton />
      </MainLayout>
    );
  }

  if (error || !news) {
    return (
      <MainLayout>
        <DetailPageHeader title="Actualité non trouvée" />
        <div className="p-4 text-center">
          <p>Cette actualité n'existe pas ou a été supprimée.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailPageHeader title="Détail de l'actualité" />
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between gap-2">
              <CardTitle className="text-xl">{news.titre}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {news.type}
              </Badge>
            </div>
            {news.auteur && (
              <p className="text-muted-foreground">Par {news.auteur}</p>
            )}
            {news.publie_le && (
              <p className="text-sm text-muted-foreground">
                Publié le {format(new Date(news.publie_le), "PPP", { locale: fr })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {news.image_url && (
              <img 
                src={news.image_url} 
                alt={news.titre}
                className="w-full max-h-96 object-cover rounded-lg mb-4"
              />
            )}
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {news.contenu}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}