-- Créer la table des médicaments
CREATE TABLE public.medicament (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  dci TEXT, -- Dénomination Commune Internationale
  forme TEXT NOT NULL, -- comprimé, sirop, gélule, etc.
  dosage TEXT,
  prix_public NUMERIC NOT NULL,
  prix_mutuelle NUMERIC, -- Prix avec mutuelle/assurance
  prix_indigent NUMERIC, -- Prix pour régime indigent
  prix_cmuc NUMERIC, -- Couverture Maladie Universelle
  laboratoire TEXT,
  disponible BOOLEAN DEFAULT true,
  prescription_requise BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.medicament ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public peut voir les médicaments"
ON public.medicament
FOR SELECT
USING (true);

-- Politique d'insertion pour utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent ajouter des médicaments"
ON public.medicament
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Politique de mise à jour pour utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent modifier des médicaments"
ON public.medicament
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Politique de suppression pour utilisateurs authentifiés
CREATE POLICY "Utilisateurs authentifiés peuvent supprimer des médicaments"
ON public.medicament
FOR DELETE
USING (auth.role() = 'authenticated');

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_medicament_updated_at
BEFORE UPDATE ON public.medicament
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques médicaments d'exemple
INSERT INTO public.medicament (nom, dci, forme, dosage, prix_public, prix_mutuelle, prix_indigent, prix_cmuc, laboratoire, prescription_requise, description) VALUES
('Paracétamol', 'Paracétamol', 'Comprimé', '500mg', 500, 400, 200, 300, 'Pharma CI', false, 'Antalgique et antipyrétique'),
('Doliprane', 'Paracétamol', 'Comprimé', '1000mg', 1000, 800, 400, 600, 'Sanofi', false, 'Antalgique et antipyrétique'),
('Amoxicilline', 'Amoxicilline', 'Gélule', '500mg', 2500, 2000, 1000, 1500, 'Pharma CI', true, 'Antibiotique'),
('Ibuprofène', 'Ibuprofène', 'Comprimé', '400mg', 800, 600, 300, 450, 'Pharma CI', false, 'Anti-inflammatoire'),
('Aspirine', 'Acide acétylsalicylique', 'Comprimé', '500mg', 600, 480, 240, 360, 'Bayer', false, 'Antalgique et antiagrégant plaquettaire'),
('Ciprofloxacine', 'Ciprofloxacine', 'Comprimé', '500mg', 3500, 2800, 1400, 2100, 'Pharma CI', true, 'Antibiotique fluoroquinolone'),
('Métronidazole', 'Métronidazole', 'Comprimé', '250mg', 1500, 1200, 600, 900, 'Pharma CI', true, 'Antibiotique et antiparasitaire'),
('Oméprazole', 'Oméprazole', 'Gélule', '20mg', 2000, 1600, 800, 1200, 'Pharma CI', false, 'Inhibiteur de la pompe à protons'),
('Loratadine', 'Loratadine', 'Comprimé', '10mg', 1200, 960, 480, 720, 'Pharma CI', false, 'Antihistaminique'),
('Salbutamol', 'Salbutamol', 'Inhalateur', '100mcg', 4500, 3600, 1800, 2700, 'GSK', true, 'Bronchodilatateur');

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_medicament_nom ON public.medicament USING gin(to_tsvector('french', nom));
CREATE INDEX idx_medicament_dci ON public.medicament USING gin(to_tsvector('french', dci));