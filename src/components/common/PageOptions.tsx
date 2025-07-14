import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SearchBar } from "./SearchBar";

interface PageOptionsProps {
  showOptions: boolean;
  onToggleOptions: () => void;
  // Search functionality
  activeTab: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addButtonText?: string;
  showSearchOnAllTabs?: boolean;
}

export function PageOptions({
  showOptions,
  onToggleOptions,
  activeTab,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  onAddClick,
  addButtonText = "Ajouter",
  showSearchOnAllTabs = false
}: PageOptionsProps) {
  return (
    <div className="bg-background border-b border-border flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div 
          onClick={onToggleOptions}
          className="flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-md -mx-2"
        >
          <span className="text-sm text-muted-foreground">
            {showOptions ? "Masquer les options" : "Afficher les options"}
          </span>
          {showOptions ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            showOptions 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 pb-0'
          }`}
        >
          {/* Contenu des options de la page */}
          <div className="py-2">
            {/* Barre de recherche et bouton d'ajout */}
            {(activeTab === "liste" || showSearchOnAllTabs) && onSearchChange && (
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                onAddClick={onAddClick!}
                addButtonText={addButtonText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}