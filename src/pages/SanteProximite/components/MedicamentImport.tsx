import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function MedicamentImport() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      console.log('Uploading file:', file.name);

      // Créer un FormData avec le fichier
      const formData = new FormData();
      formData.append('file', file);

      // Appeler la fonction edge
      const { data, error } = await supabase.functions.invoke('import-medicaments', {
        body: formData,
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Import result:', data);

      if (data.success) {
        setResult({ success: true, message: data.message });
        toast.success(data.message);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'importation');
      }
    } catch (error: any) {
      console.error('Error importing medicaments:', error);
      const errorMessage = error.message || 'Erreur lors de l\'importation du fichier';
      setResult({ success: false, message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4">Importer des médicaments</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Importez la liste des médicaments remboursables MUGEFCI au format PDF
      </p>

      <div className="space-y-4">
        <label htmlFor="pdf-upload">
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="default"
            disabled={uploading}
            onClick={() => document.getElementById('pdf-upload')?.click()}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Sélectionner un fichier PDF
              </>
            )}
          </Button>
        </label>

        {result && (
          <div
            className={`p-4 rounded-lg border flex items-start gap-3 ${
              result.success
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
            }`}
          >
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  result.success
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-red-900 dark:text-red-100'
                }`}
              >
                {result.success ? 'Succès' : 'Erreur'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  result.success
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Format attendu :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Fichier PDF de la liste MUGEFCI</li>
            <li>Colonnes : Code produit, Nom, Groupe thérapeutique, DCI, Catégorie, Type, Prix, Régime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}