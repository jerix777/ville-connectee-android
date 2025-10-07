import pdf from "npm:pdf-parse";
import { createClient } from "npm:@supabase/supabase-js";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

async function main() {
  try {
    const filePath = 'MUGEFCI-Liste-des-medicaments-remboursables-Edition-Decembre-2024-03122024.pdf';

    console.log(`Reading PDF file: ${filePath}`);
    const fileContent = await Deno.readFile(filePath);
    const data = await pdf(fileContent);
    const text = data.text || '';
    console.log("PDF parsed successfully.");

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
      const prix_public_val = prix_publicRaw ? Number(prix_publicRaw.replace(/[^0-9.,]/g,'').replace(',', '.')) : null;
      if (prix_public_val === null || isNaN(prix_public_val)) {
        console.log(`Skipping row with invalid public price: ${line}`);
        continue;
      }
      const prix_public = prix_public_val;
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
        disponible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    console.log(`Found ${rows.length} records to insert.`);

    // Insert in batches using service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the .env file.');
        return;
    }
    const sb = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    console.log("Connecting to Supabase...");

    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}...`);
      const { error } = await sb.from('medicament').insert(batch);
      if (error) {
          console.error("Error inserting batch:", error);
          return;
      }
      inserted += batch.length;
    }

    console.log(`\nInsertion complete!`);
    console.log(`Successfully inserted ${inserted} of ${rows.length} total records.`);

  } catch (err) {
    console.error("\nAn error occurred during script execution:", err);
  }
}

main();
