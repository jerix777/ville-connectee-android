import { memo, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Gift, Lightbulb, BikeIcon, Bed, Bell, Blend, Newspaper, Building, 
  CalendarDays, Home, Info, PhoneCall, MapPin, MessageSquare, Music, 
  Search, ShoppingCart, Users, BriefcaseBusiness, User, Bus, Heart, 
  UtensilsCrossed, Fuel, Settings, BoomBox, Stethoscope, BookmarkCheck, Phone,
  type LucideIcon 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useModuleVisibility } from "@/contexts/ModuleVisibilityContext";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemData {
  path: string;
  label: string;
  icon: LucideIcon;
  id: string;
  private?: boolean;
}

const NAV_ITEMS: NavItemData[] = [
  { path: "/", label: "Accueil", icon: Home, id: "home" },
  { path: "/steve-yobouet", label: "Steve YOBOUET", icon: User, id: "steve_yobouet" },
  { path: "/catalogue", label: "Catalogue", icon: Lightbulb, id: "catalogue" },
  { path: "/materiels-gratuits", label: "Matériels Gratuits", icon: Gift, id: "materiels_gratuits" },
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

interface NavItemProps {
  item: NavItemData;
  isActive: boolean;
}

const NavItem = memo(function NavItem({ item, isActive }: NavItemProps) {
  const Icon = item.icon;
  
  return (
    <li>
      <Link to={item.path}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 font-normal transition-colors",
            isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground"
          )}
        >
          <Icon size={18} />
          <span>{item.label}</span>
        </Button>
      </Link>
    </li>
  );
});

export const Sidebar = memo(function Sidebar({ isOpen }: SidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { modules, loading } = useModuleVisibility();

  const visibleNavItems = useMemo(() => {
    if (loading) return [];
    
    const items = NAV_ITEMS.filter(item => {
      if (item.private && !user) return false;
      if (user) return true;
      
      const module = modules.find(m => m.id === item.id);
      return module ? module.is_public : true;
    });

    if (user) {
      items.push({ path: "/settings", label: "Paramètres", icon: Settings, id: "settings" });
    }

    return items;
  }, [user, modules, loading]);

  const isActive = useCallback((path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background shadow-sm lg:block">
      <ScrollArea className="h-full py-4">
        <nav className="px-3">
          <ul className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavItem 
                key={item.path} 
                item={item} 
                isActive={isActive(item.path)} 
              />
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
});
