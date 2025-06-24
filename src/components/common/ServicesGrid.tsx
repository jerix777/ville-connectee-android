
import { FeatureCard } from "@/components/ui/feature-card";
import { 
  BookmarkCheck, 
  Calendar, 
  Users, 
  Star, 
  BriefcaseBusiness,
  Building,
  Bell,
  Info,
  MapPin,
  MessageSquare
} from "lucide-react";

const services = [
  {
    title: "Actualités",
    description: "Suivez l'actualité locale et les dernières nouvelles de votre commune",
    icon: BookmarkCheck,
    to: "/actualites",
    gradient: "from-ville-orange-500 to-ville-orange-600"
  },
  {
    title: "Événements",
    description: "Découvrez tous les événements culturels et festifs à venir",
    icon: Calendar,
    to: "/evenements",
    gradient: "from-expo-accent to-expo-accent/80"
  },
  {
    title: "Main d'œuvre",
    description: "Trouvez des professionnels qualifiés pour vos projets",
    icon: Users,
    to: "/main-doeuvre",
    gradient: "from-expo-success to-expo-success/80"
  },
  {
    title: "Marché local",
    description: "Achetez et vendez localement dans votre communauté",
    icon: Star,
    to: "/marche",
    gradient: "from-ville-orange-600 to-ville-orange-700"
  },
  {
    title: "Offres d'emploi",
    description: "Consultez les opportunités professionnelles de la région",
    icon: BriefcaseBusiness,
    to: "/emplois",
    gradient: "from-expo-accent/80 to-ville-dark"
  },
  {
    title: "Immobilier",
    description: "Explorez le marché immobilier local",
    icon: Building,
    to: "/immobilier",
    gradient: "from-expo-success/80 to-ville-orange-500"
  },
  {
    title: "Alertes",
    description: "Restez informé des alertes importantes de votre ville",
    icon: Bell,
    to: "/alertes",
    gradient: "from-ville-orange-500 to-expo-error"
  },
  {
    title: "Communiqués",
    description: "Consultez les annonces officielles de la mairie",
    icon: Info,
    to: "/annonces",
    gradient: "from-ville-dark to-expo-accent"
  },
  {
    title: "Villages",
    description: "Découvrez tous les villages de votre territoire",
    icon: MapPin,
    to: "/villages",
    gradient: "from-expo-success to-ville-orange-400"
  },
  {
    title: "Tribune",
    description: "Participez aux débats et discussions communautaires",
    icon: MessageSquare,
    to: "/tribune",
    gradient: "from-ville-orange-600 to-expo-accent"
  }
];

export function ServicesGrid() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-ville-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-expo-DEFAULT mb-4">
            Services & Fonctionnalités
          </h2>
          <p className="text-xl text-expo-gray-600 max-w-3xl mx-auto">
            Découvrez tous les services numériques mis à votre disposition pour faciliter 
            votre vie quotidienne et renforcer les liens communautaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.to}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="group relative">
                <FeatureCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  to={service.to}
                  className="h-full"
                />
                {/* Effet de lueur au hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${service.gradient} blur-xl -z-10`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
