# Explication de la fonctionnalité Taxi

## Pour l'utilisateur final

La fonctionnalité Taxi est accessible depuis le menu latéral de l'application. Elle offre deux services principaux :

1.  **Trouver un taxi** :
    *   L'utilisateur peut sélectionner un point de départ et un point d'arrivée parmi une liste de lignes de taxi prédéfinies.
    *   En cliquant sur "Rechercher", l'application affiche une liste de tous les chauffeurs de taxi disponibles qui desservent cette ligne.
    *   Pour chaque chauffeur, l'utilisateur peut voir son nom, son type de véhicule (moto ou voiture) et son statut de disponibilité.
    *   Un bouton "Appeler" permet à l'utilisateur de contacter directement le chauffeur par téléphone.

2.  **Espace chauffeur** :
    *   **Devenir chauffeur** : Si un utilisateur n'est pas encore chauffeur, il verra un formulaire pour s'inscrire. Il devra choisir son type de véhicule et les lignes qu'il souhaite desservir.
    *   **Tableau de bord du chauffeur** : Une fois inscrit, l'utilisateur accède à son tableau de bord. Il peut y voir un récapitulatif de son profil (type de véhicule) et, surtout, il peut activer ou désactiver sa disponibilité via un interrupteur. Lorsqu'il est "disponible", il apparaît dans les résultats de recherche des autres utilisateurs.

## Fonctionnement technique

La fonctionnalité est construite avec plusieurs composants qui interagissent avec un service backend et une base de données.

### Fichiers principaux du frontend (dans `src/pages/Taxi/`)

*   `index.tsx` : La page principale qui contient les onglets "Trouver un taxi" et "Espace chauffeur".
*   `components/FindRide.tsx` : Le composant qui gère la recherche de chauffeurs. Il récupère les lignes de taxi et les chauffeurs disponibles via le `taxiService`.
*   `components/BecomeDriverForm.tsx` : Le formulaire d'inscription pour les nouveaux chauffeurs.
*   `components/DriverDashboard.tsx` : Le tableau de bord pour les chauffeurs enregistrés, leur permettant de gérer leur disponibilité.
*   `components/DriverCard.tsx` : La carte qui affiche les informations d'un chauffeur dans la liste de recherche.

### Service backend (`src/services/taxiService.ts`)

Ce fichier centralise toute la logique de communication avec la base de données. Il contient des fonctions pour :
*   `getTaxiLines()`: Récupérer toutes les lignes de taxi.
*   `findDriversByLine()`: Trouver les chauffeurs pour une ligne donnée.
*   `createDriverProfile()`: Créer un nouveau profil de chauffeur.
*   `getDriverProfile()`: Obtenir le profil d'un chauffeur.
*   `updateDriverAvailability()`: Mettre à jour le statut de disponibilité d'un chauffeur.

### Base de données (Supabase)

La structure de la base de données est définie dans le fichier de migration `supabase/migrations/20250725023000_create_taxi_feature.sql`. Elle comprend :

*   Une table `taxi_lines` pour stocker les différentes lignes de taxi (ex: Mairie - Grand Marché).
*   Une table `taxi_drivers` pour enregistrer les informations sur les chauffeurs (type de véhicule, disponibilité, etc.) et les lier aux profils utilisateurs existants.
*   Une table de jonction `taxi_driver_lines` pour associer les chauffeurs aux lignes qu'ils desservent.
*   Une fonction `get_drivers_by_line` qui facilite la recherche de chauffeurs pour une ligne spécifique.

En résumé, la fonctionnalité combine une interface utilisateur simple et intuitive avec un service backend robuste et une base de données bien structurée pour offrir une expérience de gestion de taxi complète.
