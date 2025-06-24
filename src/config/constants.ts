
export const APP_CONFIG = {
  name: "Expo Starter",
  description: "Application communale moderne",
  version: "1.0.0",
  pagination: {
    defaultItemsPerPage: 6,
    maxItemsPerPage: 50,
  },
  ui: {
    animationDuration: 300,
    debounceDelay: 500,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  ACTUALITES: "/actualites",
  EVENEMENTS: "/evenements",
  MAIN_DOEUVRE: "/main-doeuvre",
  MARCHE: "/marche",
  EMPLOIS: "/emplois",
  ANNUAIRE: "/annuaire",
  ASSOCIATIONS: "/associations",
  IMMOBILIER: "/immobilier",
  ALERTES: "/alertes",
  ANNONCES: "/annonces",
  SERVICES: "/services",
  VILLAGES: "/villages",
  NECROLOGIE: "/necrologie",
  SOUVENIRS: "/souvenirs",
  TRIBUNE: "/tribune",
  SUGGESTIONS: "/suggestions",
} as const;

export const API_ENDPOINTS = {
  PROFESSIONALS: "/api/professionals",
  METIERS: "/api/metiers",
  COMMUNES: "/api/communes",
  // Ajoutez d'autres endpoints selon vos besoins
} as const;
