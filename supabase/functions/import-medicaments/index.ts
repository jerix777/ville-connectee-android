import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
// @deno-types="npm:@types/pdf-parse@1.1.4"
import pdfParse from 'npm:pdf-parse@1.1.1'

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

    // Read file content as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    console.log('Parsing PDF with pdf-parse...');

    // Parse PDF to extract text
    const pdfData = await pdfParse(buffer);
    const textContent = pdfData.text;
    
    console.log(`PDF parsed successfully, extracted ${textContent.length} characters`);

    // Fonction pour nettoyer agressivement les caractères problématiques
    const cleanText = (text: string): string => {
      if (!text) return '';
      // Remplacer tous les caractères non-ASCII et de contrôle
      // Garder seulement les lettres, chiffres, espaces et ponctuation de base
      return text
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Enlever tous les caractères de contrôle
        .replace(/[^\x20-\x7E\u00C0-\u024F]/g, '') // Garder ASCII imprimable + lettres accentuées
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .trim();
    };

    // Parse the text content
    const lines = textContent.split(/\r?\n/).map(l => cleanText(l)).filter(Boolean);
    const medicaments: ParsedMedicament[] = [];
    
    console.log(`Processing ${lines.length} lines...`);
    
    let processedLines = 0;
    for (const line of lines) {
      try {
        // Skip header lines and lines that don't look like data
        if (line.includes('CODE') || line.includes('PRODUIT') || line.length < 20) {
          continue;
        }

        // Split by multiple spaces or tabs
        const parts = line.split(/\s{2,}/).map(p => cleanText(p)).filter(Boolean);
        
        if (parts.length < 7) {
          console.log(`Skipping line with insufficient parts (${parts.length}): ${line.substring(0, 50)}`);
          continue;
        }

        const [code_produit, nom, groupe_therapeutique, dci, categorie, type_medicament, prixRaw, ...rest] = parts;
      
        // Extract price
        const prixMatch = prixRaw?.match(/[\d.,]+/);
        if (!prixMatch) {
          console.log(`Skipping line with invalid price: ${prixRaw}`);
          continue;
        }
        
        const prix_public = parseFloat(prixMatch[0].replace(',', '.'));
        if (isNaN(prix_public)) {
          console.log(`Skipping line with NaN price: ${prixMatch[0]}`);
          continue;
        }

        // Get regime (last meaningful part)
        const regime = rest[rest.length - 1] || 'RCO';

        medicaments.push({
          code_produit: cleanText(code_produit || '').substring(0, 100),
          nom: cleanText(nom || '').substring(0, 255),
          groupe_therapeutique: cleanText(groupe_therapeutique || '').substring(0, 255),
          dci: cleanText(dci || '').substring(0, 255),
          categorie: cleanText(categorie || '').substring(0, 100),
          type_medicament: cleanText(type_medicament || '').substring(0, 100),
          prix_public,
          regime: cleanText(regime || 'RCO').substring(0, 50),
          disponible: true,
        });

        processedLines++;
      } catch (lineError) {
        console.error(`Error processing line: ${lineError.message}`);
        continue;
      }
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