CREATE TABLE module_visibility (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO module_visibility (id, name, is_public) VALUES
('annuaire', 'Annuaire', TRUE),
('sante', 'Santé à proximité', TRUE),
('immobilier', 'Immobilier', TRUE),
('hotelerie', 'Hôtellerie', TRUE),
('maquis_resto', 'Maquis & Resto', TRUE),
('marche', 'Marché', TRUE),
('carburant_gaz', 'Carburant & Gaz', TRUE),
('services', 'Services & Commerces', TRUE),
('main_doeuvre', 'Main d''oeuvre', TRUE),
('associations', 'Associations', TRUE),
('catalogue', 'Catalogue', TRUE),
('souvenirs', 'Souvenirs', TRUE),
('necrologie', 'Nécrologie', TRUE),
('evenements', 'Evènements', TRUE),
('annonces', 'Annonces', TRUE),
('emplois', 'Offres d''emploi', TRUE),
('actualites', 'Actualités', TRUE),
('alertes', 'Alertes', TRUE),
('radio', 'Radio', TRUE),
('jukebox', 'Jukebox', TRUE),
('taxi', 'Taxi', TRUE),
('taxi_communal', 'Taxi Communal', TRUE),
('steve_yobouet', 'Steve Yobouet', TRUE),
('tribune', 'Tribune', TRUE),
('suggestions', 'Suggestions', TRUE);
