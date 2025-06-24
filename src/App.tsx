
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import { ROUTES } from "@/config/constants";

// Pages
import IndexPage from "@/pages/Index";
import AuthPage from "@/pages/Auth";
import ActualitesPage from "@/pages/Actualites";
import EvenementsPage from "@/pages/Evenements";
import MainDoeuvrePage from "@/pages/MainDoeuvre";
import MarchePage from "@/pages/Marche";
import EmploisPage from "@/pages/Emplois";
import AnnuairePage from "@/pages/Annuaire";
import AssociationsPage from "@/pages/Associations";
import ImmobilierPage from "@/pages/Immobilier";
import AlertesPage from "@/pages/Alertes";
import AnnoncesPage from "@/pages/Annonces";
import ServicesPage from "@/pages/Services";
import VillagesPage from "@/pages/Villages";
import NecrologiePage from "@/pages/Necrologie";
import SouvenirsPage from "@/pages/Souvenirs";
import TribunePage from "@/pages/Tribune";
import SuggestionsPage from "@/pages/Suggestions";
import NotFoundPage from "@/pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<IndexPage />} />
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route path={ROUTES.ACTUALITES} element={<ActualitesPage />} />
      <Route path={ROUTES.EVENEMENTS} element={<EvenementsPage />} />
      <Route path={ROUTES.MAIN_DOEUVRE} element={<MainDoeuvrePage />} />
      <Route path={ROUTES.MARCHE} element={<MarchePage />} />
      <Route path={ROUTES.EMPLOIS} element={<EmploisPage />} />
      <Route path={ROUTES.ANNUAIRE} element={<AnnuairePage />} />
      <Route path={ROUTES.ASSOCIATIONS} element={<AssociationsPage />} />
      <Route path={ROUTES.IMMOBILIER} element={<ImmobilierPage />} />
      <Route path={ROUTES.ALERTES} element={<AlertesPage />} />
      <Route path={ROUTES.ANNONCES} element={<AnnoncesPage />} />
      <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
      <Route path={ROUTES.VILLAGES} element={<VillagesPage />} />
      <Route path={ROUTES.NECROLOGIE} element={<NecrologiePage />} />
      <Route path={ROUTES.SOUVENIRS} element={<SouvenirsPage />} />
      <Route path={ROUTES.TRIBUNE} element={<TribunePage />} />
      <Route path={ROUTES.SUGGESTIONS} element={<SuggestionsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
