import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ParsedMedicament {
  code_produit: string;
  nom: string;
  groupe_therapeutique: string;
  dci: string;
  categorie: string;
  type_medicament: string;
  prix_public: number;
  regime: string;
  disponible: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting medicament import process...');

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided in request');
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const textContent = new TextDecoder().decode(arrayBuffer);
    
    console.log('File content extracted, parsing...');

    // Parse the text content (simple parser)
    const lines = textContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const medicaments: ParsedMedicament[] = [];
    
    let processedLines = 0;
    for (const line of lines) {
      // Skip header lines and lines that don't look like data
      if (line.includes('CODE') || line.includes('PRODUIT') || line.length < 20) {
        continue;
      }

      // Split by multiple spaces or tabs
      const parts = line.split(/\t|\s{2,}/).map(p => p.trim()).filter(Boolean);
      
      if (parts.length < 7) {
        continue; // Skip lines that don't have enough data
      }

      const [code_produit, nom, groupe_therapeutique, dci, categorie, type_medicament, prixRaw, ...rest] = parts;
      
      // Extract price
      const prixMatch = prixRaw?.match(/[\d.,]+/);
      if (!prixMatch) continue;
      
      const prix_public = parseFloat(prixMatch[0].replace(',', '.'));
      if (isNaN(prix_public)) continue;

      // Get regime (last meaningful part)
      const regime = rest[rest.length - 1] || 'RCO';

      medicaments.push({
        code_produit: code_produit || '',
        nom: nom || '',
        groupe_therapeutique: groupe_therapeutique || '',
        dci: dci || '',
        categorie: categorie || '',
        type_medicament: type_medicament || '',
        prix_public,
        regime: regime || 'RCO',
        disponible: true,
      });

      processedLines++;
    }

    console.log(`Parsed ${medicaments.length} medicaments from ${processedLines} lines`);

    if (medicaments.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Aucun médicament trouvé dans le fichier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Inserting medicaments into database...');

    // Insert in batches
    const batchSize = 500;
    let inserted = 0;
    
    for (let i = 0; i < medicaments.length; i += batchSize) {
      const batch = medicaments.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(medicaments.length / batchSize)}`);
      
      const { error } = await supabase
        .from('medicament')
        .insert(batch.map(m => ({
          ...m,
          forme: '', // Will be extracted later if needed
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })));

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: error.message, details: error }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      inserted += batch.length;
    }

    console.log(`Successfully inserted ${inserted} medicaments`);

    return new Response(
      JSON.stringify({ 
        success: true,
        inserted,
        total: medicaments.length,
        message: `${inserted} médicaments importés avec succès`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Error in import-medicaments function:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Une erreur est survenue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});