import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_suggestion",
  title: "Créer une suggestion",
  description:
    "Publie une suggestion adressée à la mairie au nom de l'utilisateur connecté. Écrit une nouvelle ligne dans l'application.",
  inputSchema: {
    titre: z.string().trim().min(1).describe("Titre court de la suggestion."),
    contenu: z.string().trim().min(1).describe("Contenu détaillé de la suggestion."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ titre, contenu }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data: profile } = await supabase
      .from("users_profiles")
      .select("nom, prenom")
      .eq("user_id", ctx.getUserId())
      .maybeSingle();
    const auteur =
      [profile?.prenom, profile?.nom].filter(Boolean).join(" ").trim() ||
      ctx.getUserEmail() ||
      "Utilisateur";

    const { data, error } = await supabase
      .from("suggestions")
      .insert({ titre, contenu, auteur })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { suggestion: data },
    };
  },
});
