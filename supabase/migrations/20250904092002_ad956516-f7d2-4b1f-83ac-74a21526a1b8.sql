-- Ajouter les nouvelles radios locales et internationales
INSERT INTO public.radios (nom, description, flux_url, logo_url, is_active) VALUES
-- Radios locales
('Life Radio 107.7', 'Musique', 'https://stream.liferadio.ci/live', NULL, true),
('JAM', 'Musique', 'https://stream.jamradio.ci/live', NULL, true),
('TRACE FM', 'Musique', 'https://stream.tracefm.ci/live', NULL, true),
('AL BAYANE', 'Religion', 'https://stream.albayane.ci/live', NULL, true),
('FM 88.2', 'Religion', 'https://stream.fm882.ci/live', NULL, true),
('Zoh FM', 'Société', 'https://stream.zohfm.ci/live', NULL, true),
('Fréquence 2', 'Actualité Société', 'https://stream.frequence2.ci/live', NULL, true),
('Radio Côte d''Ivoire', 'Actualité Société', 'https://stream.radioci.ci/live', NULL, true),

-- Radios en langues étrangères
('BBC News', 'Actualités en Anglais', 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', 'https://logoeps.com/wp-content/uploads/2013/03/bbc-vector-logo.png', true),
('Virgin Radio UK', 'Musique en Anglais', 'https://radio.virginradio.co.uk/stream', 'https://logos-world.net/wp-content/uploads/2020/11/Virgin-Logo.png', true),
('RNE', 'Radio en Espagnol', 'https://stream.rne.es/live', NULL, true),
('Cadena SER', 'Radio en Espagnol', 'https://stream.cadenaser.com/live', NULL, true),
('RTB', 'Radio du Burkina Faso', 'https://stream.rtb.bf/live', NULL, true);