
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EvenementsPage from "./pages/Evenements";
import MainDoeuvrePage from "./pages/MainDoeuvre";
import MarchePage from "./pages/Marche";
import ActualitesPage from "./pages/Actualites";
import EmploisPage from "./pages/Emplois";
import AnnuairePage from "./pages/Annuaire";
import MyProfilePage from "./pages/Annuaire/MyProfile";
import AssociationsPage from "./pages/Associations";
import ImmobilierPage from "./pages/Immobilier";
import AlertesPage from "./pages/Alertes";
import AnnoncesPage from "./pages/Annonces";
import VillagesPage from "./pages/Villages";
import NecrologiePage from "./pages/Necrologie";
import SouvenirsPage from "./pages/Souvenirs";
import TribunePage from "./pages/Tribune";
import SuggestionsPage from "./pages/Suggestions";
import ServicesPage from "./pages/Services";
import AuthPage from "./pages/Auth";
import SettingsPage from "./pages/Settings";
import MessagesPage from "./pages/Messages";
import { JukeboxPage } from "./pages/Jukebox";
import NewsDetailPage from "./pages/Actualites/NewsDetailPage";
import EventDetailPage from "./pages/Evenements/EventDetailPage";
import ImmobilierDetailPage from "./pages/Immobilier/ImmobilierDetailPage";
import ServiceDetailPage from "./pages/Services/ServiceDetailPage";
import MarketItemDetailPage from "./pages/Marche/MarketItemDetailPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useUpdateChecker();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/evenements" element={<EvenementsPage />} />
          <Route path="/main-doeuvre" element={<MainDoeuvrePage />} />
          <Route path="/marche" element={<MarchePage />} />
          <Route path="/emplois" element={<EmploisPage />} />
          <Route path="/annuaire" element={<AnnuairePage />} />
          <Route path="/annuaire/mon-profil" element={<MyProfilePage />} />
          <Route path="/associations" element={<AssociationsPage />} />
          <Route path="/immobilier" element={<ImmobilierPage />} />
          <Route path="/alertes" element={<AlertesPage />} />
          <Route path="/annonces" element={<AnnoncesPage />} />
          <Route path="/villages" element={<VillagesPage />} />
          <Route path="/necrologie" element={<NecrologiePage />} />
          <Route path="/souvenirs" element={<SouvenirsPage />} />
          <Route path="/tribune" element={<TribunePage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/jukebox" element={<JukeboxPage />} />
          <Route path="/actualites/:id" element={<NewsDetailPage />} />
          <Route path="/evenements/:id" element={<EventDetailPage />} />
          <Route path="/immobilier/:id" element={<ImmobilierDetailPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/marche/:id" element={<MarketItemDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
