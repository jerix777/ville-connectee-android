import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { ModuleVisibilityProvider } from './contexts/ModuleVisibilityContext';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

// Actualités & Événements
import Actualites from './pages/Actualites';
import NewsDetailPage from './pages/Actualites/NewsDetailPage';
import Evenements from './pages/Evenements';
import EventDetailPage from './pages/Evenements/EventDetailPage';

// Immobilier & Marché
import Immobilier from './pages/Immobilier';
import ImmobilierDetailPage from './pages/Immobilier/ImmobilierDetailPage';
import Marche from './pages/Marche';
import MarketItemDetailPage from './pages/Marche/MarketItemDetailPage';

// Services
import Services from './pages/Services';
import ServiceDetailPage from './pages/Services/ServiceDetailPage';
import AppelsRapides from './pages/AppelsRapides';
import Annuaire from './pages/Annuaire';
import MyProfile from './pages/Annuaire/MyProfile';

// Santé & Carburant
import SanteProximite from './pages/SanteProximite';
import EtablissementDetailPage from './pages/SanteProximite/EtablissementDetailPage';
import CarburantGaz from './pages/CarburantGaz';

// Restauration & Hôtellerie
import MaquisResto from './pages/MaquisResto';
import Hotelerie from './pages/Hotelerie';

// Transport
import Taxi from './pages/Taxi';
import TaxiCommunal from './pages/TaxiCommunal';

// Emploi & Main d'oeuvre
import Emplois from './pages/Emplois';
import MainDoeuvre from './pages/MainDoeuvre';

// Associations & Villages
import Associations from './pages/Associations';
import AssociationDashboard from './pages/Associations/AssociationDashboard';
import Villages from './pages/Villages';

// Autres
import Annonces from './pages/Annonces';
import Necrologie from './pages/Necrologie';
import Souvenirs from './pages/Souvenirs';
import Tribune from './pages/Tribune';
import Suggestions from './pages/Suggestions';
import Alertes from './pages/Alertes';

// Matériels Gratuits
import MaterielsGratuits from './pages/MaterielsGratuits';
import DemandeDetailPage from './pages/MaterielsGratuits/DemandeDetailPage';
import MaterielsGestion from './pages/Admin/MaterielsGestion';

// Radio & Jukebox
import Radio from './pages/Radio';
import { JukeboxPage as Jukebox } from './pages/Jukebox';

// Catalogue
import { CataloguePage as Catalogue } from './pages/Catalogue';
import { CategorieDetailsPage } from './pages/Catalogue/CategorieDetailsPage';

// Steve Yobouet
import SteveYobouet from './pages/SteveYobouet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <ModuleVisibilityProvider>
            <Router>
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
            </Router>
            <Toaster position="top-right" />
          </ModuleVisibilityProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
