import pdf from "npm:pdf-parse@1.1.1";
import { createClient } from "npm:@supabase/supabase-js@2.30.0";

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url).searchParams.get('url');
    if (!url) return new Response(JSON.stringify({ error: 'missing url param' }), { status: 400 });

    const resp = await fetch(url);
    if (!resp.ok) return new Response(JSON.stringify({ error: 'failed to fetch pdf' }), { status: 400 });
    const arrayBuffer = await resp.arrayBuffer();
    const data = await pdf(Buffer.from(arrayBuffer));
    const text = data.text || '';

    // Simple parser: assume lines with tab or multiple spaces separate columns
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    const rows = [];
    for (const line of lines) {
      // naive split by 2+ spaces or tab
      const parts = line.split(/\t| {2,}/).map(p=>p.trim());
      if (parts.length < 3) continue; // skip non-data
      // Map selon le format MUGEFCI: nom, forme_dosage, prix_public, prix_mugefci, taux
      const [nom, forme_dosage, prix_publicRaw, prix_mutuetteRaw, tauxRaw] = parts;
      
      // Nettoyage et conversion des prix
      const prix_public = prix_publicRaw ? Number(prix_publicRaw.replace(/[^0-9.,]/g,'').replace(',', '.')) : null;
      const prix_mutuelle = prix_mutuetteRaw ? Number(prix_mutuetteRaw.replace(/[^0-9.,]/g,'').replace(',', '.')) : null;
      const taux = tauxRaw ? Number(tauxRaw.replace(/[^0-9.,]/g,'').replace(',', '.')) : null;
      
      // Extraction forme et dosage
      let forme = null, dosage = null;
      if (forme_dosage) {
        const m = forme_dosage.match(/(.+)\s+(\d+[\.,]?\d*\s*(mg|g|ml|microg|mcg|%|ui)?)/i);
        if (m) { 
          forme = m[1].trim(); 
          dosage = m[2].trim(); 
        } else { 
          forme = forme_dosage.trim(); 
        }
      }
      // Construction de l'objet medicament
      rows.push({
        nom: nom.trim(),
        forme,
        dosage,
        prix_public,
        prix_mutuelle,
        taux_remboursement: taux,
        disponible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert in batches using service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) return new Response(JSON.stringify({ error: 'missing supabase env' }), { status: 500 });
    const sb = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error } = await sb.from('medicament').insert(batch);
      if (error) return new Response(JSON.stringify({ error: error.message, details: error }), { status: 500 });
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ inserted, total: rows.length }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
