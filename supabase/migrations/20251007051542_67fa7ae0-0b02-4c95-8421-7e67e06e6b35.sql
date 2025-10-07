-- Améliorer la table medicament pour correspondre au format MUGEFCI
ALTER TABLE public.medicament
ADD COLUMN IF NOT EXISTS code_produit TEXT,
ADD COLUMN IF NOT EXISTS groupe_therapeutique TEXT,
ADD COLUMN IF NOT EXISTS categorie TEXT,
ADD COLUMN IF NOT EXISTS regime TEXT,
ADD COLUMN IF NOT EXISTS type_medicament TEXT;

-- Créer un index sur le code produit pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_medicament_code_produit ON public.medicament(code_produit);

-- Créer un index sur le nom pour recherches
CREATE INDEX IF NOT EXISTS idx_medicament_nom ON public.medicament(nom);

-- Ajouter un index sur le groupe thérapeutique
CREATE INDEX IF NOT EXISTS idx_medicament_groupe ON public.medicament(groupe_therapeutique);