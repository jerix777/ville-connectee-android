import { Suspense, memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { ModuleVisibilityProvider } from './contexts/ModuleVisibilityContext';
import { PageLoader } from './components/common/PageLoader';

// Lazy loaded routes
import {
  Index,
  NotFound,
  Auth,
  Messages,
  Settings,
  Actualites,
  NewsDetailPage,
  Evenements,
  EventDetailPage,
  Immobilier,
  ImmobilierDetailPage,
  Marche,
  MarketItemDetailPage,
  Services,
  ServiceDetailPage,
  AppelsRapides,
  Annuaire,
  MyProfile,
  SanteProximite,
  EtablissementDetailPage,
  CarburantGaz,
  MaquisResto,
  Hotelerie,
  Taxi,
  TaxiCommunal,
  Emplois,
  MainDoeuvre,
  Associations,
  AssociationDashboard,
  Villages,
  Annonces,
  Necrologie,
  Souvenirs,
  Tribune,
  Suggestions,
  Alertes,
  MaterielsGratuits,
  DemandeDetailPage,
  MaterielsGestion,
  Radio,
  Jukebox,
  Catalogue,
  CategorieDetailsPage,
  SteveYobouet,
} from './routes/lazyRoutes';

// Configuration optimisée du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Composant mémorisé pour les routes
const AppRoutes = memo(function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Auth */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />

      {/* Actualités & Événements */}
      <Route path="/actualites" element={<Actualites />} />
      <Route path="/actualites/:id" element={<NewsDetailPage />} />
      <Route path="/evenements" element={<Evenements />} />
      <Route path="/evenements/:id" element={<EventDetailPage />} />

      {/* Immobilier & Marché */}
      <Route path="/immobilier" element={<Immobilier />} />
      <Route path="/immobilier/:id" element={<ImmobilierDetailPage />} />
      <Route path="/marche" element={<Marche />} />
      <Route path="/marche/:id" element={<MarketItemDetailPage />} />

      {/* Services */}
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/appels-rapides" element={<AppelsRapides />} />
      <Route path="/annuaire" element={<Annuaire />} />
      <Route path="/annuaire/mon-profil" element={<MyProfile />} />

      {/* Santé & Carburant */}
      <Route path="/sante-proximite" element={<SanteProximite />} />
      <Route path="/sante-proximite/:id" element={<EtablissementDetailPage />} />
      <Route path="/carburant-gaz" element={<CarburantGaz />} />

      {/* Restauration & Hôtellerie */}
      <Route path="/maquis-resto" element={<MaquisResto />} />
      <Route path="/hotelerie" element={<Hotelerie />} />

      {/* Transport */}
      <Route path="/taxi" element={<Taxi />} />
      <Route path="/taxi-communal" element={<TaxiCommunal />} />

      {/* Emploi & Main d'oeuvre */}
      <Route path="/emplois" element={<Emplois />} />
      <Route path="/main-doeuvre" element={<MainDoeuvre />} />

      {/* Associations & Villages */}
      <Route path="/associations" element={<Associations />} />
      <Route path="/associations/:id" element={<AssociationDashboard />} />
      <Route path="/villages" element={<Villages />} />

      {/* Autres */}
      <Route path="/annonces" element={<Annonces />} />
      <Route path="/necrologie" element={<Necrologie />} />
      <Route path="/souvenirs" element={<Souvenirs />} />
      <Route path="/tribune" element={<Tribune />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/alertes" element={<Alertes />} />

      {/* Matériels Gratuits */}
      <Route path="/materiels-gratuits" element={<MaterielsGratuits />} />
      <Route path="/materiels-gratuits/demande/:id" element={<DemandeDetailPage />} />

      {/* Admin */}
      <Route path="/admin/materiels" element={<MaterielsGestion />} />

      {/* Radio & Jukebox */}
      <Route path="/radio" element={<Radio />} />
      <Route path="/jukebox" element={<Jukebox />} />

      {/* Catalogue */}
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/catalogue/:id" element={<CategorieDetailsPage />} />

      {/* Steve Yobouet */}
      <Route path="/steve-yobouet" element={<SteveYobouet />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <ModuleVisibilityProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </Router>
            <Toaster position="top-right" richColors closeButton />
          </ModuleVisibilityProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
