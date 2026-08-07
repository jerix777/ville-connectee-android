import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_evenements",
  title: "Lister les événements",
  description:
    "Liste les événements de la commune. Par défaut seuls les événements à venir sont renvoyés.",
  inputSchema: {
    include_past: z
      .boolean()
      .optional()
      .describe("Inclure aussi les événements déjà terminés (défaut false)."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Nombre maximum d'événements (défaut 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ include_past, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("evenements")
      .select(
        "id, titre, lieu, organisateur, date_debut, date_fin, heure_debut, heure_fin, contact1, contact2, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (!include_past) {
      query = query.gte("date_fin", new Date().toISOString().slice(0, 10));
    }
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { evenements: data ?? [] },
    };
  },
});
