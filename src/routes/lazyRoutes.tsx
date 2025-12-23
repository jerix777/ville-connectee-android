import { lazy } from 'react';

// Pages principales - Chargement prioritaire
export const Index = lazy(() => import('@/pages/Index'));
export const NotFound = lazy(() => import('@/pages/NotFound'));
export const Auth = lazy(() => import('@/pages/Auth'));

// Messages et Settings
export const Messages = lazy(() => import('@/pages/Messages'));
export const Settings = lazy(() => import('@/pages/Settings'));

// Actualités & Événements
export const Actualites = lazy(() => import('@/pages/Actualites'));
export const NewsDetailPage = lazy(() => import('@/pages/Actualites/NewsDetailPage'));
export const Evenements = lazy(() => import('@/pages/Evenements'));
export const EventDetailPage = lazy(() => import('@/pages/Evenements/EventDetailPage'));

// Immobilier & Marché
export const Immobilier = lazy(() => import('@/pages/Immobilier'));
export const ImmobilierDetailPage = lazy(() => import('@/pages/Immobilier/ImmobilierDetailPage'));
export const Marche = lazy(() => import('@/pages/Marche'));
export const MarketItemDetailPage = lazy(() => import('@/pages/Marche/MarketItemDetailPage'));

// Services
export const Services = lazy(() => import('@/pages/Services'));
export const ServiceDetailPage = lazy(() => import('@/pages/Services/ServiceDetailPage'));
export const AppelsRapides = lazy(() => import('@/pages/AppelsRapides'));
export const Annuaire = lazy(() => import('@/pages/Annuaire'));
export const MyProfile = lazy(() => import('@/pages/Annuaire/MyProfile'));

// Santé & Carburant
export const SanteProximite = lazy(() => import('@/pages/SanteProximite'));
export const EtablissementDetailPage = lazy(() => import('@/pages/SanteProximite/EtablissementDetailPage'));
export const CarburantGaz = lazy(() => import('@/pages/CarburantGaz'));

// Restauration & Hôtellerie
export const MaquisResto = lazy(() => import('@/pages/MaquisResto'));
export const Hotelerie = lazy(() => import('@/pages/Hotelerie'));

// Transport
export const Taxi = lazy(() => import('@/pages/Taxi'));
export const TaxiCommunal = lazy(() => import('@/pages/TaxiCommunal'));

// Emploi & Main d'oeuvre
export const Emplois = lazy(() => import('@/pages/Emplois'));
export const MainDoeuvre = lazy(() => import('@/pages/MainDoeuvre'));

// Associations & Villages
export const Associations = lazy(() => import('@/pages/Associations'));
export const AssociationDashboard = lazy(() => import('@/pages/Associations/AssociationDashboard'));
export const Villages = lazy(() => import('@/pages/Villages'));

// Autres
export const Annonces = lazy(() => import('@/pages/Annonces'));
export const Necrologie = lazy(() => import('@/pages/Necrologie'));
export const Souvenirs = lazy(() => import('@/pages/Souvenirs'));
export const Tribune = lazy(() => import('@/pages/Tribune'));
export const Suggestions = lazy(() => import('@/pages/Suggestions'));
export const Alertes = lazy(() => import('@/pages/Alertes'));

// Matériels Gratuits
export const MaterielsGratuits = lazy(() => import('@/pages/MaterielsGratuits'));
export const DemandeDetailPage = lazy(() => import('@/pages/MaterielsGratuits/DemandeDetailPage'));
export const MaterielsGestion = lazy(() => import('@/pages/Admin/MaterielsGestion'));

// Radio & Jukebox
export const Radio = lazy(() => import('@/pages/Radio'));
export const Jukebox = lazy(() => 
  import('@/pages/Jukebox').then(module => ({ default: module.JukeboxPage }))
);

// Catalogue
export const Catalogue = lazy(() => 
  import('@/pages/Catalogue').then(module => ({ default: module.CataloguePage }))
);
export const CategorieDetailsPage = lazy(() => 
  import('@/pages/Catalogue/CategorieDetailsPage').then(module => ({ default: module.CategorieDetailsPage }))
);

// Steve Yobouet
export const SteveYobouet = lazy(() => import('@/pages/SteveYobouet'));
