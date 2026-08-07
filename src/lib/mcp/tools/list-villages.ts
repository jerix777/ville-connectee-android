import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_villages",
  title: "Lister les villages",
  description:
    "Liste les villages rattachés à la commune, avec leur description et leurs contacts. Recherche optionnelle par nom.",
  inputSchema: {
    search: z.string().trim().optional().describe("Mot-clé recherché dans le nom du village."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Nombre maximum de villages (défaut 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("villages")
      .select("id, nom, description, population, code_postal, contact, contact2, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (search) query = query.ilike("nom", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { villages: data ?? [] },
    };
  },
});
