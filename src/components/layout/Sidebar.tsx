
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, BookmarkCheck, Building, Calendar, Home, Info, Link as LinkIcon, MapPin, MessageSquare, Music, Search, Star, Users, BriefcaseBusiness, LucideProps, User } from "lucide-react";

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
  { path: "/", label: "Accueil", icon: Home },
  { path: "/catalogue", label: "Catalogue", icon: BookmarkCheck },
  { path: "/actualites", label: "Actualités", icon: BookmarkCheck },
  { path: "/evenements", label: "Événements", icon: Calendar },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/jukebox", label: "Jukebox", icon: Music },
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
  { path: "/steve-yobouet", label: "Steve Yobouet", icon: User },
  { path: "/taxi", label: "Service Taxi", icon: BriefcaseBusiness },
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

  const sidebarClasses = cn(
    "fixed top-0 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 pt-16 overflow-y-auto",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );

  const filteredNavItems = searchQuery
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navItems;

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
