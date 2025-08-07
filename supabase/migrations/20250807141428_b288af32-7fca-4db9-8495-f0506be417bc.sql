-- Insertion de données de test simples pour la fonctionnalité Association

-- Insérer des associations de test
INSERT INTO public.associations (nom, description, contact, statut, date_creation, nombre_membres) VALUES
('Association des Jeunes de Yopougon', 'Association dédiée à l''encadrement et à l''épanouissement des jeunes du quartier de Yopougon', 'contact@ajy.ci | 0707123456', 'active', '2024-01-15'::date, 5),
('Coopérative des Femmes Entrepreneures', 'Coopérative pour soutenir l''entrepreneuriat féminin et le développement économique local', 'info@cfentrepreneures.ci | 0708987654', 'active', '2024-02-20'::date, 3),
('Club Sportif Espoir', 'Club de football et d''activités sportives pour tous les âges', 'espoir.sport@gmail.com | 0701234567', 'active', '2024-03-10'::date, 0);