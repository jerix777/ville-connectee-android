
import { MainLayout } from "@/components/layout/MainLayout";
import { FeatureCard } from "@/components/ui/feature-card";
import { BookmarkCheck, Building, Calendar, Bell, Info, MapPin, Users, MessageSquare, Star, Link as LinkIcon } from "lucide-react";

const featuresSection1 = [
  {
    title: "Événements",
    icon: Calendar,
    to: "/evenements",
    description: "Consultez les événements à venir"
  },
  {
    title: "Main d'œuvre",
    icon: Users,
    to: "/main-doeuvre",
    description: "Trouvez des professionnels qualifiés"
  },
  {
    title: "Marché",
    icon: Star,
    to: "/marche",
    description: "Achetez et vendez des biens"
  },
  {
    title: "Offres d'emploi",
    icon: Building,
    to: "/emplois",
    description: "Consultez les opportunités d'emploi"
  },
  {
    title: "Annuaire",
    icon: LinkIcon,
    to: "/annuaire",
    description: "Retrouvez les contacts locaux"
  },
  {
    title: "Associations",
    icon: Users,
    to: "/associations",
    description: "Découvrez les associations"
  },
];

const featuresSection2 = [
  {
    title: "Alertes",
    icon: Bell,
    to: "/alertes",
    description: "Signalements et alertes locales"
  },
  {
    title: "Communiqués",
    icon: Info,
    to: "/annonces",
    description: "Annonces officielles"
  },
  {
    title: "Services & Commerces",
    icon: Building,
    to: "/services",
    description: "Services et entreprises locales"
  },
  {
    title: "Villages",
    icon: MapPin,
    to: "/villages",
    description: "Informations sur les villages"
  },
  {
    title: "Souvenirs",
    icon: BookmarkCheck,
    to: "/souvenirs",
    description: "Mémoire collective"
  },
  {
    title: "Tribune & Suggestions",
    icon: MessageSquare,
    to: "/tribune",
    description: "Votre espace d'expression"
  },
];

export default function Index() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mb-10">
        <div className="rounded-xl bg-gradient-to-r from-ville-DEFAULT to-ville-dark p-8 text-black">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            Bienvenue à Ouellé
          </h1>
          <p className="text-lg opacity-90 mb-6 text-black">
            la cité de l'innovation et du développement durable
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-ville-DEFAULT px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all text-black">
              Découvrir
            </button>
            <button className="bg-transparent border border-ville-DEFAULT text-ville-DEFAULT px-6 py-3 rounded-md font-medium hover:bg-ville-light transition-all text-black">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Features Section 1 - Actualités */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-gray-800">
            Actualités
          </h2>
          <a href="/actualites" className="text-ville-DEFAULT hover:underline">
            Voir tout
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuresSection1.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.to}
            />
          ))}
        </div>
      </section>

      {/* Features Section 2 - Espace Immobilier */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Espace Immobilier
          </h2>
          <a href="/immobilier" className="text-ville-DEFAULT hover:underline">
            Voir tout
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuresSection2.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.to}
              variant="outline"
            />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
