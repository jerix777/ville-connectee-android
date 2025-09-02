-- Insérer quelques exemples de stations radio
INSERT INTO public.radios (nom, description, logo_url, flux_url, is_active) VALUES
(
  'Radio France Inter',
  'Radio de service public, information, culture et divertissement',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/France_Inter_logo_2021.svg/200px-France_Inter_logo_2021.svg.png',
  'https://icecast.radiofrance.fr/franceinter-hifi.aac',
  true
),
(
  'RTL',
  'La radio de référence pour l''information et le divertissement',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/RTL_logo_2015.svg/200px-RTL_logo_2015.svg.png',
  'https://streaming.radio.rtl.fr/rtl-1-48-192',
  true
),
(
  'Europe 1',
  'Radio généraliste française d''information et de divertissement',
  'https://upload.wikimedia.org/wikipedia/fr/thumb/b/be/Europe_1_logo_2018.svg/200px-Europe_1_logo_2018.svg.png',
  'https://europe1.lmn.fm/europe1.mp3',
  true
),
(
  'NRJ',
  'La radio des hits et de la musique pop/rock',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/NRJ_2015_logo.svg/200px-NRJ_2015_logo.svg.png',
  'https://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3',
  true
),
(
  'Skyrock',
  'Radio musicale orientée rap, R&B et musiques urbaines',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Skyrock_logo_2019.svg/200px-Skyrock_logo_2019.svg.png',
  'https://icecast.skyrock.net/s/natio_mp3_128k',
  true
),
(
  'RFI',
  'Radio France Internationale - Information mondiale en français',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/RFI_logo_2013.svg/200px-RFI_2013_logo.svg.png',
  'https://rfifm48k.ice.infomaniak.ch/rfifm-48.aac',
  true
);