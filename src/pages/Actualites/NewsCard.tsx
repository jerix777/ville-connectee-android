
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { News } from "@/services/newsService";

interface NewsCardProps {
  news: News;
}
export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row md:justify-between">
          <span>{news.titre}</span>
          <span className="ml-2 inline-block text-xs rounded-full px-2 py-1 bg-ville-light text-ville-DEFAULT uppercase">{news.type}</span>
        </CardTitle>
        {news.auteur && 
          <CardDescription className="text-sm text-gray-500">
            Par {news.auteur}
          </CardDescription>
        }
        {news.publie_le && (
          <span className="text-xs text-gray-400">{format(new Date(news.publie_le), "PPP", { locale: fr })}</span>
        )}
      </CardHeader>
      <CardContent>
        {news.image_url && (
          <img src={news.image_url} alt="" className="w-full max-h-72 object-cover rounded mb-3" />
        )}
        <div className="whitespace-pre-line text-gray-800">{news.contenu}</div>
      </CardContent>
    </Card>
  );
}
