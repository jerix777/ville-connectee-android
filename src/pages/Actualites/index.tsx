
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { getNews, News } from "@/services/newsService";
import { NewsCard } from "./NewsCard";
import { AddNewsForm } from "./AddNewsForm";
import { Toaster } from "@/components/ui/toaster";

export default function ActualitesPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getNews();
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Formulaire d’ajout pour admin (ici rendu pour tous, personnaliser si besoin plus tard) */}
        <AddNewsForm onAdded={refresh} />

        <h1 className="text-2xl font-bold mb-6 mt-3">Actualités & Communiqués</h1>

        {loading && <div>Chargement...</div>}
        {!loading && news.length === 0 && (
          <div className="text-gray-600">Aucun article pour le moment.</div>
        )}
        <div>
          {news.map((item) => (
            <NewsCard news={item} key={item.id}/>
          ))}
        </div>
      </div>
      <Toaster />
    </MainLayout>
  );
}
