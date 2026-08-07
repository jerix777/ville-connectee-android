import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_actualites",
  title: "Lister les actualités",
  description:
    "Liste les actualités de la commune, les plus récentes d'abord. Recherche optionnelle par mot-clé dans le titre.",
  inputSchema: {
    search: z.string().trim().optional().describe("Mot-clé recherché dans le titre."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Nombre maximum d'actualités (défaut 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("actualites")
      .select("id, titre, contenu, type, auteur, image_url, publie_le, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (search) query = query.ilike("titre", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { actualites: data ?? [] },
    };
  },
});
