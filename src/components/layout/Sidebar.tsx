import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbulb, BikeIcon, Bed, Bell, Blend, Newspaper, Building, CalendarDays, Home, Info, PhoneCall, MapPin, MessageSquare, Music, Search, ShoppingCart, Users, BriefcaseBusiness, LucideProps, User, Bus, Briefcase, Heart, UtensilsCrossed, Fuel, Settings, BoomBox, Stethoscope, BookmarkCheck, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useModuleVisibility } from "@/contexts/ModuleVisibilityContext";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ComponentType<LucideProps>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const navItems = [
  { path: "/", label: "Accueil", icon: Home, id: "home" },
  { path: "/steve-yobouet", label: "Steve YOBOUET", icon: User, id: "steve_yobouet" },
  { path: "/catalogue", label: "Catalogue", icon: Lightbulb, id: "catalogue" },
  { path: "/actualites", label: "Actualités", icon: Newspaper, id: "actualites" },
  { path: "/evenements", label: "Événements", icon: CalendarDays, id: "evenements" },
  { path: "/messages", label: "Messages", icon: MessageSquare, id: "messages", private: true },
  { path: "/jukebox", label: "Ambiance baoulé", icon: BoomBox, id: "jukebox" },
  { path: "/main-doeuvre", label: "Professionnels", icon: Users, id: "main_doeuvre" },
  { path: "/marche", label: "Marché", icon: ShoppingCart, id: "marche" },
  { path: "/emplois", label: "Offres d'emploi", icon: BriefcaseBusiness, id: "emplois" },
  { path: "/annuaire", label: "Annuaire", icon: PhoneCall, id: "annuaire" },
  { path: "/appels-rapides", label: "Appels Rapides", icon: Phone, id: "appels_rapides" },
  { path: "/associations", label: "Associations", icon: Blend, id: "associations" },
  { path: "/immobilier", label: "Espace immobilier", icon: Building, id: "immobilier" },
  { path: "/alertes", label: "Alertes", icon: Bell, id: "alertes" },
  { path: "/annonces", label: "Avis et Communiqués", icon: Info, id: "annonces" },
  { path: "/services", label: "Services et commerces", icon: Building, id: "services" },
  { path: "/villages", label: "Villages", icon: MapPin, id: "villages" },
  { path: "/necrologie", label: "Nécrologie", icon: Heart, id: "necrologie" },
  { path: "/souvenirs", label: "Souvenirs", icon: BookmarkCheck, id: "souvenirs" },
  { path: "/tribune", label: "Tribune", icon: MessageSquare, id: "tribune" },
  { path: "/suggestions", label: "Suggestions", icon: MessageSquare, id: "suggestions" },
  { path: "/taxi", label: "Motos Taxis", icon: BikeIcon, id: "taxi" },
  { path: "/hotelerie", label: "Hôtels et résidences", icon: Bed, id: "hotelerie" },
  { path: "/taxi-communal", label: "Taxis villages", icon: Bus, id: "taxi_communal" },
  { path: "/radio", label: "Radios", icon: Music, id: "radios" },
  { path: "/sante-proximite", label: "Hôpitaux", icon: Stethoscope, id: "sante" },
  { path: "/maquis-resto", label: "Maquis et Restaus", icon: UtensilsCrossed, id: "maquis_resto" },
  { path: "/carburant-gaz", label: "Carburant et Gaz", icon: Fuel, id: "carburant_gaz" },
];

function NavItem({ to, icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <li>
      <Link to={to} onClick={onClick}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 font-normal",
            isActive ? "bg-ville-light text-ville-dark" : "text-gray-700"
          )}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Button>
      </Link>
    </li>
  );
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { modules, loading } = useModuleVisibility();

  const visibleNavItems = useMemo(() => {
    if (loading) return [];
    
    let items = navItems.filter(item => {
      // @ts-ignore
      if (item.private && !user) {
        return false;
      }
      
      if (user) {
        return true;
      }
      
      // @ts-ignore
      const module = modules.find(m => m.id === item.id);
      return module ? module.is_public : true;
    });

    if (user) {
      items.push({ path: "/settings", label: "Paramètres", icon: Settings, id: "settings" });
    }

    return items;
  }, [user, modules, loading]);

  const sidebarClasses = cn(
    "fixed top-0 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 pt-16 overflow-y-auto",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );

  const filteredNavItems = searchQuery
    ? visibleNavItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visibleNavItems;

  return (
    <aside className={sidebarClasses}>
      <div className="p-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-ville-DEFAULT"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav>
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.path}
                onClick={() => {}}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
