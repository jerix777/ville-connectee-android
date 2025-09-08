-- Créer une table pour les établissements de santé
CREATE TABLE public.etablissements_sante (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hopital', 'pharmacie', 'clinique', 'centre_sante')),
  adresse TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  telephone TEXT,
  email TEXT,
  horaires TEXT,
  services TEXT[], -- Array des services disponibles
  urgences BOOLEAN DEFAULT false, -- Si c'est un service d'urgence
  garde_permanente BOOLEAN DEFAULT false, -- Si ouvert 24h/24
  quartier_id UUID,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.etablissements_sante ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Public can view health establishments" 
ON public.etablissements_sante 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create health establishments" 
ON public.etablissements_sante 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update health establishments" 
ON public.etablissements_sante 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete health establishments" 
ON public.etablissements_sante 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Créer un index spatial pour optimiser les requêtes de géolocalisation
CREATE INDEX idx_etablissements_sante_location ON public.etablissements_sante (latitude, longitude);

-- Index pour le type d'établissement
CREATE INDEX idx_etablissements_sante_type ON public.etablissements_sante (type);

-- Fonction pour calculer la distance entre deux points (formule haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL, 
  lon1 DECIMAL, 
  lat2 DECIMAL, 
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * 
      cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * 
      sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Insérer quelques données d'exemple
INSERT INTO public.etablissements_sante (nom, type, adresse, latitude, longitude, telephone, services, urgences, garde_permanente, description) VALUES
('Hôpital Central de Ouellé', 'hopital', 'Centre-ville, Ouellé', 5.320000, -4.020000, '+225 XX XX XX XX', ARRAY['chirurgie', 'maternite', 'pediatrie', 'cardiologie'], true, true, 'Hôpital principal avec service d''urgences 24h/24'),
('Clinique Saint-Joseph', 'clinique', 'Quartier Résidentiel, Ouellé', 5.325000, -4.015000, '+225 XX XX XX XX', ARRAY['consultation', 'analyses', 'radiologie'], false, false, 'Clinique privée spécialisée en consultations'),
('Pharmacie de la Paix', 'pharmacie', 'Avenue Principale, Ouellé', 5.322000, -4.018000, '+225 XX XX XX XX', ARRAY['medicaments', 'conseil', 'premiers_secours'], false, false, 'Pharmacie de garde avec service de conseil'),
('Centre de Santé Communautaire', 'centre_sante', 'Quartier Populaire, Ouellé', 5.318000, -4.025000, '+225 XX XX XX XX', ARRAY['vaccination', 'consultation', 'planning_familial'], false, false, 'Centre de santé communautaire pour soins de base'),
('Pharmacie Moderne', 'pharmacie', 'Marché Central, Ouellé', 5.319000, -4.022000, '+225 XX XX XX XX', ARRAY['medicaments', 'materiel_medical'], false, true, 'Pharmacie moderne ouverte 24h/24'),
('Clinique de l''Espoir', 'clinique', 'Zone Industrielle, Ouellé', 5.315000, -4.030000, '+225 XX XX XX XX', ARRAY['chirurgie_ambulatoire', 'ophtalmologie', 'dentaire'], false, false, 'Clinique spécialisée en chirurgie ambulatoire');