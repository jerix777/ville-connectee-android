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
  // Additional options - supports arrays and single elements
  additionalOptions?: React.ReactNode | React.ReactNode[];
  // Options layout configuration
  optionsLayout?: 'default' | 'search-first' | 'options-first';
  showAddButton?: boolean;
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
  showSearchOnAllTabs = false,
  additionalOptions,
  optionsLayout = 'default',
  showAddButton = true
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
            {/* Disposition responsive avec support pour différents layouts */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              
              {/* Layout par défaut : barre de recherche en premier */}
              {optionsLayout === 'default' && (
                <>
                  {/* Barre de recherche et bouton d'ajout */}
                  {(activeTab === "liste" || showSearchOnAllTabs) && onSearchChange && (
                    <div className="flex-1">
                      <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        onAddClick={showAddButton ? onAddClick! : undefined}
                        addButtonText={addButtonText}
                        showAddButton={showAddButton}
                      />
                    </div>
                  )}
                  
                  {/* Options additionnelles */}
                  {additionalOptions && (
                    <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                      {Array.isArray(additionalOptions) 
                        ? additionalOptions.map((option, index) => (
                            <React.Fragment key={index}>{option}</React.Fragment>
                          ))
                        : additionalOptions
                      }
                    </div>
                  )}
                </>
              )}
              
              {/* Layout options-first : options en premier */}
              {optionsLayout === 'options-first' && (
                <>
                  {/* Options additionnelles en premier */}
                  {additionalOptions && (
                    <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                      {Array.isArray(additionalOptions) 
                        ? additionalOptions.map((option, index) => (
                            <React.Fragment key={index}>{option}</React.Fragment>
                          ))
                        : additionalOptions
                      }
                    </div>
                  )}
                  
                  {/* Barre de recherche */}
                  {(activeTab === "liste" || showSearchOnAllTabs) && onSearchChange && (
                    <div className="flex-1">
                      <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        onAddClick={showAddButton ? onAddClick! : undefined}
                        addButtonText={addButtonText}
                        showAddButton={showAddButton}
                      />
                    </div>
                  )}
                </>
              )}
              
              {/* Layout search-first : recherche seule en premier, options sur ligne séparée */}
              {optionsLayout === 'search-first' && (
                <div className="w-full space-y-4">
                  {/* Première ligne : recherche uniquement */}
                  {(activeTab === "liste" || showSearchOnAllTabs) && onSearchChange && (
                    <div className="w-full">
                      <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        onAddClick={showAddButton ? onAddClick! : undefined}
                        addButtonText={addButtonText}
                        showAddButton={showAddButton}
                      />
                    </div>
                  )}
                  
                  {/* Deuxième ligne : options */}
                  {additionalOptions && (
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {Array.isArray(additionalOptions) 
                        ? additionalOptions.map((option, index) => (
                            <React.Fragment key={index}>{option}</React.Fragment>
                          ))
                        : additionalOptions
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}