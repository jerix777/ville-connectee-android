import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_offres_emploi",
  title: "Lister les offres d'emploi",
  description:
    "Liste les offres d'emploi publiées sur l'application, les plus récentes d'abord. Recherche optionnelle par mot-clé dans le titre.",
  inputSchema: {
    search: z.string().trim().optional().describe("Mot-clé recherché dans le titre de l'offre."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Nombre maximum d'offres (défaut 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("offres_emploi")
      .select("id, titre, employeur, description, localisation, type_contrat, publie_le, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (search) query = query.ilike("titre", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { offres: data ?? [] },
    };
  },
});
