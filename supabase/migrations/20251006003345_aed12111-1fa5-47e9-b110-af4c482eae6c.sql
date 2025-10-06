-- Ajouter un deuxième contact aux tables qui en ont besoin

-- Table associations
ALTER TABLE public.associations
ADD COLUMN IF NOT EXISTS contact2 TEXT;

-- Table etablissements_sante
ALTER TABLE public.etablissements_sante
ADD COLUMN IF NOT EXISTS telephone2 TEXT;

-- Table immobilier
ALTER TABLE public.immobilier
ADD COLUMN IF NOT EXISTS contact2 TEXT;

-- Table restaurants_buvettes
ALTER TABLE public.restaurants_buvettes
ADD COLUMN IF NOT EXISTS telephone2 TEXT;

-- Table services_commerces
ALTER TABLE public.services_commerces
ADD COLUMN IF NOT EXISTS contact2 TEXT;

-- Table stations_carburant
ALTER TABLE public.stations_carburant
ADD COLUMN IF NOT EXISTS telephone2 TEXT;

-- Table villages (si elle a un contact)
ALTER TABLE public.villages
ADD COLUMN IF NOT EXISTS contact TEXT,
ADD COLUMN IF NOT EXISTS contact2 TEXT;