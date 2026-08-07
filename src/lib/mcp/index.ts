import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listActualitesTool from "./tools/list-actualites";
import listEvenementsTool from "./tools/list-evenements";
import listOffresEmploiTool from "./tools/list-offres-emploi";
import listVillagesTool from "./tools/list-villages";
import getMyProfileTool from "./tools/get-my-profile";
import createSuggestionTool from "./tools/create-suggestion";

// L'issuer OAuth doit être l'hôte Supabase direct, construit depuis le project ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ville-connectee",
  title: "ville-connectee",
  version: "0.1.0",
  instructions:
    "Outils de l'application communautaire Ville Connectée : consulter les actualités, les événements, les offres d'emploi et les villages, lire le profil de l'utilisateur connecté et publier une suggestion à la mairie. Les données sont lues au nom de l'utilisateur connecté.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listActualitesTool,
    listEvenementsTool,
    listOffresEmploiTool,
    listVillagesTool,
    getMyProfileTool,
    createSuggestionTool,
  ],
});
