import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.30.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Remplacez par vos variables d'environnement Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Définition du type pour les médicaments, aligné avec votre schéma
interface MedicamentInsert {
  nom: string;
  groupe_therapeutique?: string;
  dci?: string;
  categorie?: string;
  type?: string;
  prix_public: number;
  regime?: string;
  code_produit?: string;
  disponible: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Aucun fichier fourni' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert to Uint8Array for PDF processing
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Use pdfjs to extract text
    const pdfjsLib = await import('https://esm.sh/pdfjs-dist@3.11.174/build/pdf.mjs');
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDoc = await loadingTask.promise;
    
    // Extract text from all pages
    let text = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }

    const medicaments: MedicamentInsert[] = [];
    const lines = text.split('\n');

    let isHeader = true;
    for (const line of lines) {
      if (line.includes('CODE PRODUIT')) {
        isHeader = false;
        continue;
      }
      if (isHeader || line.trim().length === 0 || line.includes('Page') || line.includes('Date')) {
        continue;
      }

      // Expression régulière améliorée pour capturer les colonnes
      const match = line.match(/^(\d+)\s+(.+?)\s+(.+?)\s+(.+?)\s+([A-Z0-9]+)\s+([A-Z]+)\s+([\d\s]+)\s+([A-Z]+)$/);

      if (match) {
        const [, code_produit, nom, groupe_therapeutique, dci, categorie, type, prix_raw, regime] = match;
        const prix_public = parseInt(prix_raw.replace(/\s/g, ''), 10);

        if (!isNaN(prix_public)) {
          medicaments.push({
            code_produit: code_produit.trim(),
            nom: nom.trim(),
            groupe_therapeutique: groupe_therapeutique.trim(),
            dci: dci.trim(),
            categorie: categorie.trim(),
            type: type.trim(),
            prix_public,
            regime: regime.trim(),
            disponible: true,
          });
        }
      }
    }

    if (medicaments.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun médicament trouvé dans le PDF' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insertion en masse dans Supabase
    const { error } = await supabase.from('medicament').insert(medicaments);

    if (error) {
      console.error("Erreur d'insertion Supabase:", error);
      throw new Error("Erreur lors de l'enregistrement des données.");
    }

    return new Response(JSON.stringify({ success: true, message: `${medicaments.length} médicaments importés avec succès.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('Erreur inattendue:', e);
    const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
