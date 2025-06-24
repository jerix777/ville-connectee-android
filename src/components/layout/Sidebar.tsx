
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, BookmarkCheck, Building, Calendar, Home, Info, Link as LinkIcon, MapPin, MessageSquare, Search, Star, Users, BriefcaseBusiness } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const navItems = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/actualites", label: "Actualités", icon: BookmarkCheck },
  { path: "/evenements", label: "Événements", icon: Calendar },
  { path: "/main-doeuvre", label: "Main d'œuvre", icon: Users },
  { path: "/marche", label: "Marché", icon: Star },
  { path: "/emplois", label: "Offres d'emploi", icon: BriefcaseBusiness },
  { path: "/annuaire", label: "Annuaire", icon: LinkIcon },
  { path: "/associations", label: "Associations", icon: Users },
  { path: "/immobilier", label: "Espace immobilier", icon: Building },
  { path: "/alertes", label: "Alertes", icon: Bell },
  { path: "/annonces", label: "Communiqués officiels", icon: Info },
  { path: "/services", label: "Services et commerces", icon: Building },
  { path: "/villages", label: "Villages", icon: MapPin },
  { path: "/necrologie", label: "Nécrologie", icon: BookmarkCheck },
  { path: "/souvenirs", label: "Souvenirs", icon: Calendar },
  { path: "/tribune", label: "Tribune", icon: MessageSquare },
  { path: "/suggestions", label: "Suggestions", icon: MessageSquare },
];

function NavItem({ to, icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <li className="mb-1">
      <Link to={to} onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 font-medium rounded-xl h-12 transition-all duration-200",
            isActive 
              ? "bg-expo-accent text-white shadow-medium" 
              : "text-expo-gray-600 hover:bg-expo-gray-100 hover:text-expo-DEFAULT"
          )}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Button>
      </Link>
    </li>
  );
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarClasses = cn(
    "sidebar-modern",
    isOpen ? "translate-x-0" : "-translate-x-full",
    "pt-20"
  );

  const filteredNavItems = searchQuery
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navItems;

  return (
    <aside className={sidebarClasses}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-expo-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="input-modern pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav>
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-expo-gray-400 uppercase tracking-wider px-3 mb-3">
              Navigation
            </h3>
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
          </div>
        </nav>
      </div>
    </aside>
  );
}
