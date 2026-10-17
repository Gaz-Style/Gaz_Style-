-- =======================================================================================
-- SANTIAGO HIKING · ATLAS ANDINO EXPANSION COMPLETA (30+ CUMBRES, TRAILHEADS Y SENDEROS Santiago Hiking)
-- Ecosistema Integral de la Region Metropolitana: Cerros Isla, Cordon Manquehue, San Carlos,
-- Sierra de Ramon, Cordon de los Espanoles, Cordillera Central (Farellones/Yerba Loca) y Cajon del Maipo.
-- =======================================================================================

-- =======================================================================================
-- 1. CUMBRES FISICAS Y MORROS OFICIALES (PUBLIC.PEAKS - 30+ CUMBRES)
-- =======================================================================================
INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-carbon', 'Cerro Carbón', 1365, 120, 'Cordón Manquehue',
    ARRAY['Vitacura', 'Huechuraba'], 'Cuenca del Mapocho', -33.3765, -70.598,
    'La gran cumbre de entrenamiento vespertino y trail running de Santiago. Asciende desde el Parque de la Chilenidad o Bosque Santiago con vistas directas al distrito financiero de Sanhattan y la cuenca poniente.',
    '{"es":"La gran cumbre de entrenamiento vespertino y trail running de Santiago. Asciende desde el Parque de la Chilenidad o Bosque Santiago con vistas directas al distrito financiero de Sanhattan y la cuenca poniente.","en":"Santiago premier fitness and sunset summit, rising right above Sanhattan financial district with striking views of the valley and the Andes.","pt":"O cume predileto para corrida de trilha e treino vespertino em Santiago, com vista privilegiada para os arranha-céus de Sanhattan.","fr":"Le sommet d entraînement incontournable dominant le quartier d affaires de Santiago et la cordillère.","de":"Der beliebteste After-Work-Gipfel für Bergläufer und Wanderer mit frontalem Blick auf die Skyline von Santiago."}'::jsonb,
    'Vista panorámica al distrito financiero Sanhattan, Torre Costanera, Cordillera de la Costa y cresta del Manquehue.',
    '{"es":"Vista panorámica al distrito financiero Sanhattan, Torre Costanera, Cordillera de la Costa y cresta del Manquehue.","en":"Panoramic view to Sanhattan financial district, Costanera Tower, Coastal Range and Manquehue ridge.","pt":"Vista panorâmica do centro financeiro, Costanera Center e crista do Manquehue.","fr":"Vue panoramique sur le quartier financier, la tour Costanera et le massif du Manquehue.","de":"Panoramablick auf die Hochhäuser, den Costanera Tower und den Manquehue-Kamm."}'::jsonb,
    'Histórico cerro de pastoreo y extracción de carbón de leña en el siglo XIX, hoy transformado en el mayor corredor biológico y deportivo urbano del sector nororiente.',
    '{"es":"Histórico cerro de pastoreo y extracción de carbón de leña en el siglo XIX, hoy transformado en el mayor corredor biológico y deportivo urbano del sector nororiente.","en":"Historical 19th-century charcoal harvesting hill, now transformed into Santiago most vital urban wildlife and running corridor.","pt":"Antiga colina de carvoeiros no século XIX, hoje um dos principais corredores ecológicos da cidade.","fr":"Ancien site de charbonniers au XIXe siècle, aujourd hui corridor écologique et sportif majeur.","de":"Historischer Köhlerberg aus dem 19. Jahrhundert, heute der wichtigste Fitness- und Naturkorridor der Stadt."}'::jsonb,
    ARRAY['cerro carbon', 'carbon santiago', 'trekking cerro carbon', 'saint george carbon', 'parque de la chilenidad'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-san-cristobal', 'Cerro San Cristóbal', 863, 280, 'Cerros Isla Valle Central',
    ARRAY['Providencia', 'Recoleta'], 'Cuenca del Mapocho', -33.4253, -70.6339,
    'El gran parque metropolitano urbano de Santiago. Coronado por la estatua de la Virgen de la Inmaculada Concepción y accesible mediante senderos de trekking patrimoniales como el Zorro Videla.',
    '{"es":"El gran parque metropolitano urbano de Santiago. Coronado por la estatua de la Virgen de la Inmaculada Concepción y accesible mediante senderos de trekking patrimoniales como el Zorro Videla.","en":"Santiago iconic central urban hill and sanctuary, featuring sweeping 360-degree cityscape vistas and historical walking trails.","pt":"O emblemático parque urbano e santuário de Santiago, oferecendo vistas de 360 graus da cidade e trilhas cercadas de vegetação.","fr":"La colline emblématique au cœur de Santiago, surmontée de la statue de la Vierge avec vue panoramique intégrale.","de":"Der ikonische Stadtberg von Santiago mit dem Heiligtum der Jungfrau Maria und fantastischem Rundblick über die Metropole."}'::jsonb,
    'Vista de 360 grados de toda la cuenca metropolitana, centro histórico, Providencia y la muralla de Los Andes.',
    '{"es":"Vista de 360 grados de toda la cuenca metropolitana, centro histórico, Providencia y la muralla de Los Andes.","en":"Full 360-degree panorama of downtown Santiago, Providencia and the looming Andean range.","pt":"Vista de 360 graus do centro de Santiago, Providencia e Cordilheira dos Andes.","fr":"Vue à 360 degrés sur le centre-ville de Santiago, Providencia et les Andes.","de":"360-Grad-Blick über das Stadtzentrum, Providencia und die mächtige Andenfront."}'::jsonb,
    'Conocido como Tupahue (Lugar de Dioses) por los pueblos picunches prehispánicos. Bautizado San Cristóbal por Pedro de Valdivia en honor al santo patrono de los viajeros.',
    '{"es":"Conocido como Tupahue (Lugar de Dioses) por los pueblos picunches prehispánicos. Bautizado San Cristóbal por Pedro de Valdivia en honor al santo patrono de los viajeros.","en":"Originally named Tupahue (Place of the Gods) by indigenous Picunche people, later named San Cristóbal by Spanish conquistadors.","pt":"Chamado Tupahue pelos indígenas pré-hispânicos, foi rebatizado pelos espanhóis no século XVI.","fr":"Appelé Tupahue par les peuples autochtones, renommé San Cristóbal par le fondateur de la ville en 1541.","de":"Ursprünglich Tupahue (Ort der Götter) der Picunche-Ureinwohner, 1541 von Pedro de Valdivia getauft."}'::jsonb,
    ARRAY['cerro san cristobal', 'parquemet', 'virgen san cristobal', 'sendero zorro videla', 'teleferico santiago'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-santa-lucia', 'Cerro Santa Lucía (Huelén)', 629, 69, 'Cerros Isla Valle Central',
    ARRAY['Santiago'], 'Cuenca del Mapocho', -33.4398, -70.6437,
    'El peñón basáltico fundacional de Santiago. Un monumento histórico ajardinado con escalinatas de piedra, fuentes neoclásicas y el Castillo Hidalgo en pleno corazón de la capital.',
    '{"es":"El peñón basáltico fundacional de Santiago. Un monumento histórico ajardinado con escalinatas de piedra, fuentes neoclásicas y el Castillo Hidalgo en pleno corazón de la capital.","en":"The founding rocky promontory of Santiago. A historical landscaped fortress with stone staircases, neoclassical fountains and panoramic lookouts.","pt":"O morro histórico onde Santiago foi fundada em 1541, repleto de terraços de pedra, castelos e fontes neoclássicas.","fr":"Le promontoire rocheux où Santiago fut fondée en 1541, orné de terrasses, de fontaines et du château Hidalgo.","de":"Der historische Gründungshügel von Santiago mit verwunschenen Steintreppen, Festungsanlagen und Panoramaterrassen."}'::jsonb,
    'Mirador privilegiado al casco histórico colonial, Alameda Libertador Bernardo O Higgins y la cordillera oriental.',
    '{"es":"Mirador privilegiado al casco histórico colonial, Alameda Libertador Bernardo O Higgins y la cordillera oriental.","en":"Historic view over colonial Santiago, Alameda Avenue and the distant Andean snowcaps.","pt":"Vista do centro histórico, da Alameda e da cordilheira.","fr":"Vue plongeante sur le centre historique et la chaîne des Andes.","de":"Blick über das historische Stadtzentrum und die schneebedeckten Andengipfel."}'::jsonb,
    'Llamado Huelén (Dolor o Melancolía) por los picunches. En sus faldas Pedro de Valdivia fundó la ciudad de Santiago de la Nueva Extremadura el 12 de febrero de 1541.',
    '{"es":"Llamado Huelén (Dolor o Melancolía) por los picunches. En sus faldas Pedro de Valdivia fundó la ciudad de Santiago de la Nueva Extremadura el 12 de febrero de 1541.","en":"Known as Huelén by indigenous natives. At its foot Pedro de Valdivia founded the city of Santiago on February 12, 1541.","pt":"Local sagrado pré-hispânico batizado Huelén, berço da fundação da capital chilena.","fr":"Lieu de mémoire autochtone nommé Huelén, où naquit la ville de Santiago en 1541.","de":"Ehemalige Kultstätte Huelén der Ureinwohner, Gründungsort von Santiago im Jahr 1541."}'::jsonb,
    ARRAY['cerro santa lucia', 'huelen', 'castillo hidalgo', 'santiago centro', 'turismo santiago'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-renca', 'Cerro Renca', 905, 350, 'Cerros de Renca',
    ARRAY['Renca', 'Quilicura'], 'Cuenca del Mapocho', -33.398, -70.718,
    'El coloso norponiente del valle de Santiago. Una cumbre solitaria coronada por una cruz monumental de 20 metros con una perspectiva aérea inédita de la cordillera de la Costa y el valle central.',
    '{"es":"El coloso norponiente del valle de Santiago. Una cumbre solitaria coronada por una cruz monumental de 20 metros con una perspectiva aérea inédita de la cordillera de la Costa y el valle central.","en":"The prominent northwestern island hill of Santiago basin, crowned by a 20-meter monumental cross offering vast westward views.","pt":"O imponente morro da zona noroeste de Santiago, com uma cruz monumental e visão desimpedida do vale metropolitano.","fr":"La colline emblématique du nord-ouest de Santiago, coiffée d une croix monumentale de 20 mètres.","de":"Der markante Einzelberg im Nordwesten von Santiago mit dem weithin sichtbaren 20-Meter-Gipfelkreuz."}'::jsonb,
    'Vista sin obstáculos al aeropuerto Pudahuel, Cordón de Chacabuco, Cordillera de la Costa y la cuenca de Santiago.',
    '{"es":"Vista sin obstáculos al aeropuerto Pudahuel, Cordón de Chacabuco, Cordillera de la Costa y la cuenca de Santiago.","en":"Unobstructed view to Santiago Airport, Chacabuco Range, Coastal Cordillera and metropolitan valley.","pt":"Vista panorâmica do aeroporto, serra da Costa e bacia de Santiago.","fr":"Vue dégagée sur l aéroport, la chaîne côtière et tout le bassin de Santiago.","de":"Freier Rundblick auf den Flughafen, das Küstengebirge und das gesamte Santiago-Becken."}'::jsonb,
    'Sitio ceremonial y de observación astronómica prehispánico. En sus quebradas se han hallado importantes vestigios de alfarería de las culturas Aconcagua e Inca.',
    '{"es":"Sitio ceremonial y de observación astronómica prehispánico. En sus quebradas se han hallado importantes vestigios de alfarería de las culturas Aconcagua e Inca.","en":"Indigenous ceremonial and astronomical site. Archaeological excavations have uncovered pre-Columbian Aconcagua and Inca pottery.","pt":"Antigo sítio cerimonial pré-colombiano com vestígios arqueológicos das culturas Aconcágua e Inca.","fr":"Site cérémoniel précolombien recelant de précieux vestiges des civilisations Aconcagua et Inca.","de":"Präkolumbische Kultstätte mit bedeutenden archäologischen Funden der Aconcagua- und Inka-Kulturen."}'::jsonb,
    ARRAY['cerro renca', 'cruz cerro renca', 'trekking renca', 'cerros isla santiago'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-chena', 'Cerro Chena', 720, 180, 'Cerro Isla Cuenca del Maipo',
    ARRAY['San Bernardo', 'Calera de Tango'], 'Cuenca del Maipo', -33.602, -70.735,
    'La fortaleza incaica más austral del Tawantinsuyu. Un cerro isla cargado de misticismo y arqueología andina en el límite sur de Santiago.',
    '{"es":"La fortaleza incaica más austral del Tawantinsuyu. Un cerro isla cargado de misticismo y arqueología andina en el límite sur de Santiago.","en":"The southernmost Inca fortress (Pukará) of the Inca Empire. An isolated hill steeped in Andean archaeology and solar solstice alignment.","pt":"A fortaleza inca mais meridional do Império Inca (Pucará de Chena), repleta de história e misticismo andino.","fr":"La forteresse inca la plus australe de l empire du Tawantinsuyu, sanctuaire archéologique majeur du sud de Santiago.","de":"Die südlichste Inka-Festung (Pukará) des Inkareiches mit faszinierenden Steinmauern und astronomischen Sonnenvisieren."}'::jsonb,
    'Dominio visual de todo el valle del Maipo, Angostura de Paine y los cordones montañosos precordilleranos del sur.',
    '{"es":"Dominio visual de todo el valle del Maipo, Angostura de Paine y los cordones montañosos precordilleranos del sur.","en":"Panoramic dominance over the Maipo river valley, Paine bottleneck and southern Andean foothills.","pt":"Vista ampla do vale do Maipo, Angostura de Paine e montanhas do sul.","fr":"Vue dominante sur la vallée du Maipo et la gorge d Angostura de Paine.","de":"Weitblick über das Maipo-Tal und die südlichen Ausläufer der Andenkette."}'::jsonb,
    'Alberga el Pucará de Chena, complejo ceremonial y militar inca con muros dobles concéntricos edificado para honrar al dios Sol (Inti) y vigilar la frontera sur del imperio.',
    '{"es":"Alberga el Pucará de Chena, complejo ceremonial y militar inca con muros dobles concéntricos edificado para honrar al dios Sol (Inti) y vigilar la frontera sur del imperio.","en":"Home to the Pucará de Chena, a 15th-century Inca stone fortress and solar calendar celebrating Inti Raymi at the winter solstice.","pt":"Abriga o Pucará de Chena, complexo militar e centro cerimonial sagrado dedicado ao culto solar.","fr":"Site du Pucará de Chena, forteresse et temple solaire inca du XVe siècle.","de":"Standort des Pucará de Chena, einer Inka-Festung und Sonnenkultstätte aus dem 15. Jahrhundert."}'::jsonb,
    ARRAY['cerro chena', 'pucara de chena', 'san bernardo', 'ruinas incas santiago', 'fortaleza inca'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-calan', 'Cerro Calán', 868, 110, 'Cerro Isla Las Condes',
    ARRAY['Las Condes'], 'Cuenca del Mapocho', -33.396, -70.536,
    'El cerro astronómico de Santiago. Alberga el histórico Observatorio Astronómico Nacional de la Universidad de Chile con senderos peatonales circulares y vistas a la precordillera.',
    '{"es":"El cerro astronómico de Santiago. Alberga el histórico Observatorio Astronómico Nacional de la Universidad de Chile con senderos peatonales circulares y vistas a la precordillera.","en":"Santiago astronomical hill, hosting the National Astronomical Observatory with scenic circular walking trails overlooking the eastern Andes.","pt":"O morro astronômico de Santiago, sede do Observatório Astronômico Nacional cercado por trilhas familiares e áreas verdes.","fr":"La colline astronomique de Santiago, accueillant l Observatoire Astronomique National et des promenades familiales boisées.","de":"Der Astronomiehügel von Santiago mit der Nationalen Sternwarte der Universidad de Chile und Panoramawegen."}'::jsonb,
    'Vista despejada a la Sierra de Ramón (Cerro Provincia y San Ramón) y el valle urbano de Las Condes.',
    '{"es":"Vista despejada a la Sierra de Ramón (Cerro Provincia y San Ramón) y el valle urbano de Las Condes.","en":"Clear vistas of the Sierra de Ramón range (Provincia and San Ramón peaks) and the Las Condes district.","pt":"Vista limpa para a Serra de Ramón e os bairros da zona leste.","fr":"Vue dégagée sur la Sierra de Ramón et les quartiers est de la ville.","de":"Freier Blick auf die mächtige Sierra de Ramón und den Stadtteil Las Condes."}'::jsonb,
    'Elegido en 1954 por el astrónomo Federico Rutllant por sus condiciones de cielo limpio para instalar la sede del Observatorio Astronómico Nacional de Chile.',
    '{"es":"Elegido en 1954 por el astrónomo Federico Rutllant por sus condiciones de cielo limpio para instalar la sede del Observatorio Astronómico Nacional de Chile.","en":"Chosen in 1954 as the permanent home of Chile National Astronomical Observatory due to clean atmospheric clarity.","pt":"Escolha histórica de 1954 para sediar as observações dos céus do hemisfério sul.","fr":"Choisi en 1954 pour accueillir le grand observatoire national chilien.","de":"1954 aufgrund der klaren Himmelsbedingungen zum Sitz der Nationalsternwarte Chiles ernannt."}'::jsonb,
    ARRAY['cerro calan', 'parque cerro calan', 'observatorio cerro calan', 'trekking las condes'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-blanco', 'Cerro Blanco', 637, 85, 'Cerros Isla Valle Central',
    ARRAY['Recoleta'], 'Cuenca del Mapocho', -33.418, -70.648,
    'Antiguo santuario ceremonial y cantera de piedra blanca colonial. Un cerro isla de gran valor arqueológico frente a la ribera norte del Mapocho.',
    '{"es":"Antiguo santuario ceremonial y cantera de piedra blanca colonial. Un cerro isla de gran valor arqueológico frente a la ribera norte del Mapocho.","en":"Ancient indigenous ceremonial sanctuary and colonial white stone quarry, situated on the northern bank of the Mapocho river.","pt":"Antigo santuário cerimonial indígena e pedreira histórica na zona norte de Santiago.","fr":"Ancien sanctuaire autochtone et carrière de pierre blanche coloniale en bordure du fleuve Mapocho.","de":"Historischer Kultplatz der Ureinwohner und ehemaliger Steinbruch für koloniale Bauwerke in Santiago."}'::jsonb,
    'Mirador a la zona norte de Santiago, cerro San Cristóbal y Cementerio General histórico.',
    '{"es":"Mirador a la zona norte de Santiago, cerro San Cristóbal y Cementerio General histórico.","en":"View of north Santiago, San Cristóbal hill and historical heritage cemeteries.","pt":"Vista da zona norte de Santiago e do Cerro San Cristóbal.","fr":"Vue sur le secteur nord de Santiago et le cerro San Cristóbal.","de":"Ausblick auf den Norden der Hauptstadt und den San Cristóbal Hügel."}'::jsonb,
    'Denominado Huechuraba por los pueblos nativos. Sus rocas calcáreas blancas fueron usadas para edificar la Iglesia de San Francisco y los tajamares del Mapocho en el siglo XVI y XVII.',
    '{"es":"Denominado Huechuraba por los pueblos nativos. Sus rocas calcáreas blancas fueron usadas para edificar la Iglesia de San Francisco y los tajamares del Mapocho en el siglo XVI y XVII.","en":"Named Huechuraba by indigenous tribes. Its white stone was quarried to build Santiago oldest church (San Francisco) in the 16th century.","pt":"Pedreira histórica usada na construção dos edifícios coloniais mais antigos do Chile.","fr":"Ses pierres blanches ont servi à bâtir l église Saint-François au XVIe siècle.","de":"Weißer Kalksteinbruch für die ältesten Kirchenbauten Santiagos im 16. und 17. Jahrhundert."}'::jsonb,
    ARRAY['cerro blanco', 'recoleta', 'huechuraba cerro', 'cerros isla santiago'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-canoitas', 'Cerro Canoitas', 1520, 95, 'Sierra de Ramón / Parque Las Varas',
    ARRAY['Las Condes', 'Lo Barnechea'], 'Cuenca del Mapocho', -33.388, -70.472,
    'Cumbre de transición entre los valles de San Carlos de Apoquindo y Las Varas. Un mirador privilegiado sobre la quebrada de San Ramón y los espinales de la precordillera.',
    '{"es":"Cumbre de transición entre los valles de San Carlos de Apoquindo y Las Varas. Un mirador privilegiado sobre la quebrada de San Ramón y los espinales de la precordillera.","en":"A scenic ridge peak linking San Carlos de Apoquindo and Las Varas valleys, offering quiet trails and pristine native sclerophyll forest.","pt":"Pico de transição cênico entre San Carlos de Apoquindo e Las Varas com trilhas cercadas por mata nativa.","fr":"Sommet de liaison entre les vallées de San Carlos et de Las Varas, au cœur de la forêt sclérophylle andine.","de":"Aussichtsreicher Übergangsgipfel zwischen San Carlos de Apoquindo und dem Las Varas Park."}'::jsonb,
    'Vistas frontales al morro Las Papas, morro Guayacán y la cresta alta del Cerro Provincia.',
    '{"es":"Vistas frontales al morro Las Papas, morro Guayacán y la cresta alta del Cerro Provincia.","en":"Direct front views of Morro Las Papas, Morro Guayacán and the high ridge of Mount Provincia.","pt":"Visão direta para os morros Las Papas, Guayacán e a crista do Provincia.","fr":"Vue directe sur le Morro Las Papas et la crête du Cerro Provincia.","de":"Frontalblick auf den Morro Las Papas und den Hauptkamm des Cerro Provincia."}'::jsonb,
    'Ruta tradicional de arriería que conectaba los fundos cordilleranos de San Carlos y San Enrique antes de la urbanización del valle.',
    '{"es":"Ruta tradicional de arriería que conectaba los fundos cordilleranos de San Carlos y San Enrique antes de la urbanización del valle.","en":"Historic muleteer trail connecting mountain ranch estates before the urban expansion of eastern Santiago.","pt":"Antiga rota de tropeiros que cruzava as fazendas coloniais do sopé andino.","fr":"Ancien sentier de muletiers reliant les grands domaines agricoles de la vallée.","de":"Historischer Maultierpfad der Hirten vor der Besiedlung der östlichen Stadtteile."}'::jsonb,
    ARRAY['cerro canoitas', 'las varas', 'san carlos apoquindo', 'parque cordillera canoitas'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-las-varas', 'Cerro Las Varas', 1200, 75, 'Parque Las Varas',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.372, -70.485,
    'El corazón del Parque Las Varas en Lo Barnechea. Un cerro de suaves lomas y senderos fluidos de trail running entre bosques de boldos, quillayes y litres.',
    '{"es":"El corazón del Parque Las Varas en Lo Barnechea. Un cerro de suaves lomas y senderos fluidos de trail running entre bosques de boldos, quillayes y litres.","en":"The heart of Las Varas Park in Lo Barnechea. Gentle hills and smooth trail running paths amidst thick native Mediterranean woodland.","pt":"O centro do Parque Las Varas, com trilhas fluidas para corrida de montanha e caminhadas em meio à mata nativa.","fr":"Le cœur du parc Las Varas, célèbre pour ses sentiers de trail running fluides et sa forêt préservée.","de":"Das Herzstück des Las Varas Parks in Lo Barnechea mit herrlichen Trailrunning- und Wanderpfaden."}'::jsonb,
    'Vista al valle de La Dehesa, Portezuelo del Manquehue y estribaciones del Pochoco.',
    '{"es":"Vista al valle de La Dehesa, Portezuelo del Manquehue y estribaciones del Pochoco.","en":"Lookout over La Dehesa valley, Manquehue pass and Pochoco foothills.","pt":"Vista panorâmica do vale de La Dehesa e do Cerro Pochoco.","fr":"Vue sur la vallée de La Dehesa et les contreforts du Pochoco.","de":"Blick über das Tal von La Dehesa und die Ausläufer des Pochoco."}'::jsonb,
    'Perteneciente al antiguo Fundo San Enrique, preservado como reserva privada abierta al deporte de montaña y conservación de flora esclerófila.',
    '{"es":"Perteneciente al antiguo Fundo San Enrique, preservado como reserva privada abierta al deporte de montaña y conservación de flora esclerófila.","en":"Part of the historic San Enrique estate, now conserved as a dedicated open sanctuary for outdoor sports and native flora preservation.","pt":"Antiga propriedade colonial preservada para conservação ecológica e esporte ao ar livre.","fr":"Ancien domaine seigneurial transformé en réserve sportive et écologique.","de":"Historisches Landgut, heute als offener Naturpark für Bergsport und Naturschutz erhalten."}'::jsonb,
    ARRAY['cerro las varas', 'parque las varas', 'trail running lo barnechea', 'las varas trekking'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'morro-buitrero', 'Morro Buitrero', 2150, 140, 'Cordón de los Españoles',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.328, -70.442,
    'La gran torre de roca intermedia del Cordón de los Españoles. Un mirador agreste sobre el cañón del río San Francisco y el Santuario de la Naturaleza.',
    '{"es":"La gran torre de roca intermedia del Cordón de los Españoles. Un mirador agreste sobre el cañón del río San Francisco y el Santuario de la Naturaleza.","en":"The rugged granite pinnacle of the Cordón de los Españoles ridge, overlooking the deep San Francisco river canyon and condor nesting cliffs.","pt":"O imponente promontório rochoso da cordilheira dos Espanhóis com vista vertiginosa do cânion de San Francisco.","fr":"L éperon rocheux sauvage du Cordón de los Españoles dominant les gorges du río San Francisco.","de":"Der markante Felsturm des Cordón de los Españoles über der Schlucht des San Francisco Flusses."}'::jsonb,
    'Vista al Cerro Pochoco al sur, Cerro Carpa al norte y los glaciares del macizo del Plomo hacia el este.',
    '{"es":"Vista al Cerro Pochoco al sur, Cerro Carpa al norte y los glaciares del macizo del Plomo hacia el este.","en":"Spectacular vistas to Mount Pochoco southward, Mount Carpa northward and Plomo glaciers in the east.","pt":"Vistas panorâmicas para o Pochoco, Carpa e as geleiras do El Plomo.","fr":"Panorama grandiose sur le Pochoco, le Carpa et les glaciers du Plomo.","de":"Blick nach Süden zum Pochoco, nach Norden zum Carpa und nach Osten zu den Gletschern des El Plomo."}'::jsonb,
    'Llamado Buitrero por las tradicionales colonias de cóndores y jotes cordilleranos que utilizan sus farellones rocosos como posaderos térmicos matinales.',
    '{"es":"Llamado Buitrero por las tradicionales colonias de cóndores y jotes cordilleranos que utilizan sus farellones rocosos como posaderos térmicos matinales.","en":"Named Buitrero after the resident condor and vulture colonies that nest and launch from its thermal granite cliffs.","pt":"Batizado assim devido aos paredões verticais utilizados pelos condores andinos para nidificação.","fr":"Nommé d après les colonies de condors andins nichant dans ses parois rocheuses abruptes.","de":"Benannt nach den Andenkondoren, die in den Felswänden des Gipfels nisten und aufsteigen."}'::jsonb,
    ARRAY['morro buitrero', 'cordon de los espanoles', 'pochoco carpa', 'travesia los espanoles'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'loma-de-la-vaca', 'Loma de la Vaca', 1950, 80, 'Cordón de los Españoles',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.345, -70.451,
    'Paso intermedio y descanso estratégico en el filo entre el Cerro Pochoco y el Morro Buitrero. Una suave meseta de pastizales de altura con vistas a ambos valles.',
    '{"es":"Paso intermedio y descanso estratégico en el filo entre el Cerro Pochoco y el Morro Buitrero. Una suave meseta de pastizales de altura con vistas a ambos valles.","en":"Strategic ridge pass and grassy plateau between Pochoco and Morro Buitrero, with dual views over both valleys.","pt":"Planalto intermediário na crista entre o Pochoco e o Buitrero, ideal para descanso com visão deslumbrante.","fr":"Plateau herbeux d altitude sur l arête reliant le Pochoco au Morro Buitrero.","de":"Strategischer Rastplatz auf dem Kamm zwischen dem Pochoco und dem Morro Buitrero."}'::jsonb,
    'Vista al Santuario de la Naturaleza El Arrayán y los cordones montañosos de Farellones.',
    '{"es":"Vista al Santuario de la Naturaleza El Arrayán y los cordones montañosos de Farellones.","en":"Lookout over El Arrayán nature sanctuary and Farellones ski peaks.","pt":"Vista panorâmica do Santuário El Arrayán e montanhas de Farellones.","fr":"Vue sur le sanctuaire naturel d El Arrayán et la route de Farellones.","de":"Blick auf das Naturschutzgebiet El Arrayán und die Skiberge von Farellones."}'::jsonb,
    'Antiguo paraje de veranada donde los arrieros de El Arrayán dejaban pastar al ganado en las praderas de altura a fines de primavera.',
    '{"es":"Antiguo paraje de veranada donde los arrieros de El Arrayán dejaban pastar al ganado en las praderas de altura a fines de primavera.","en":"Traditional summer pasture used by mountain muleteers to graze cattle in late spring.","pt":"Pastagem de verão histórica utilizada pelos tropeiros da cordilheira.","fr":"Ancien alpage d été utilisé par les éleveurs de montagne.","de":"Historische Sommerweide der Maultiertreiber von El Arrayán."}'::jsonb,
    ARRAY['loma de la vaca', 'filo pochoco', 'cordon espanoles', 'trekking lo barnechea'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-conchali', 'Cerro Conchalí', 2750, 210, 'Cordón de los Españoles',
    ARRAY['Lo Barnechea', 'Colina'], 'Cuenca del Mapocho', -33.285, -70.435,
    'El remate norte del gran Cordón de los Españoles. Una cumbre solitaria y agreste que domina el paso hacia las termas de Colina y el estero San Francisco.',
    '{"es":"El remate norte del gran Cordón de los Españoles. Una cumbre solitaria y agreste que domina el paso hacia las termas de Colina y el estero San Francisco.","en":"The northern anchor of the Cordón de los Españoles range, a remote and rugged summit towering over Colina and San Francisco valleys.","pt":"O cume mais setentrional da Cordilheira dos Espanhóis, isolado e selvagem na fronteira com Colina.","fr":"Le sommet terminal nord du Cordón de los Españoles, sauvage et grandiose.","de":"Der nördliche Abschluss des Cordón de los Españoles, ein einsamer Hochgipfel an der Grenze zu Colina."}'::jsonb,
    'Visión total del valle de Colina, macizo del Carpa y las altas cumbres de Chacabuco.',
    '{"es":"Visión total del valle de Colina, macizo del Carpa y las altas cumbres de Chacabuco.","en":"Total view of Colina valley, Mount Carpa massif and high Chacabuco peaks.","pt":"Visão espetacular do vale de Colina e do maciço do Cerro Carpa.","fr":"Panorama total sur la vallée de Colina et le massif du Carpa.","de":"Vollständiger Rundblick auf das Colina-Tal und das Carpa-Massiv."}'::jsonb,
    'Hito limítrofe natural histórico entre las antiguas haciendas de Colina y los fundos cordilleranos de Lo Barnechea.',
    '{"es":"Hito limítrofe natural histórico entre las antiguas haciendas de Colina y los fundos cordilleranos de Lo Barnechea.","en":"Historic natural boundary dividing the ancient haciendas of Colina and the mountain lands of Lo Barnechea.","pt":"Fronteira natural histórica entre as grandes fazendas coloniais da região.","fr":"Frontière naturelle historique entre les grands domaines coloniaux.","de":"Historische Grenzmarke zwischen den kolonialen Ländereien von Colina und Lo Barnechea."}'::jsonb,
    ARRAY['cerro conchali', 'cerro carpa conchali', 'cordon de los espanoles colina', 'alta montana lo barnechea'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-san-roque', 'Cerro San Roque', 1980, 120, 'Valle El Arrayán',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.362, -70.428,
    'Cerro contiguo al Pochoco que flanquea el cañón del estero Arrayán. Ofrece un ascenso solitario y muy técnico sobre fuertes acarreos de piedra.',
    '{"es":"Cerro contiguo al Pochoco que flanquea el cañón del estero Arrayán. Ofrece un ascenso solitario y muy técnico sobre fuertes acarreos de piedra.","en":"Neighboring peak to Pochoco guarding the Arrayán river canyon. Offers a solitary, technical ascent over steep scree.","pt":"Vizinho ao Pochoco, oferece uma subida desafiadora e solitária pelas encostas íngremes do Arrayán.","fr":"Sommet voisin du Pochoco, offrant une ascension solitaire et technique au-dessus des gorges d El Arrayán.","de":"Nachbargipfel des Pochoco über der Arrayán-Schlucht mit steilem, einsamem Aufstieg."}'::jsonb,
    'Vista al Santuario de la Naturaleza, Pochoco y el valle de Santiago.',
    '{"es":"Vista al Santuario de la Naturaleza, Pochoco y el valle de Santiago.","en":"View of the Nature Sanctuary, Mount Pochoco and the Santiago valley.","pt":"Vista para o Santuário da Natureza e o vale de Santiago.","fr":"Vue sur le sanctuaire naturel et la vallée de Santiago.","de":"Blick auf das Naturschutzgebiet und das Tal von Santiago."}'::jsonb,
    'Tradicional refugio de arrieros y cazadores de guanacos en el siglo XIX antes de la creación del santuario.',
    '{"es":"Tradicional refugio de arrieros y cazadores de guanacos en el siglo XIX antes de la creación del santuario.","en":"Historical 19th-century shelter for local muleteers before the declaration of the nature sanctuary.","pt":"Refúgio histórico de tropeiros antes da fundação das reservas ecológicas.","fr":"Ancien refuge de muletiers au XIXe siècle.","de":"Historischer Zufluchtsort für Hirten im 19. Jahrhundert."}'::jsonb,
    ARRAY['cerro san roque', 'el arrayan', 'pochoco san roque', 'trekking lo barnechea'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-el-tambor', 'Cerro El Tambor', 2890, 115, 'Sierra de Ramón',
    ARRAY['Las Condes', 'Peñalolén'], 'Cuenca del Mapocho', -33.442, -70.448,
    'El hito cumbrero central que conecta el Cerro Provincia con el Cerro San Ramón. Paso obligado en la gran travesía integral de la Sierra de Ramón.',
    '{"es":"El hito cumbrero central que conecta el Cerro Provincia con el Cerro San Ramón. Paso obligado en la gran travesía integral de la Sierra de Ramón.","en":"The central ridge peak linking Mount Provincia with Mount San Ramón, an essential milestone on the grand Sierra de Ramón traverse.","pt":"O marco central do filo da Serra de Ramón que une o Provincia ao San Ramón na grande travessia.","fr":"Le sommet intermédiaire reliant le Cerro Provincia au Cerro San Ramón le long de la crête.","de":"Der zentrale Gratgipfel, der den Cerro Provincia mit dem Cerro San Ramón auf der Höhenüberquerung verbindet."}'::jsonb,
    'Abismo vertical hacia el estero San Ramón por el oeste y el cajón del río Colorado por el este.',
    '{"es":"Abismo vertical hacia el estero San Ramón por el oeste y el cajón del río Colorado por el este.","en":"Dramatic dropoffs towards San Ramón creek to the west and Colorado river basin to the east.","pt":"Paredões verticais com vistas espetaculares para ambos os lados da serra.","fr":"Vue plongeante vertigineuse sur les deux versants de la chaîne.","de":"Spektakuläre Steilabfälle auf beiden Seiten des Hauptkammes."}'::jsonb,
    'Bautizado El Tambor por los arrieros debido al eco profundo y retumbante que produce el viento al golpear sus paredes rocosas durante las tormentas.',
    '{"es":"Bautizado El Tambor por los arrieros debido al eco profundo y retumbante que produce el viento al golpear sus paredes rocosas durante las tormentas.","en":"Named The Drum by muleteers because of the deep echoing sound generated by high winds striking its rock face during storms.","pt":"Chamado O Tambor pelo eco sonoro do vento que ressoa nas rochas durante tempestades.","fr":"Nommé Le Tambour en raison de l écho puissant provoqué par le vent contre ses parois.","de":"Benannt nach dem trommelartigen Echo, das schwere Stürme an den Felswänden erzeugen."}'::jsonb,
    ARRAY['cerro el tambor', 'travesia sierra de ramon', 'provincia san ramon tambor', 'sierra de ramon'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'punta-de-damas', 'Punta de Damas', 3149, 160, 'Sierra de Ramón',
    ARRAY['Peñalolén', 'La Florida'], 'Cuenca del Maipo', -33.475, -70.452,
    'El segundo gigante sobre los 3.000 metros de la Sierra de Ramón. Una afilada pirámide de roca que domina la cuenca sur de Santiago y el cajón del río Colorado.',
    '{"es":"El segundo gigante sobre los 3.000 metros de la Sierra de Ramón. Una afilada pirámide de roca que domina la cuenca sur de Santiago y el cajón del río Colorado.","en":"The second 3,000m+ giant of the Sierra de Ramón, a sharp rock pyramid overlooking southern Santiago and the Colorado river.","pt":"O segundo cume acima de 3.000 metros da Serra de Ramón, com formato piramidal e visual imponente.","fr":"Le second sommet de plus de 3 000 m de la Sierra de Ramón, pyramide rocheuse dominant le sud de Santiago.","de":"Der zweithöchste Gipfel der Sierra de Ramón über 3.000 m, eine scharfe Felspyramide über dem Süden der Stadt."}'::jsonb,
    'Vista al Volcán Tupungatito, Volcán San José, Cerro San Ramón y la gran llanura de Santiago sur.',
    '{"es":"Vista al Volcán Tupungatito, Volcán San José, Cerro San Ramón y la gran llanura de Santiago sur.","en":"Vistas to Tupungatito Volcano, San José Volcano, San Ramón summit and the southern Santiago plain.","pt":"Visão privilegiada dos vulcões Tupungatito e San José e do sul metropolitano.","fr":"Panorama grandiose sur les volcans Tupungatito et San José.","de":"Blick auf die Vulkane Tupungatito und San José sowie die südliche Metropolregion."}'::jsonb,
    'Registrada en los anales del montañismo chileno desde principios del siglo XX como una de las ascensiones más técnicas de la precordillera central.',
    '{"es":"Registrada en los anales del montañismo chileno desde principios del siglo XX como una de las ascensiones más técnicas de la precordillera central.","en":"Chronicled in Chilean mountaineering history since the early 20th century as one of the most demanding precordillera climbs.","pt":"Histórica cumbre explorada pelos pioneiros do montanhismo chileno no início do século XX.","fr":"Ascension pionnière du début du XXe siècle réputée pour sa technicité.","de":"Bereits Anfang des 20. Jahrhunderts von Pionieren des chilenischen Bergsteigens bezwungen."}'::jsonb,
    ARRAY['punta de damas', 'sierra de ramon 3000', 'travesia ramon damas', 'quebrada de macul damas'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-tarapaca', 'Cerro Tarapacá', 2920, 95, 'Sierra de Ramón',
    ARRAY['La Florida'], 'Cuenca del Maipo', -33.498, -70.458,
    'Cumbre de arista que marca el descenso de la Sierra de Ramón hacia Las Minillas. Un espolón rocoso de gran belleza y aislamiento.',
    '{"es":"Cumbre de arista que marca el descenso de la Sierra de Ramón hacia Las Minillas. Un espolón rocoso de gran belleza y aislamiento.","en":"A high ridge summit marking the descent from Sierra de Ramón towards Minillas, isolated and wildly scenic.","pt":"Cume de crista que conecta a alta serra ao setor de Las Minillas em La Florida.","fr":"Sommet d arête marquant la transition de la Sierra de Ramón vers Las Minillas.","de":"Kammgipfel am Übergang von der hohen Sierra de Ramón hinab zu den Minillas."}'::jsonb,
    'Mirador sobre los contrafuertes de La Florida, Puente Alto y el curso del río Maipo.',
    '{"es":"Mirador sobre los contrafuertes de La Florida, Puente Alto y el curso del río Maipo.","en":"Overlook on the foothills of La Florida, Puente Alto and the Maipo river course.","pt":"Visão dos contrafortes de La Florida, Puente Alto e vale do Maipo.","fr":"Vue sur les contreforts de La Florida et le fleuve Maipo.","de":"Blick über die Ausläufer von La Florida, Puente Alto und das Maipo-Flussbett."}'::jsonb,
    'Bautizado en honor al regimiento histórico Tarapacá en las postrimerías de la Guerra del Pacífico a fines del siglo XIX.',
    '{"es":"Bautizado en honor al regimiento histórico Tarapacá en las postrimerías de la Guerra del Pacífico a fines del siglo XIX.","en":"Named in honor of the historic Tarapacá regiment in late 19th-century Chilean history.","pt":"Homenagem histórica aos regimentos chilenos do final do século XIX.","fr":"Nommé en hommage à l histoire nationale chilienne de la fin du XIXe siècle.","de":"Im späten 19. Jahrhundert zu Ehren des historischen Tarapacá-Regiments benannt."}'::jsonb,
    ARRAY['cerro tarapaca', 'sierra de ramon la florida', 'travesia minillas tarapaca'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-las-minillas', 'Cerro Las Minillas', 2467, 220, 'Sierra de Ramón',
    ARRAY['La Florida'], 'Cuenca del Maipo', -33.518, -70.468,
    'El bastión austral de la Sierra de Ramón. Una cumbre de fuerte desnivel que marca el inicio o remate de la travesía completa de la muralla de Santiago.',
    '{"es":"El bastión austral de la Sierra de Ramón. Una cumbre de fuerte desnivel que marca el inicio o remate de la travesía completa de la muralla de Santiago.","en":"The southern bastion of the Sierra de Ramón range, featuring steep climbing slopes and serving as the classic endpoint of the full traverse.","pt":"O cume meridional da Serra de Ramón em La Florida, ponto de partida ou chegada da grande travessia.","fr":"Le bastion sud de la Sierra de Ramón, terme classique de la traversée intégrale de la chaîne.","de":"Der südliche Eckpfeiler der Sierra de Ramón und klassischer Endpunkt der vollständigen Gebirgsüberquerung."}'::jsonb,
    'Vista panorámica al valle sur de Santiago, San José de Maipo y Pirque.',
    '{"es":"Vista panorámica al valle sur de Santiago, San José de Maipo y Pirque.","en":"Panoramic view of southern Santiago, Cajón del Maipo entrance and Pirque vineyards.","pt":"Vista panorâmica do vale sul, entrada do Cajón del Maipo e vinhedos de Pirque.","fr":"Vue panoramique sur le sud de Santiago, l entrée du Cajón del Maipo et Pirque.","de":"Panoramablick auf den Süden von Santiago, den Eingang zum Cajón del Maipo und Pirque."}'::jsonb,
    'Antiguo sector de pequeñas explotaciones mineras coloniales de plata y cobre que dieron nombre a la cumbre (Minillas).',
    '{"es":"Antiguo sector de pequeñas explotaciones mineras coloniales de plata y cobre que dieron nombre a la cumbre (Minillas).","en":"Named after small colonial silver and copper prospecting mines worked in the 18th century.","pt":"Nomeado devido às pequenas minas coloniais de prata e cobre do século XVIII.","fr":"Nommé en référence aux anciennes petites mines de cuivre et d argent de l époque coloniale.","de":"Benannt nach den kleinen kolonialen Silber- und Kupferminen des 18. Jahrhunderts."}'::jsonb,
    ARRAY['cerro las minillas', 'minillas la florida', 'travesia sierra de ramon minillas', 'panul minillas'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-colorado-farellones', 'Cerro Colorado', 3330, 180, 'Cordillera Central / Farellones',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.351, -70.292,
    'La atalaya andina sobre el pueblo de montaña de Farellones. Una cumbre de roca rojiza ideal para aclimatación y trekking de media jornada en altura.',
    '{"es":"La atalaya andina sobre el pueblo de montaña de Farellones. Una cumbre de roca rojiza ideal para aclimatación y trekking de media jornada en altura.","en":"The reddish volcanic watchtower rising right above the alpine village of Farellones, ideal for acclimatization and day treks.","pt":"O mirante avermelhado acima do vilarejo de Farellones, perfeito para aclimatação e caminhadas de um dia.","fr":"Le belvédère andin aux roches pourpres surplombant le village de montagne de Farellones.","de":"Der rot schimmernde Aussichtsberg direkt über dem Bergdorf Farellones, ideal zur Akklimatisation."}'::jsonb,
    'Vista hacia los centros de esquí Farellones, El Colorado, La Parva y el cañón del río San Francisco.',
    '{"es":"Vista hacia los centros de esquí Farellones, El Colorado, La Parva y el cañón del río San Francisco.","en":"Vistas over Farellones, El Colorado and La Parva ski resorts and the San Francisco river canyon.","pt":"Vista direta para os centros de esqui e a cordilheira central.","fr":"Vue plongeante sur les stations de ski et la haute vallée.","de":"Blick auf die Skigebiete Farellones, El Colorado, La Parva und die tiefe Schlucht."}'::jsonb,
    'Faro geográfico de los pioneros del esquí en Chile que fundaron Farellones en la década de 1930.',
    '{"es":"Faro geográfico de los pioneros del esquí en Chile que fundaron Farellones en la década de 1930.","en":"Geographic landmark for the ski pioneers who founded the alpine village of Farellones in the 1930s.","pt":"Marco geográfico dos fundadores do primeiro vilarejo de montanha do Chile nos anos 1930.","fr":"Montagne emblématique des pionniers du ski chilien des années 1930.","de":"Wahrzeichen der Skipioniere, die in den 1930er Jahren Farellones gründeten."}'::jsonb,
    ARRAY['cerro colorado farellones', 'trekking farellones', 'aclimatacion santiago', 'el colorado ski trekking'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-falsa-parva', 'Cerro Falsa Parva', 3880, 90, 'Cordillera Central',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.328, -70.262,
    'La primera gran cumbre del cordón de La Parva. Supera la cota de los 3.800m dominando la mística Laguna Piuquenes.',
    '{"es":"La primera gran cumbre del cordón de La Parva. Supera la cota de los 3.800m dominando la mística Laguna Piuquenes.","en":"The initial major summit on the La Parva ridge above 3,800m, towering right over the glacial Laguna Piuquenes.","pt":"O primeiro grande cume da cordilheira de La Parva acima de 3.800 metros, debruçado sobre a Laguna Piuquenes.","fr":"Le premier sommet majeur de la crête de La Parva dominant le lac glaciaire de Piuquenes.","de":"Der erste markante Gipfel auf dem La-Parva-Kamm über 3.800 m direkt über der Laguna Piuquenes."}'::jsonb,
    'Vista a la Laguna Piuquenes, Cerro Plomo, Cerro Pintor y el valle de Santiago al atardecer.',
    '{"es":"Vista a la Laguna Piuquenes, Cerro Plomo, Cerro Pintor y el valle de Santiago al atardecer.","en":"Dramatic view of Laguna Piuquenes, Mount Plomo, Mount Pintor and the glowing sunset over Santiago.","pt":"Vista deslumbrante da Laguna Piuquenes e dos gigantes da alta montanha.","fr":"Vue spectaculaire sur la Laguna Piuquenes et les hauts sommets environnants.","de":"Blick auf den Piuquenes-Bergsee, den Cerro Plomo und das Lichtermeer Santiagos."}'::jsonb,
    'Llamada Falsa Parva porque al ascender desde los andariveles aparenta ser la cumbre principal, antes de revelar la verdadera cima 100 metros más alta.',
    '{"es":"Llamada Falsa Parva porque al ascender desde los andariveles aparenta ser la cumbre principal, antes de revelar la verdadera cima 100 metros más alta.","en":"Named False Parva because from the ski lifts it appears to be the main peak before revealing the true summit behind it.","pt":"Chamada Falsa Parva porque esconde o cume verdadeiro da montanha mais adiante.","fr":"Nommée Fausse Parva car elle masque le véritable sommet situé plus en retrait.","de":"Benannt als Falsche Parva, da sie vom Skigebiet aus den Blick auf den eigentlichen Hauptgipfel verdeckt."}'::jsonb,
    ARRAY['cerro falsa parva', 'la parva trekking', 'laguna piuquenes', 'alta montana santiago'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-la-parva', 'Cerro La Parva', 3970, 150, 'Cordillera Central',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.315, -70.255,
    'La cumbre epónima que da nombre al centro invernal. Casi 4.000 metros de altitud con acceso al Portezuelo Franciscano y la ruta al Cerro Pintor.',
    '{"es":"La cumbre epónima que da nombre al centro invernal. Casi 4.000 metros de altitud con acceso al Portezuelo Franciscano y la ruta al Cerro Pintor.","en":"The defining peak of the ski valley reaching nearly 4,000m, providing access to the Franciscano pass and the trail towards Mount Pintor.","pt":"O cume verdadeiro que dá nome ao centro de esqui, alcançando quase 4.000m com acesso ao Portezuelo Franciscano.","fr":"Le sommet éponyme culminant à près de 4 000 m, porte d entrée vers le col Franciscano et le Cerro Pintor.","de":"Der Namensgeber des Skigebiets mit knapp 4.000 m Höhe und Übergang zum Franciscano-Pass."}'::jsonb,
    'Vista al glaciar de La Paloma, Cerro Altar, Cerro Leonera y el valle del río Cepo.',
    '{"es":"Vista al glaciar de La Paloma, Cerro Altar, Cerro Leonera y el valle del río Cepo.","en":"Breathtaking lookouts on La Paloma glacier, Mount Altar, Mount Leonera and Cepo river valley.","pt":"Vistas majestosas da geleira La Paloma, Cerro Altar e Leonera.","fr":"Vues splendides sur le glacier La Paloma et le mont Leonera.","de":"Blick auf den Hängegletscher La Paloma, den Cerro Altar und den mächtigen Leonera."}'::jsonb,
    'Parva hace alusión a las parvas de trigo de los campos campesinos chilenos por su silueta piramidal vista desde los valles precordilleranos.',
    '{"es":"Parva hace alusión a las parvas de trigo de los campos campesinos chilenos por su silueta piramidal vista desde los valles precordilleranos.","en":"Named Parva after traditional Chilean grain haystacks due to its rounded pyramidal silhouette when viewed from the valleys below.","pt":"Alusão tradicional à forma das pilhas de feno do campo chileno.","fr":"Évoque la forme pyramidale des meules de foin traditionnelles des campagnes chiliennes.","de":"Benannt nach der traditionellen Form der Heuhaufen chilenischer Bauern."}'::jsonb,
    ARRAY['cerro la parva', 'cumbre la parva', 'portezuelo franciscano', 'trekking 4000 santiago'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-punta-santiago', 'Cerro Punta Santiago', 5083, 210, 'Macizo del Plomo',
    ARRAY['Lo Barnechea', 'San José de Maipo'], 'Cuenca del Mapocho', -33.242, -70.222,
    'Uno de los seismiles técnicos y cinco miles más remotos del macizo del Plomo. Una cumbre de hielo y roca reservada para montañistas experimentados.',
    '{"es":"Uno de los seismiles técnicos y cinco miles más remotos del macizo del Plomo. Una cumbre de hielo y roca reservada para montañistas experimentados.","en":"A formidable 5,000m+ peak in the remote Plomo massif, characterized by blue ice fields, hanging seracs and technical ridge climbing.","pt":"Um gigante acima de 5.000 metros no maciço do El Plomo, repleto de geleiras e escalada técnica de alta montanha.","fr":"Un géant de plus de 5 000 m dans le massif du Plomo, réservé aux alpinistes aguerris.","de":"Ein technisch anspruchsvoller 5.000er im abgelegenen Plomo-Massiv mit Hängegletschern und Eiswänden."}'::jsonb,
    'Vista a la pared sur del Cerro El Plomo, Glaciar Iver y el Parque Andino Juncal.',
    '{"es":"Vista a la pared sur del Cerro El Plomo, Glaciar Iver y el Parque Andino Juncal.","en":"Panoramic view of El Plomo south wall, Iver Glacier and Juncal mountain group.","pt":"Vista direta para a face sul do El Plomo e glaciares do vale.","fr":"Vue impressionnante sur la face sud du mont Plomo et le glacier Iver.","de":"Blick auf die steile Südwand des Cerro El Plomo und den Iver-Gletscher."}'::jsonb,
    'Explorada en las primeras expediciones andinistas del Club Alemán Andino (DAV) a mediados del siglo XX.',
    '{"es":"Explorada en las primeras expediciones andinistas del Club Alemán Andino (DAV) a mediados del siglo XX.","en":"First climbed by DAV (German-Chilean Alpine Club) expeditions exploring the high central Andes in the mid-20th century.","pt":"Explorada pelos pioneiros do Clube Andino Alemão na metade do século XX.","fr":"Conquise lors des expéditions alpines pionnières du Club Alpin Chilien au milieu du XXe siècle.","de":"Mitte des 20. Jahrhunderts von Bergsteigern des Deutschen Andenvereins (DAV) erstbestiegen."}'::jsonb,
    ARRAY['cerro punta santiago', 'cincomil santiago', 'macizo del plomo', 'andinismo tecnico chile'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-altar', 'Cerro Altar', 4478, 480, 'Valle de Yerba Loca',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.208, -70.302,
    'La gran catedral gótica de roca del Santuario de la Naturaleza Yerba Loca. Sus murallas verticales de basalto y neveros eternos son una leyenda del montañismo central.',
    '{"es":"La gran catedral gótica de roca del Santuario de la Naturaleza Yerba Loca. Sus murallas verticales de basalto y neveros eternos son una leyenda del montañismo central.","en":"The cathedral-like rock bastion of Yerba Loca sanctuary, featuring sheer basaltic walls and hanging snowfields.","pt":"A catedral de pedra do Santuário Yerba Loca, famosa por suas paredes verticais e visual místico.","fr":"La cathédrale de roche du sanctuaire Yerba Loca, réputée pour ses parois vertigineuses et ses névés éternels.","de":"Die gotische Felskathedrale im Yerba Loca Schutzgebiet mit senkrechten Basaltwänden und ewigem Schnee."}'::jsonb,
    'Vista al glaciar colgante de La Paloma, Riecillos y las cumbres fronterizas con Argentina.',
    '{"es":"Vista al glaciar colgante de La Paloma, Riecillos y las cumbres fronterizas con Argentina.","en":"Spectacular views on La Paloma hanging glacier and the high border peaks with Argentina.","pt":"Visão da geleira La Paloma e dos cumes da fronteira com a Argentina.","fr":"Vue saisissante sur le glacier suspendu de La Paloma et la frontière argentine.","de":"Blick auf den Hängegletscher La Paloma und die Grenzberge zu Argentinien."}'::jsonb,
    'Llamado Altar por su semejanza con un templo sagrado monumental esculpido por el hielo y los siglos en la cabecera del valle.',
    '{"es":"Llamado Altar por su semejanza con un templo sagrado monumental esculpido por el hielo y los siglos en la cabecera del valle.","en":"Named The Altar because of its resemblance to a monumental church altar carved by ice at the head of the valley.","pt":"Batizado O Altar pela semelhança com um santuário esculpido nas rochas no fim do vale.","fr":"Nommé L Autel pour sa ressemblance frappante avec un sanctuaire monumental façonné par les glaciers.","de":"Wegen seiner Ähnlichkeit mit einem monumentalen Kirchenaltar so getauft."}'::jsonb,
    ARRAY['cerro altar', 'yerba loca', 'cerro altar yerba loca', 'escalada tradicional chile'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-la-paloma', 'Cerro La Paloma', 4910, 520, 'Valle de Yerba Loca',
    ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.185, -70.295,
    'El coloso blanco coronado por el mayor glaciar colgante visible desde Santiago. Su silueta de ave con las alas desplegadas sobre la pared norte es un icono de los Andes centrales.',
    '{"es":"El coloso blanco coronado por el mayor glaciar colgante visible desde Santiago. Su silueta de ave con las alas desplegadas sobre la pared norte es un icono de los Andes centrales.","en":"The white giant crowned by Santiago largest visible hanging glacier. Its snowy silhouette resembles a dove spreading its wings across the high granite wall.","pt":"O grande gigante branco coroado pela maior geleira suspensa visível de Santiago, com formato de pomba de asas abertas.","fr":"Le colosse blanc coiffé du plus grand glacier suspendu visible depuis Santiago, silhouette majestueuse d oiseau aux ailes déployées.","de":"Der weiße Riese mit dem größten von Santiago aus sichtbaren Hängegletscher in Form einer Taube mit ausgebreiteten Schwingen."}'::jsonb,
    'Vista al cajón de Yerba Loca, Cerro Altar, Cerro Plomo y los ventisqueros de Olivares.',
    '{"es":"Vista al cajón de Yerba Loca, Cerro Altar, Cerro Plomo y los ventisqueros de Olivares.","en":"Immense panorama across Yerba Loca canyon, Mount Altar, Mount Plomo and the wild Olivares glaciers.","pt":"Vista imensa da geleira de Yerba Loca e dos ventisqueros de Olivares.","fr":"Immense panorama sur les glaciers d Olivares et le sommet du Plomo.","de":"Überwältigendes Panorama über die Yerba Loca Schlucht und die wilden Olivares-Gletscher."}'::jsonb,
    'Su glaciar fue venerado por los arrieros y exploradores coloniales. Desde el siglo XIX es una de las mayores metas del andinismo de nieve y hielo en Chile.',
    '{"es":"Su glaciar fue venerado por los arrieros y exploradores coloniales. Desde el siglo XIX es una de las mayores metas del andinismo de nieve y hielo en Chile.","en":"Revered since colonial times, its north face glacier remains one of the crowning achievements of Chilean classic ice mountaineering.","pt":"Geleira mítica venerada desde o século XIX, marco do montanhismo clássico de gelo.","fr":"Objet de vénération depuis l époque coloniale, emblème de l alpinisme glaciaire chilien.","de":"Seit dem 19. Jahrhundert eines der großen Sehnsuchtsziele des chilenischen Eisbergsteigens."}'::jsonb,
    ARRAY['cerro la paloma', 'glaciar la paloma', 'yerba loca paloma', 'alta montana santiago glaciar'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-san-gabriel', 'Cerro San Gabriel', 3125, 620, 'Cordillera del Maipo',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.785, -70.218,
    'El monolito de granito rey del Cajón del Maipo. Se eleva verticalmente más de 1.800 metros desde el río Maipo como una fortaleza inexpugnable.',
    '{"es":"El monolito de granito rey del Cajón del Maipo. Se eleva verticalmente más de 1.800 metros desde el río Maipo como una fortaleza inexpugnable.","en":"The king granite monolith of Cajón del Maipo, soaring more than 1,800 vertical meters directly from the riverbed like an impregnable fortress.","pt":"O imenso monólito de granito do Cajón del Maipo, erguendo-se quase 2.000 metros acima do vale.","fr":"Le formidable monolithe de granit du Cajón del Maipo, dominant la vallée de plus de 1 800 mètres de paroi.","de":"Der mächtige Granitmonolith des Cajón del Maipo, der über 1.800 Höhenmeter steil über dem Flussbett aufragt."}'::jsonb,
    'Vista al volcán San José, cerro Retumbadero, cañón del Maipo y confluencia de los ríos Yeso y Volcán.',
    '{"es":"Vista al volcán San José, cerro Retumbadero, cañón del Maipo y confluencia de los ríos Yeso y Volcán.","en":"Views of San José Volcano, Retumbadero, the deep Maipo canyon and the confluence of Yeso and Volcán rivers.","pt":"Vista do Vulcão San José, cânion do Maipo e confluência dos rios da cordilheira.","fr":"Vue spectaculaire sur le volcan San José et le confluent des rivières Yeso et Volcán.","de":"Blick auf den Vulkan San José, die Maipo-Schlucht und den Zusammenfluss der Gebirgsflüsse."}'::jsonb,
    'Custodio del pueblo minero de San Gabriel. Sus paredes de granito son la cuna de la escalada en roca tradicional en la zona central de Chile.',
    '{"es":"Custodio del pueblo minero de San Gabriel. Sus paredes de granito son la cuna de la escalada en roca tradicional en la zona central de Chile.","en":"Guardian of the historic mining village of San Gabriel. Its granite slabs are considered the cradle of Chilean traditional rock climbing.","pt":"Guardião do vilarejo histórico de San Gabriel e berço da escalada em rocha tradicional no Chile.","fr":"Sentinelle du village minier de San Gabriel, berceau de l escalade granitique traditionnelle au Chili.","de":"Wächter des alten Bergmannsdorfes San Gabriel und Wiege des traditionellen Felskletterns in Chile."}'::jsonb,
    ARRAY['cerro san gabriel', 'san gabriel cajon del maipo', 'escalada san gabriel', 'trekking cajon del maipo'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-arenas', 'Cerro Arenas', 4366, 610, 'Cajón del Maipo / Valle de Las Arenas',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.742, -70.028,
    'La gran pirámide de hielo y roca del Valle de Las Arenas. Un cuatro mil colosal con un glaciar colgante y un anfiteatro geológico de clase mundial.',
    '{"es":"La gran pirámide de hielo y roca del Valle de Las Arenas. Un cuatro mil colosal con un glaciar colgante y un anfiteatro geológico de clase mundial.","en":"The immense rock and ice pyramid of Las Arenas Valley. A world-class 4,000m+ peak featuring hanging glaciers and massive scree walls.","pt":"A imensa pirâmide de gelo e rocha do Vale de Las Arenas, um 4.000m clássico do Cajón del Maipo.","fr":"L immense pyramide de roche et de glace de la vallée de Las Arenas, sommet majeur de plus de 4 300 m.","de":"Die gewaltige Fels- und Eispyramide des Arenas-Tals, ein klassischer Viertausender mit Hängegletscher."}'::jsonb,
    'Vista al glaciar colgante del Cerro Morado, Volcán San José y la laguna de Las Arenas.',
    '{"es":"Vista al glaciar colgante del Cerro Morado, Volcán San José y la laguna de Las Arenas.","en":"View of El Morado hanging glacier, San José Volcano and the turquoise glacial lagoon of Las Arenas.","pt":"Vista da geleira do Cerro Morado, Vulcão San José e lagoa glacial.","fr":"Vue plongeante sur le glacier suspendu d El Morado et le volcan San José.","de":"Blick auf den Hängegletscher des Cerro Morado, den Vulkan San José und die Gletscherlagune."}'::jsonb,
    'Foco de expediciones científicas y glaciológicas que estudian el retroceso de los glaciares fósiles y permafrost en los Andes centrales.',
    '{"es":"Foco de expediciones científicas y glaciológicas que estudian el retroceso de los glaciares fósiles y permafrost en los Andes centrales.","en":"Prime research site for international glaciologists monitoring rock glacier melting and permafrost in the central Andes.","pt":"Local de pesquisas científicas pioneiras sobre geleiras de rocha e permafrost.","fr":"Site privilégié de recherches glaciologiques internationales sur le permafrost andin.","de":"Zentrum internationaler wissenschaftlicher Forschungen zum Rückgang der Blockgletscher und des Permafrosts."}'::jsonb,
    ARRAY['cerro arenas', 'valle de las arenas', 'cajon del maipo 4000', 'trekking valle arenas'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-union', 'Cerro Unión', 3658, 290, 'Cajón de Morales',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.792, -70.052,
    'Cumbre andina que une los valles de Morales y Las Arenas. Un mirador privilegiado sobre los glaciares del Morado y las formaciones volcánicas.',
    '{"es":"Cumbre andina que une los valles de Morales y Las Arenas. Un mirador privilegiado sobre los glaciares del Morado y las formaciones volcánicas.","en":"Scenic mountain connecting Morales and Las Arenas valleys, offering grandstand views of hanging glaciers.","pt":"Cume andino que conecta os vales de Morales e Las Arenas com vista panorâmica das geleiras.","fr":"Sommet reliant les vallées de Morales et de Las Arenas avec vue imprenable sur les glaciers.","de":"Verbindungsberg zwischen den Tälern von Morales und Las Arenas mit Blick auf Gletscher und Vulkankegel."}'::jsonb,
    'Vistas directas a la pared sur del Cerro Morado, cerro Arenas y valle de Baños Morales.',
    '{"es":"Vistas directas a la pared sur del Cerro Morado, cerro Arenas y valle de Baños Morales.","en":"Direct views of El Morado south face, Mount Arenas and Baños Morales valley.","pt":"Visão frontal da face sul do Cerro Morado e do Cerro Arenas.","fr":"Vue frontale sur la paroi sud du Cerro Morado et le mont Arenas.","de":"Frontalblick auf die Südwand des Cerro Morado und das Dorf Baños Morales."}'::jsonb,
    'Tradicional hito de arrieros para pasar el ganado entre los valles altos de veranada en el Cajón del Maipo.',
    '{"es":"Tradicional hito de arrieros para pasar el ganado entre los valles altos de veranada en el Cajón del Maipo.","en":"Historic pass used by mountain herders to guide cattle between high summer valleys.","pt":"Passo tradicional de pastores entre os vales altos do Cajón del Maipo.","fr":"Col traditionnel utilisé par les bergers entre les hautes vallées d estive.","de":"Historischer Pass der Hirten zwischen den Hochtälern des Cajón del Maipo."}'::jsonb,
    ARRAY['cerro union', 'cajon de morales', 'banos morales trekking', 'cajon del maipo'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-el-morado-cumbre', 'Cerro El Morado', 4647, 780, 'Monumento Natural El Morado',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.728, -70.065,
    'La cumbre física reina del macizo del Morado. Una mole de hielo y paredones verticales de tono morado oscuro que domina todo el valle de Baños Morales.',
    '{"es":"La cumbre física reina del macizo del Morado. Una mole de hielo y paredones verticales de tono morado oscuro que domina todo el valle de Baños Morales.","en":"The true physical summit of the El Morado massif. A formidable fortress of dark purple rock and hanging glaciers dominating Baños Morales.","pt":"O cume verdadeiro do maciço do Morado, uma colossal fortaleza de rocha púrpura e glaciares suspensos.","fr":"Le véritable sommet du massif d El Morado, forteresse de roche pourpre et de glaciers suspendus.","de":"Der eigentliche Hauptgipfel des Morado-Massivs, eine Feste aus violettem Fels und gewaltigen Hängegletschern."}'::jsonb,
    'Vista al glaciar San Francisco, Laguna de Morales, cerro Arenas y frontera chileno-argentina.',
    '{"es":"Vista al glaciar San Francisco, Laguna de Morales, cerro Arenas y frontera chileno-argentina.","en":"Lookout over San Francisco glacier, Morales lagoon, Mount Arenas and the high border ridge.","pt":"Vista da geleira San Francisco, lagoa de Morales e fronteira com a Argentina.","fr":"Vue saisissante sur le glacier San Francisco et la lagune de Morales.","de":"Blick über den San-Francisco-Gletscher, die Morales-Lagune und die Grenzlinie zu Argentinien."}'::jsonb,
    'Primera ascensión lograda en 1933 por el legendario montañista Sebastián Krückel. Símbolo indiscutido del andinismo técnico chileno.',
    '{"es":"Primera ascensión lograda en 1933 por el legendario montañista Sebastián Krückel. Símbolo indiscutido del andinismo técnico chileno.","en":"First climbed in 1933 by legendary mountaineer Sebastián Krückel, standing as an enduring icon of Chilean technical alpinism.","pt":"Conquistado em 1933 por Sebastián Krückel, tornando-se ícone do montanhismo técnico chileno.","fr":"Première ascension en 1933 par le pionnier Sebastián Krückel, symbole de l alpinisme technique chilien.","de":"Erstbesteigung 1933 durch den Bergsteiger Sebastián Krückel, eine Ikone des chilenischen Alpinismus."}'::jsonb,
    ARRAY['cerro el morado', 'cumbre el morado 4647', 'monumento natural el morado cumbre', 'andinismo cajon del maipo'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-marmolejo', 'Cerro Marmolejo', 6108, 1550, 'Cordillera Principal Andina',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.731, -69.882,
    'El seis mil más austral del planeta Tierra. Un gigante absoluto de los Andes cubierto por un colosal glaciar de cumbre de varios kilómetros de extensión.',
    '{"es":"El seis mil más austral del planeta Tierra. Un gigante absoluto de los Andes cubierto por un colosal glaciar de cumbre de varios kilómetros de extensión.","en":"The southernmost 6,000-meter peak on Earth. A colossal Andean monarch covered by an immense summit icefield stretching for kilometers.","pt":"O pico de 6.000 metros mais austral do planeta Terra, coberto por um colossal manto de gelo eterno.","fr":"Le sommet de plus de 6 000 mètres le plus austral de la planète Terre, titan coiffé d une calotte glaciaire infinie.","de":"Der südlichste 6.000er der Erde, ein gigantischer Andenmonarch mit riesigen Hängegletschern und ewigem Eis."}'::jsonb,
    'Visión infinita de la cordillera de los Andes, Volcán San José a sus pies y el territorio argentino.',
    '{"es":"Visión infinita de la cordillera de los Andes, Volcán San José a sus pies y el territorio argentino.","en":"Infinite horizon across the Andes range, looking down upon San José Volcano and into Argentine territory.","pt":"Visão infinita da cordilheira dos Andes com o Vulcão San José a seus pés.","fr":"Vue infinie sur la chaîne des Andes avec le volcan San José à ses pieds.","de":"Grenzenloser Blick über die Anden, den zu Füßen liegenden Vulkan San José und Argentinien."}'::jsonb,
    'Hito mundial del montañismo de gran altitud. Su cumbre marca la consagración definitiva para expediciones de alta montaña en Sudamérica.',
    '{"es":"Hito mundial del montañismo de gran altitud. Su cumbre marca la consagración definitiva para expediciones de alta montaña en Sudamérica.","en":"A global high-altitude mountaineering benchmark, crowning the ultimate expedition in the Central Andes.","pt":"Marco mundial do montanhismo de alta altitude, ápice das grandes expedições nos Andes.","fr":"Référence mondiale de la haute altitude, couronnement ultime des grandes expéditions andines.","de":"Weltweites Referenzziel des Höhenbergsteigens und Krönung jeder großen Andenexpedition."}'::jsonb,
    ARRAY['cerro marmolejo', 'marmolejo 6000', 'seismil mas austral', 'expedicion marmolejo cajon del maipo'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-purgatorio', 'Cerro Purgatorio', 2440, 310, 'Cajón del Maipo / San Alfonso',
    ARRAY['San José de Maipo'], 'Cuenca del Maipo', -33.712, -70.315,
    'La gran cumbre que vigila el pueblo de San Alfonso. Un ascenso implacable por aristas verticales con vistas al cañón del Maipo y los bosques de cipreses cordilleranos.',
    '{"es":"La gran cumbre que vigila el pueblo de San Alfonso. Un ascenso implacable por aristas verticales con vistas al cañón del Maipo y los bosques de cipreses cordilleranos.","en":"The imposing peak standing guard over San Alfonso village, featuring a relentless vertical ridge climb and rare mountain cypress forests.","pt":"O cume imponente que vigia o vilarejo de San Alfonso, com subida íngreme e bosques de ciprestes da cordilheira.","fr":"Le sommet dominant le village de San Alfonso, offrant une ascension raide et des forêts de cyprès rares.","de":"Der markante Aussichtsberg über dem Bergdorf San Alfonso mit steilem Aufstieg durch Zypressenwälder."}'::jsonb,
    'Vista al cajón del Maipo, cascadas de Las Ánimas, cerro Punta de Damas y los cordones del sur.',
    '{"es":"Vista al cajón del Maipo, cascadas de Las Ánimas, cerro Punta de Damas y los cordones del sur.","en":"Overlook on the Maipo canyon, Las Ánimas waterfalls, Punta de Damas and southern ranges.","pt":"Vista do desfiladeiro do Maipo, cascatas e montanhas do sul.","fr":"Vue plongeante sur le canyon du Maipo et les cascades de Las Ánimas.","de":"Blick über die Maipo-Schlucht, die Wasserfälle von Las Ánimas und die südlichen Ketten."}'::jsonb,
    'Su nombre alude a la severidad de su pendiente inicial, considerada por los arrieros locales como una prueba de fuego o purgatorio antes de alcanzar las praderas altas.',
    '{"es":"Su nombre alude a la severidad de su pendiente inicial, considerada por los arrieros locales como una prueba de fuego o purgatorio antes de alcanzar las praderas altas.","en":"Named Purgatory by local herders due to its grueling initial slope, seen as a test of endurance before reaching the high pastures.","pt":"Nomeado Purgatório devido à inclinação implacável da subida inicial.","fr":"Nommé Purgatoire en raison de la raideur éprouvante de ses premières pentes.","de":"Von den Hirten wegen der erbarmungslosen Anfangssteigung als Fegefeuer bezeichnet."}'::jsonb,
    ARRAY['cerro purgatorio', 'san alfonso cajon del maipo', 'cascada de las animas purgatorio', 'trekking san alfonso'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n,
    panoramic_summary = EXCLUDED.panoramic_summary,
    panoramic_summary_i18n = EXCLUDED.panoramic_summary_i18n,
    history_and_cosmovision = EXCLUDED.history_and_cosmovision,
    history_and_cosmovision_i18n = EXCLUDED.history_and_cosmovision_i18n,
    search_keywords = EXCLUDED.search_keywords;

-- =======================================================================================
-- 2. PUNTOS DE ACCESO REALES (PUBLIC.TRAILHEADS)
-- =======================================================================================
INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'bosque-santiago-la-piramide', 'Centro de Educación Ambiental Bosque Santiago / La Pirámide', 'Huechuraba',
    'Camino La Pirámide 6000, Huechuraba (acceso oficial Cerro Carbón norte)', -33.375, -70.605,
    'https://maps.google.com/?q=-33.3750,-70.6050', 'https://waze.com/ul?ll=-33.3750,-70.6050',
    'parque_oficial', 0, 'Estacionamiento oficial custodiado por guardaparques Parquemet con baños y centro de información.',
    'Micro C06 o C22 desde Metro Tobalaba / Manquehue hasta enlace La Pirámide.', 'Martes a Domingo 08:30 a 17:30', false, 0
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'san-carlos-de-apoquindo-portal', 'Portal San Carlos de Apoquindo (Club Deportivo UC)', 'Las Condes',
    'Av. Las Flores 13000 (junto al complejo deportivo Universidad Católica)', -33.398, -70.495,
    'https://maps.google.com/?q=-33.3980,-70.4950', 'https://waze.com/ul?ll=-33.3980,-70.4950',
    'parque_oficial', 3500, 'Estacionamiento pavimentado oficial Asociación Parque Cordillera con control de acceso, guardias y cámaras.',
    'Micro C02 o C02c desde Metro Los Dominicos hasta terminal San Carlos de Apoquindo.', 'Martes a Domingo 08:00 a 18:00 (Registro obligatorio en boletería)', true, 3500
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'parque-quebrada-de-macul', 'Portería Parque Natural Quebrada de Macul', 'Peñalolén',
    'Av. Diagonal Las Torres s/n (frente a Universidad Adolfo Ibáñez)', -33.488, -70.505,
    'https://maps.google.com/?q=-33.4880,-70.5050', 'https://waze.com/ul?ll=-33.4880,-70.5050',
    'parque_oficial', 0, 'Estacionamiento municipal gratuito con guardaparques. No dejar objetos de valor en vehículos.',
    'Micro 506, 511 o D10 desde Metro Grecia hasta rotonda Las Torres.', 'Lunes a Domingo 08:30 a 18:00 (Ingreso libre con registro)', false, 0
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'santuario-yerba-loca-villa-paulsen', 'Villa Paulsen / Portería Santuario de la Naturaleza Yerba Loca', 'Lo Barnechea',
    'Ruta G-21 a Farellones, Km 22 (Curva 15)', -33.328, -70.328,
    'https://maps.google.com/?q=-33.3280,-70.3280', 'https://waze.com/ul?ll=-33.3280,-70.3280',
    'parque_oficial', 5000, 'Estacionamiento oficial custodiado en Villa Paulsen con zonas de camping, agua potable y baños.',
    'Transporte privado o vans de montaña desde Plaza San Enrique / Mall Sport hacia Farellones.', 'Abierto todo el año de 08:30 a 17:00 (Reserva previa obligatoria Yerbaloca.cl)', true, 5000
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'san-gabriel-pueblo-cajon', 'Pueblo de San Gabriel / Retén Fronterizo', 'San José de Maipo',
    'Ruta G-25 Km 54, San Gabriel (junto al retén de Carabineros)', -33.792, -70.235,
    'https://maps.google.com/?q=-33.7920,-70.2350', 'https://waze.com/ul?ll=-33.7920,-70.2350',
    'calle_publica', 0, 'Estacionamiento lateral junto al pueblo de San Gabriel y zona de almacenes locales.',
    'Metrobus 72 desde Metro Las Mercedes hasta terminal San Gabriel.', 'Acceso libre 24/7 (Aviso de excursión en Carabineros obligatorio)', false, 0
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES (
    'valle-de-las-arenas-cabrerio', 'El Cabrerío / Acceso Valle de Las Arenas', 'San José de Maipo',
    'Camino a Termas del Plomo / Valle de Las Arenas (desvío pasado Baños Morales)', -33.765, -70.045,
    'https://maps.google.com/?q=-33.7650,-70.0450', 'https://waze.com/ul?ll=-33.7650,-70.0450',
    'calle_publica', 3000, 'Explanada de montaña con control de arrieros locales en temporada estival. Vehículo alto recomendado.',
    'Vehículo 4x4 o transporte particular. No hay transporte público regular más allá de Baños Morales.', 'Acceso según condiciones climáticas (temporada primavera/verano)', false, 0
) ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info,
    operating_hours = EXCLUDED.operating_hours;

-- =======================================================================================
-- 3. TRAZADOS Y VARIANTES TECNICAS (PUBLIC.TRAILS)
-- =======================================================================================
INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'cerro-carbon-la-piramide', 'Cerro Carbón por Bosque Santiago / La Pirámide (Ruta Clásica Santiago Hiking)', 'cumbre_directa', 7.2, 680, 680, 1365,
    2.3, 1.4, 'moderada_trekker', '3/5',
    'Sendero de tierra batida, curvas de nivel y filo cumbrero de maicillo', false, 'Sin puntos de agua en ruta. Cargar mínimo 2 litros en el punto de acceso.', 'Baja (20%)', 'Tarde / Puesta de sol (17:00 a 20:30)',
    'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 3.6, 'Descenso suave por el mismo sendero de arista con linterna frontal si es al atardecer.', 'Seguridad Ciudadana Huechuraba / Vitacura · Socorro Andino 136',
    'La ruta de puesta de sol por excelencia en Santiago. Asciende desde el Bosque Santiago cruzando miradores equipados con decks de descanso hasta el filo principal que corona con la vista a los rascacielos de Sanhattan.',
    ARRAY['Mirador El Litre (Hito 1)', 'Mirador La Yesera (Hito 2)', 'Filo Cumbrero y Cruz del Carbón (1.365m)'],
    ARRAY['Zapatillas de trail running o trekking', '2L agua', 'Linterna frontal', 'Cortaviento'],
    'Descenso directo hacia el Bosque Santiago o empalme con el sendero de Saint George hacia Vitacura.', '#f59e0b',
    '[{"km":0,"alt":685,"label":"Acceso Bosque Santiago"},{"km":1.5,"alt":920,"label":"Mirador El Litre"},{"km":2.8,"alt":1180,"label":"Mirador La Yesera"},{"km":3.6,"alt":1365,"label":"Cumbre Cerro Carbón"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'morro-las-papas-san-carlos', 'Morro Las Papas por San Carlos de Apoquindo (Circuito Oficial Parque Cordillera)', 'circuito_cerrado', 4.6, 290, 290, 1280,
    1.2, 0.8, 'facil_iniciacion', '1/5',
    'Pistas anchas de tierra compacta, señalizadas con balizas de guardaparques', false, 'Agua potable solo en la boletería del portal. Sin agua en el cerro.', 'Media (35%)', 'Mañana (08:30 a 12:00)',
    'circuito_bucle', 'ascenso_descenso_mismo_punto', 2.3, 'Retorno por el sendero sur completando el circuito familiar.', 'Guardaparques Asociación Parque Cordillera · Fono Emergencia 1402',
    'La excursión ideal para familias, niños y personas iniciándose en el senderismo andino. Cuenta con senderos impecablemente señalizados, decks de madera panorámicos y observación de avifauna nativa.',
    ARRAY['Punto de Control Guardaparques', 'Bosque de Espinos y Quillayes', 'Mirador Deck Cumbre Las Papas (1.280m)'],
    ARRAY['Calzado deportivo con buen dibujo', '1.5L agua', 'Gorra y bloqueador solar'],
    'Caminos vehiculares de guardaparques para evacuación rápida en cualquier punto del recorrido.', '#10b981',
    '[{"km":0,"alt":990,"label":"Portal San Carlos"},{"km":1.2,"alt":1120,"label":"Mirador Los Quillayes"},{"km":2.3,"alt":1280,"label":"Cumbre Morro Las Papas"},{"km":4.6,"alt":990,"label":"Portal San Carlos"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'alto-las-vizcachas-san-carlos', 'Alto de las Vizcachas por San Carlos de Apoquindo (Ruta Oficial Santiago Hiking)', 'cumbre_directa', 9.8, 880, 880, 1871,
    2.8, 1.8, 'moderada_trekker', '3/5',
    'Sendero de faldeo de montaña, pendiente sostenida y arista rocosa final', false, 'Ruta 100% seca. Portar mínimo 2.5 litros por persona.', 'Baja (15%)', 'Mañana temprano (07:30 a 12:30)',
    'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 4.9, 'Descenso con precaución en el maicillo del filo hacia el portezuelo.', 'Guardaparques Asociación Parque Cordillera · Socorro Andino 136',
    'Uno de los miradores más espectaculares de la cuenca oriental de Santiago. Supera el Morro Las Papas internándose por la quebrada hasta remontar el filo que culmina en una meseta rocosa con vistas directas a la pared del Cerro Provincia.',
    ARRAY['Paso Las Papas (1.280m)', 'Portezuelo Las Vizcachas (1.610m)', 'Meseta Cumbrera y Pircas (1.871m)'],
    ARRAY['Botas de trekking', '2.5L agua isotónica', 'Bastones de trekking', 'Ropa técnica transpirable'],
    'Descolgarse por el sendero oficial de regreso al portal. Prohibido desviarse hacia la quebrada de Las Varas.', '#6366f1',
    '[{"km":0,"alt":990,"label":"Portal San Carlos"},{"km":2.3,"alt":1280,"label":"Morro Las Papas"},{"km":3.8,"alt":1610,"label":"Portezuelo Vizcachas"},{"km":4.9,"alt":1871,"label":"Cumbre Alto de las Vizcachas"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'cerro-la-cruz-quebrada-macul', 'Cerro La Cruz por Quebrada de Macul (Ruta Clásica Santiago Hiking)', 'cumbre_directa', 15.2, 1650, 1650, 2552,
    4.8, 3.2, 'exigente_montana', '4/5',
    'Sendero boscoso de ribera que da paso a acarreos pedregosos de fuerte pendiente y aristas de roca', true, 'Agua disponible en el estero Macul hasta el sector El Encuentro (km 4.5). Cargar agua antes de subir el cerro.', 'Baja (20%)', 'Madrugada (06:30 AM obligatorio)',
    'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 7.6, 'Bajada muy exigente para rodillas por el acarreo pedregoso del Monolito. Uso de bastones imprescindible.', 'Guardaparques Quebrada de Macul · Socorro Andino 136 · GOPE Carabineros',
    'La gran cumbre emblemática de Peñalolén. Remonta el frondoso cañón de la Quebrada de Macul cruzando cascadas hasta El Encuentro, desde donde se encara el colosal desnivel vertical de más de 1.600 metros hasta la cruz de hierro cumbrera.',
    ARRAY['Sector El Encuentro (1.420m)', 'El Monolito y Acarreo Central (1.980m)', 'Filo Cumbrero y Cruz de Hierro (2.552m)'],
    ARRAY['Botas de caña media con suela Vibram', '3L agua con electrolitos', 'Bastones de trekking', 'Frontal y abrigo de cumbre'],
    'Regreso exclusivo por la huella señalizada hacia El Encuentro. Nunca bajar por canaletas secas desconocidas.', '#ef4444',
    '[{"km":0,"alt":900,"label":"Portería Quebrada de Macul"},{"km":4.5,"alt":1420,"label":"El Encuentro (Última Agua)"},{"km":6.2,"alt":2050,"label":"El Monolito"},{"km":7.6,"alt":2552,"label":"Cumbre Cerro La Cruz"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'cerro-san-gabriel-normal', 'Cerro San Gabriel por El Romeral (Ruta Normal Santiago Hiking)', 'cumbre_directa', 9.4, 1380, 1380, 3125,
    4.5, 3, 'exigente_montana', '4/5',
    'Acarreos graníticos, pendientes de más de 35 grados y trepadas de roca en arista', false, 'Sin agua en toda la ruta. Carga obligatoria: 3 litros por persona.', 'Nula (0%)', 'Amanecer (06:00 AM)',
    'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 4.7, 'Descenso delicado sobre maicillo de granito suelto con riesgo de rodados de piedras.', 'Socorro Andino Cajón del Maipo · Carabineros Retén San Gabriel',
    'La gran clásica de media montaña del Cajón del Maipo. Asciende por el contrafuerte sur superando canaletas de roca sólida y lomos de granito con una vista vertical colosal hacia el cañón del río Maipo.',
    ARRAY['Canaleta de Entrada (1.850m)', 'El Cuello de Roca (2.600m)', 'Arista Somital y Cumbre San Gabriel (3.125m)'],
    ARRAY['Botas rígidas de montaña', 'Casco de montaña (caída de piedras)', '3L agua', 'Bastones', 'Cortaviento técnico'],
    'Bajar por la misma línea de huella marcada con pircas de piedra hacia el pueblo.', '#dc2626',
    '[{"km":0,"alt":1750,"label":"Acceso Pueblo San Gabriel"},{"km":1.8,"alt":2200,"label":"Canaleta Central"},{"km":3.5,"alt":2750,"label":"Filo Granítico"},{"km":4.7,"alt":3125,"label":"Cumbre Cerro San Gabriel"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'glaciar-la-paloma-yerba-loca', 'Sendero Glaciar La Paloma y Piedra Carvajal (Santuario Yerba Loca Santiago Hiking)', 'cumbre_directa', 24.5, 1480, 1480, 3350,
    6.5, 5, 'exigente_montana', '4/5',
    'Sendero andino de cajón glaciar, vadeo de esteros sulfurosos y morrenas terminales', true, 'Agua abundante en el estero Yerba Loca (contiene minerales; filtrar o hervir) y vertientes laterales puras.', 'Baja (10%)', 'Expedición de 2 días recomendada con campamento en Piedra Carvajal (o salida 06:00 AM para 1 día extremo)',
    'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 12.2, 'Retorno siguiendo el curso del estero de regreso a Villa Paulsen.', 'Guardaparques Santuario Yerba Loca · Socorro Andino 136',
    'La gran travesía glaciar de los Andes centrales de Santiago. Remonta el valle glaciar de Yerba Loca pasando por Vegas de Chapaque y el histórico refugio de pastores Piedra Carvajal hasta el mirador frontal del imponente Glaciar La Paloma.',
    ARRAY['Vegas de Chapaque (2.400m)', 'Campamento Piedra Carvajal (3.200m)', 'Morrena Mirador Glaciar La Paloma (3.350m)'],
    ARRAY['Mochila de expedición', 'Sistema de hidratación 3L', 'Botas de trekking impermeables', 'Ropa térmica de alta montaña'],
    'Seguir estrictamente el sendero del fondo de valle de regreso a la portería de Villa Paulsen.', '#38bdf8',
    '[{"km":0,"alt":1870,"label":"Villa Paulsen"},{"km":5.2,"alt":2400,"label":"Vegas de Chapaque"},{"km":9.8,"alt":3200,"label":"Piedra Carvajal"},{"km":12.2,"alt":3350,"label":"Mirador Glaciar La Paloma"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'travesia-sierra-de-ramon', 'Gran Travesía Integral Sierra de Ramón (Provincia a Minillas - 2 Días Santiago Hiking)', 'travesia_cordon', 29.5, 2480, 2650, 3253,
    10, 6, 'exigente_montana', '5/5',
    'Aristas de roca viva, acarreos sueltos, filos ventosos y pasos aéreos sobre los 3.000m', false, 'Ruta 100% seca en todo el filo de arista. Carga obligatoria mínima: 5 a 6 litros por persona.', 'Nula (0%)', 'Expedición de 2 días con campamento o vivac en cumbre Cerro Provincia o San Ramón',
    'travesia_punto_a_punto', 'norte_a_sur', 14.5, 'Termina en Parque El Panul (La Florida) o Quebrada de Macul.', 'Cuerpo de Socorro Andino 136 · GOPE Carabineros · Parque Cordillera',
    'La travesía reina del montañismo andino urbano de Santiago. Recorre todo el filo divisorio de la Sierra de Ramón de norte a sur, coronando sucesivamente el Cerro Provincia (2.750m), Cerro Tambor (2.890m), Cerro San Ramón (3.253m), Punta de Damas (3.149m), Cerro Tarapacá (2.920m) y Cerro Las Minillas (2.467m).',
    ARRAY['Cumbre Cerro Provincia (2.750m)', 'El Filo del Tambor (2.890m)', 'Techo Cumbre San Ramón (3.253m)', 'Punta de Damas (3.149m)', 'Filo de Minillas (2.467m)'],
    ARRAY['Mochila 50L', 'Equipo de campamento / vivac 4 estaciones', '6L agua', 'Ración de marcha 2 días', 'Botiquín y GPS'],
    'Vías de escape de emergencia solo por Quebrada de Macul desde El Encuentro.', '#f97316',
    '[{"km":0,"alt":980,"label":"Puente Nilhue (Inicio)"},{"km":7.2,"alt":2750,"label":"Cumbre Cerro Provincia"},{"km":10.5,"alt":2890,"label":"Cerro El Tambor"},{"km":14.5,"alt":3253,"label":"Cumbre Cerro San Ramón"},{"km":18.2,"alt":3149,"label":"Punta de Damas"},{"km":23.5,"alt":2467,"label":"Cerro Las Minillas"},{"km":29.5,"alt":850,"label":"El Panul (La Florida - Fin)"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES (
    'travesia-cordon-manquehue', 'Travesía Integral Cordón Manquehue (Guanaco - Carbón - Manquehue - Manquehuito)', 'travesia_cordon', 13.8, 1350, 1320, 1638,
    5.5, 2, 'moderada_trekker', '4/5',
    'Aristas de tierra, crestas rocosas y senderos de bosque esclerófilo', false, 'Sin agua en toda la línea de arista. Carga obligatoria: 3 litros por persona.', 'Baja (20%)', 'Mañana temprano (07:00 AM)',
    'travesia_punto_a_punto', 'oeste_a_este', 8.5, 'Inicia en Bosque Santiago / Huechuraba y finaliza en Portón Vía Roja / Los Trapenses.', 'Seguridad Ciudadana Vitacura / Lo Barnechea · Socorro Andino 136',
    'La travesía integral de la espina dorsal del cordón más famoso de Santiago. Conecta de poniente a oriente las cuatro cumbres principales: Cerro El Guanaco, Cerro Carbón, Cerro Manquehue y Cerro Manquehuito en una sola jornada continua de filo.',
    ARRAY['Cumbre Cerro Guanaco (950m)', 'Cumbre Cerro Carbón (1.365m)', 'Portezuelo Manquehue', 'Cumbre Cerro Manquehue (1.638m)', 'Cumbre Manquehuito (1.319m)'],
    ARRAY['Zapatillas trail con excelente agarre', '3L agua', 'Bastones', 'Snacks energéticos'],
    'Escape por Saint George hacia Vitacura o por portezuelo hacia Vía Roja.', '#eab308',
    '[{"km":0,"alt":680,"label":"Huechuraba (Inicio)"},{"km":2.5,"alt":950,"label":"Cerro El Guanaco"},{"km":5.2,"alt":1365,"label":"Cerro Carbón"},{"km":9.8,"alt":1638,"label":"Cerro Manquehue"},{"km":11.8,"alt":1319,"label":"Cerro Manquehuito"},{"km":13.8,"alt":1050,"label":"Vía Roja (Fin)"}]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights,
    required_equipment = EXCLUDED.required_equipment;

-- =======================================================================================
-- 4. VINCULACIONES GEOGRAFICAS (TRAIL_PEAKS Y TRAIL_COMMERCIAL_BINDING)
-- =======================================================================================
DO $$
DECLARE
    -- Peaks
    v_p_carbon UUID;
    v_p_papas UUID;
    v_p_vizcachas UUID;
    v_p_cruz UUID;
    v_p_sangabriel UUID;
    v_p_paloma UUID;
    v_p_provincia UUID;
    v_p_tambor UUID;
    v_p_sanramon UUID;
    v_p_damas UUID;
    v_p_tarapaca UUID;
    v_p_minillas UUID;
    v_p_guanaco UUID;
    v_p_manquehue UUID;
    v_p_manquehuito UUID;

    -- Trails
    v_t_carbon UUID;
    v_t_papas UUID;
    v_t_vizcachas UUID;
    v_t_cruz UUID;
    v_t_sangabriel UUID;
    v_t_paloma UUID;
    v_t_trav_ramon UUID;
    v_t_trav_manquehue UUID;

    -- Trailheads
    v_th_piramide UUID;
    v_th_sancarlos UUID;
    v_th_macul UUID;
    v_th_sangabriel UUID;
    v_th_yerbaloca UUID;
BEGIN
    -- Obteniendo IDs de cumbres
    SELECT id INTO v_p_carbon FROM public.peaks WHERE slug = 'cerro-carbon';
    SELECT id INTO v_p_papas FROM public.peaks WHERE slug = 'morro-las-papas';
    SELECT id INTO v_p_vizcachas FROM public.peaks WHERE slug = 'alto-de-las-vizcachas';
    SELECT id INTO v_p_cruz FROM public.peaks WHERE slug = 'cerro-la-cruz';
    SELECT id INTO v_p_sangabriel FROM public.peaks WHERE slug = 'cerro-san-gabriel';
    SELECT id INTO v_p_paloma FROM public.peaks WHERE slug = 'cerro-la-paloma';
    SELECT id INTO v_p_provincia FROM public.peaks WHERE slug = 'cerro-provincia';
    SELECT id INTO v_p_tambor FROM public.peaks WHERE slug = 'cerro-el-tambor';
    SELECT id INTO v_p_sanramon FROM public.peaks WHERE slug = 'cerro-san-ramon';
    SELECT id INTO v_p_damas FROM public.peaks WHERE slug = 'punta-de-damas';
    SELECT id INTO v_p_tarapaca FROM public.peaks WHERE slug = 'cerro-tarapaca';
    SELECT id INTO v_p_minillas FROM public.peaks WHERE slug = 'cerro-las-minillas';
    SELECT id INTO v_p_guanaco FROM public.peaks WHERE slug = 'cerro-el-guanaco';
    SELECT id INTO v_p_manquehue FROM public.peaks WHERE slug = 'cerro-manquehue';
    SELECT id INTO v_p_manquehuito FROM public.peaks WHERE slug = 'cerro-manquehuito';

    -- Obteniendo IDs de senderos
    SELECT id INTO v_t_carbon FROM public.trails WHERE slug = 'cerro-carbon-la-piramide';
    SELECT id INTO v_t_papas FROM public.trails WHERE slug = 'morro-las-papas-san-carlos';
    SELECT id INTO v_t_vizcachas FROM public.trails WHERE slug = 'alto-las-vizcachas-san-carlos';
    SELECT id INTO v_t_cruz FROM public.trails WHERE slug = 'cerro-la-cruz-quebrada-macul';
    SELECT id INTO v_t_sangabriel FROM public.trails WHERE slug = 'cerro-san-gabriel-normal';
    SELECT id INTO v_t_paloma FROM public.trails WHERE slug = 'glaciar-la-paloma-yerba-loca';
    SELECT id INTO v_t_trav_ramon FROM public.trails WHERE slug = 'travesia-sierra-de-ramon';
    SELECT id INTO v_t_trav_manquehue FROM public.trails WHERE slug = 'travesia-cordon-manquehue';

    -- Obteniendo IDs de accesos
    SELECT id INTO v_th_piramide FROM public.trailheads WHERE slug = 'bosque-santiago-la-piramide';
    SELECT id INTO v_th_sancarlos FROM public.trailheads WHERE slug = 'san-carlos-de-apoquindo-portal';
    SELECT id INTO v_th_macul FROM public.trailheads WHERE slug = 'parque-quebrada-de-macul';
    SELECT id INTO v_th_sangabriel FROM public.trailheads WHERE slug = 'san-gabriel-pueblo-cajon';
    SELECT id INTO v_th_yerbaloca FROM public.trailheads WHERE slug = 'santuario-yerba-loca-villa-paulsen';

    -- Enlazar Trailheads a Trails
    IF v_t_carbon IS NOT NULL AND v_th_piramide IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_piramide, trailhead_end_id = v_th_piramide WHERE id = v_t_carbon;
    END IF;

    IF v_t_papas IS NOT NULL AND v_th_sancarlos IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_sancarlos, trailhead_end_id = v_th_sancarlos WHERE id = v_t_papas;
    END IF;

    IF v_t_vizcachas IS NOT NULL AND v_th_sancarlos IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_sancarlos, trailhead_end_id = v_th_sancarlos WHERE id = v_t_vizcachas;
    END IF;

    IF v_t_cruz IS NOT NULL AND v_th_macul IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_macul, trailhead_end_id = v_th_macul WHERE id = v_t_cruz;
    END IF;

    IF v_t_sangabriel IS NOT NULL AND v_th_sangabriel IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_sangabriel, trailhead_end_id = v_th_sangabriel WHERE id = v_t_sangabriel;
    END IF;

    IF v_t_paloma IS NOT NULL AND v_th_yerbaloca IS NOT NULL THEN
        UPDATE public.trails SET trailhead_start_id = v_th_yerbaloca, trailhead_end_id = v_th_yerbaloca WHERE id = v_t_paloma;
    END IF;

    -- Enlazar Cumbres a Senderos (TRAIL_PEAKS)
    -- Cerro Carbón
    IF v_t_carbon IS NOT NULL AND v_p_carbon IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_carbon, v_p_carbon, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Morro Las Papas
    IF v_t_papas IS NOT NULL AND v_p_papas IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_papas, v_p_papas, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Alto de las Vizcachas
    IF v_t_vizcachas IS NOT NULL AND v_p_vizcachas IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_vizcachas, v_p_vizcachas, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Cerro La Cruz
    IF v_t_cruz IS NOT NULL AND v_p_cruz IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_cruz, v_p_cruz, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Cerro San Gabriel
    IF v_t_sangabriel IS NOT NULL AND v_p_sangabriel IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_sangabriel, v_p_sangabriel, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Glaciar La Paloma
    IF v_t_paloma IS NOT NULL AND v_p_paloma IS NOT NULL THEN
        INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit)
        VALUES (v_t_paloma, v_p_paloma, 1, true)
        ON CONFLICT (trail_id, peak_id) DO NOTHING;
    END IF;

    -- Travesía Sierra de Ramón (6 Cumbres encadenadas)
    IF v_t_trav_ramon IS NOT NULL THEN
        IF v_p_provincia IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_provincia, 1, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_tambor IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_tambor, 2, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_sanramon IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_sanramon, 3, true) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_damas IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_damas, 4, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_tarapaca IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_tarapaca, 5, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_minillas IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_ramon, v_p_minillas, 6, false) ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- Travesía Cordón Manquehue (4 Cumbres encadenadas)
    IF v_t_trav_manquehue IS NOT NULL THEN
        IF v_p_guanaco IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_manquehue, v_p_guanaco, 1, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_carbon IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_manquehue, v_p_carbon, 2, false) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_manquehue IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_manquehue, v_p_manquehue, 3, true) ON CONFLICT DO NOTHING;
        END IF;
        IF v_p_manquehuito IS NOT NULL THEN
            INSERT INTO public.trail_peaks (trail_id, peak_id, summit_order, is_main_summit) VALUES (v_t_trav_manquehue, v_p_manquehuito, 4, false) ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- =======================================================================================
-- 5. FECHAS DE EXPEDICIONES GUIADAS ADICIONALES (EXPEDITION_DATES)
-- =======================================================================================
DO $$
DECLARE
    v_t_carbon UUID;
    v_t_vizcachas UUID;
    v_t_cruz UUID;
    v_t_sangabriel UUID;
    v_t_trav_manquehue UUID;
BEGIN
    SELECT id INTO v_t_carbon FROM public.trails WHERE slug = 'cerro-carbon-la-piramide';
    SELECT id INTO v_t_vizcachas FROM public.trails WHERE slug = 'alto-las-vizcachas-san-carlos';
    SELECT id INTO v_t_cruz FROM public.trails WHERE slug = 'cerro-la-cruz-quebrada-macul';
    SELECT id INTO v_t_sangabriel FROM public.trails WHERE slug = 'cerro-san-gabriel-normal';
    SELECT id INTO v_t_trav_manquehue FROM public.trails WHERE slug = 'travesia-cordon-manquehue';

    -- Cerro Carbón Sunset
    IF v_t_carbon IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_carbon, '2026-10-24', '18:00 hrs', 'Atardecer Urbano & Skyline Sanhattan', 12, 6, 26000, 28, 'open'),
        (v_t_carbon, '2026-10-31', '18:00 hrs', 'Noche de Estrellas & Luces de Santiago', 12, 4, 26000, 28, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Alto de las Vizcachas
    IF v_t_vizcachas IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_vizcachas, '2026-10-25', '08:00 AM', 'Trekking Panorámico & Geología de San Carlos', 8, 5, 36000, 39, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Cerro La Cruz
    IF v_t_cruz IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_cruz, '2026-11-01', '06:30 AM', 'Desafío Vertical 1.600m: Cumbre Cerro La Cruz', 8, 3, 58000, 62, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Cerro San Gabriel
    IF v_t_sangabriel IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_sangabriel, '2026-11-08', '06:00 AM', 'Expedición de Alta Montaña: Monolito San Gabriel 3.125m', 6, 2, 95000, 102, 'last_slots')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Travesía Cordón Manquehue
    IF v_t_trav_manquehue IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_trav_manquehue, '2026-11-15', '07:00 AM', 'Gran Travesía 4 Cumbres: Guanaco, Carbón, Manquehue y Manquehuito', 8, 4, 68000, 73, 'open')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
