-- Insertion de données de test pour la fonctionnalité Association

-- Insérer des associations de test
INSERT INTO public.associations (id, nom, description, contact, responsable_id, statut, date_creation, nombre_membres) VALUES
(gen_random_uuid(), 'Association des Jeunes de Yopougon', 'Association dédiée à l''encadrement et à l''épanouissement des jeunes du quartier de Yopougon', 'contact@ajy.ci | 0707123456', 'yao-jeremie-user-id', 'active', '2024-01-15', 25),
(gen_random_uuid(), 'Coopérative des Femmes Entrepreneures', 'Coopérative pour soutenir l''entrepreneuriat féminin et le développement économique local', 'info@cfentrepreneures.ci | 0708987654', 'yao-jeremie-user-id', 'active', '2024-02-20', 18),
(gen_random_uuid(), 'Club Sportif Espoir', 'Club de football et d''activités sportives pour tous les âges', 'espoir.sport@gmail.com | 0701234567', 'yao-jeremie-user-id', 'active', '2024-03-10', 32);

-- Récupérer les IDs des associations pour les utiliser dans les autres tables
-- (En réalité, nous utiliserons des UUIDs générés)

-- Insérer des membres pour l'Association des Jeunes de Yopougon
WITH association_jeunes AS (
  SELECT id FROM public.associations WHERE nom = 'Association des Jeunes de Yopougon' LIMIT 1
)
INSERT INTO public.association_membres (association_id, nom, prenom, email, telephone, role, date_adhesion, cotisation_a_jour, montant_cotisation, dernier_paiement)
SELECT 
  aj.id,
  'Kouassi',
  'Yao Jérémie',
  'yao.jeremie@email.ci',
  '0707123456',
  'president',
  '2024-01-15',
  true,
  50000,
  '2024-01-15'
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Koffi',
  'Marie-Claire',
  'marie.koffi@email.ci',
  '0708234567',
  'tresorier',
  '2024-01-20',
  true,
  30000,
  '2024-01-20'
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Diabaté',
  'Sekou',
  'sekou.diabate@email.ci',
  '0709345678',
  'secretaire',
  '2024-01-25',
  false,
  30000,
  NULL
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Traore',
  'Aminata',
  'aminata.traore@email.ci',
  '0701456789',
  'membre',
  '2024-02-01',
  true,
  25000,
  '2024-02-01'
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Bamba',
  'Adama',
  'adama.bamba@email.ci',
  '0702567890',
  'membre',
  '2024-02-10',
  false,
  25000,
  NULL
FROM association_jeunes aj;

-- Insérer des membres pour la Coopérative des Femmes Entrepreneures
WITH association_femmes AS (
  SELECT id FROM public.associations WHERE nom = 'Coopérative des Femmes Entrepreneures' LIMIT 1
)
INSERT INTO public.association_membres (association_id, nom, prenom, email, telephone, role, date_adhesion, cotisation_a_jour, montant_cotisation, dernier_paiement)
SELECT 
  af.id,
  'Kouassi',
  'Yao Jérémie',
  'yao.jeremie@email.ci',
  '0707123456',
  'president',
  '2024-02-20',
  true,
  75000,
  '2024-02-20'
FROM association_femmes af
UNION ALL
SELECT 
  af.id,
  'Ouattara',
  'Fatoumata',
  'fatoumata.ouattara@email.ci',
  '0703678901',
  'vice-president',
  '2024-02-22',
  true,
  50000,
  '2024-02-22'
FROM association_femmes af
UNION ALL
SELECT 
  af.id,
  'Coulibaly',
  'Aïcha',
  'aicha.coulibaly@email.ci',
  '0704789012',
  'tresorier',
  '2024-02-25',
  true,
  50000,
  '2024-02-25'
FROM association_femmes af;

-- Insérer des annonces pour l'Association des Jeunes
WITH association_jeunes AS (
  SELECT id FROM public.associations WHERE nom = 'Association des Jeunes de Yopougon' LIMIT 1
)
INSERT INTO public.association_annonces (association_id, titre, contenu, auteur_id, priorite, visible_jusqu)
SELECT 
  aj.id,
  'Assemblée Générale 2024',
  'Nous avons le plaisir de vous convier à notre assemblée générale annuelle qui se tiendra le samedi 15 juin 2024 à 9h00 dans nos locaux. Ordre du jour : bilan des activités, présentation des comptes, projets 2024.',
  'system',
  'haute',
  '2024-06-15'
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Formation en Leadership',
  'Formation gratuite en leadership et gestion de projet pour les jeunes de 18 à 30 ans. Inscriptions ouvertes jusqu''au 30 mai 2024. Places limitées !',
  'system',
  'moyenne',
  '2024-05-30'
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Tournoi de Football Inter-Quartiers',
  'Organisation d''un tournoi de football pour rapprocher les jeunes des différents quartiers. Venez nombreux supporter nos équipes !',
  'system',
  'normale',
  NULL
FROM association_jeunes aj;

-- Insérer des dépenses pour l'Association des Jeunes
WITH association_jeunes AS (
  SELECT id FROM public.associations WHERE nom = 'Association des Jeunes de Yopougon' LIMIT 1
)
INSERT INTO public.association_depenses (association_id, description, montant, categorie, responsable_id, date_depense, approuve)
SELECT 
  aj.id,
  'Achat de matériel informatique pour la formation',
  250000,
  'Équipement',
  'system',
  '2024-03-15',
  true
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Frais de location de salle pour l''assemblée générale',
  50000,
  'Événement',
  'system',
  '2024-04-01',
  true
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Transport pour visite de terrain',
  75000,
  'Transport',
  'system',
  '2024-04-10',
  false
FROM association_jeunes aj
UNION ALL
SELECT 
  aj.id,
  'Achat de fournitures de bureau',
  35000,
  'Administration',
  'system',
  '2024-04-15',
  true
FROM association_jeunes aj;

-- Insérer des dépenses pour la Coopérative des Femmes
WITH association_femmes AS (
  SELECT id FROM public.associations WHERE nom = 'Coopérative des Femmes Entrepreneures' LIMIT 1
)
INSERT INTO public.association_depenses (association_id, description, montant, categorie, responsable_id, date_depense, approuve)
SELECT 
  af.id,
  'Formation en gestion d''entreprise',
  180000,
  'Formation',
  'system',
  '2024-03-20',
  true
FROM association_femmes af
UNION ALL
SELECT 
  af.id,
  'Matériel de communication (flyers, affiches)',
  45000,
  'Communication',
  'system',
  '2024-04-05',
  true
FROM association_femmes af;

-- Mettre à jour le nombre de membres dans les associations
UPDATE public.associations 
SET nombre_membres = (
  SELECT COUNT(*) 
  FROM public.association_membres 
  WHERE association_id = associations.id
);

-- Insérer quelques annonces pour la Coopérative des Femmes
WITH association_femmes AS (
  SELECT id FROM public.associations WHERE nom = 'Coopérative des Femmes Entrepreneures' LIMIT 1
)
INSERT INTO public.association_annonces (association_id, titre, contenu, auteur_id, priorite)
SELECT 
  af.id,
  'Atelier Business Plan',
  'Atelier pratique pour élaborer votre business plan. Animé par des experts en entrepreneuriat. Inscription obligatoire.',
  'system',
  'haute'
FROM association_femmes af
UNION ALL
SELECT 
  af.id,
  'Marché des Femmes Entrepreneures',
  'Exposition-vente de nos produits et services. Venez découvrir le savoir-faire de nos membres !',
  'system',
  'moyenne'
FROM association_femmes af;