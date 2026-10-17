-- =======================================================================================
-- SANTIAGO HIKING · ATLAS ANDINO MAESTRO (CARGA MASIVA Santiago Hiking)
-- Cumbres Oficiales IGM, Trailheads Reales, Altimetrías y Reseñas Internacionales (5 Idiomas)
-- =======================================================================================

-- 1. CUMBRES FÍSICAS (PUBLIC.PEAKS)
INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-manquehue', 'Cerro Manquehue', 1638, 480, 'Cordón Manquehue', ARRAY['Vitacura', 'Lo Barnechea'], 'Cuenca del Mapocho', -33.3524, -70.5796,
    'El volcán extinto y la cumbre reina del valle de Santiago. Una subida de fuerte pendiente con vistas de 360 grados sobre toda la cuenca metropolitana y la Cordillera de Los Andes.',
    '{"es": "El volcán extinto y la cumbre reina del valle de Santiago. Una subida de fuerte pendiente con vistas de 360 grados sobre toda la cuenca metropolitana y la Cordillera de Los Andes.", "en": "The extinct volcano and crowning summit of Santiago. A steep, demanding ascent featuring 360-degree panoramic views of the entire metropolitan basin and the Andes range.", "pt": "O vulcão extinto e o cume mais alto da bacia urbana de Santiago. Uma subida íngreme com vistas de 360 graus sobre toda a cidade e a Cordilheira dos Andes.", "fr": "Le volcan éteint et le sommet emblématique de Santiago. Une ascension raide offrant des panoramas à 360 degrés sur tout le bassin urbain et la Cordillère des Andes.", "de": "Der erloschene Vulkan und der höchste Gipfel im Stadtgebiet von Santiago. Ein steiler, fordernder Aufstieg mit 360-Grad-Panoramablick auf das Tal und die Anden."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'En mapudungún significa Lugar de Cóndores. Considerado apu ceremonial sagrado en la cosmovisión andina prehispánica, dominando visualmente el valle del río Mapocho.',
    '{"es": "En mapudungún significa Lugar de Cóndores. Considerado apu ceremonial sagrado en la cosmovisión andina prehispánica, dominando visualmente el valle del río Mapocho.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro manquehue', 'manquehue', 'trekking manquehue', 'manquehue hike', 'via roja', 'agua del palo', 'vitacura hike'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-manquehuito', 'Cerro Manquehuito', 1319, 90, 'Cordón Manquehue', ARRAY['Lo Barnechea', 'Vitacura'], 'Cuenca del Mapocho', -33.3458, -70.57,
    'El mirador predilecto para atardeceres y mar de nubes en Santiago. Una cumbre dócil pero panorámica, ideal para iniciación al trekking y running de arista.',
    '{"es": "El mirador predilecto para atardeceres y mar de nubes en Santiago. Una cumbre dócil pero panorámica, ideal para iniciación al trekking y running de arista.", "en": "Santiago premier sunset summit and cloud-inversion viewpoint. A gentle yet scenic peak, ideal for trekking newcomers and ridge trail runners.", "pt": "O pico favorito para o pôr do sol e o mar de nuvens em Santiago. Uma subida suave com visual espetacular sobre a cordilheira.", "fr": "Le sommet idéal pour admirer le coucher de soleil et la mer de nuages à Santiago. Une randonnée accessible et panoramique.", "de": "Der beliebteste Aussichtsberg für Sonnenuntergänge über Santiago. Ein moderater Wanderberg mit spektakulärem Blick auf die Anden."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Hermano menor del Manquehue. Su cruz cumbrera de madera ha sido un hito de encuentro tradicional para generaciones de excursionistas urbanos.',
    '{"es": "Hermano menor del Manquehue. Su cruz cumbrera de madera ha sido un hito de encuentro tradicional para generaciones de excursionistas urbanos.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro manquehuito', 'manquehuito', 'manquehuito sunset', 'via roja lo barnechea', 'trekking santiago principiantes'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-el-guanaco', 'Cerro El Guanaco', 950, 85, 'Cordón Manquehue', ARRAY['Huechuraba', 'Recoleta'], 'Cuenca del Mapocho', -33.385, -70.622,
    'El contrafuerte poniente del Cordón del Manquehue. Ofrece una vista inédita hacia el norte de Santiago y la zona de Huechuraba.',
    '{"es": "El contrafuerte poniente del Cordón del Manquehue. Ofrece una vista inédita hacia el norte de Santiago y la zona de Huechuraba.", "en": "The western buttress of the Manquehue range, offering direct panoramic views over northern Santiago and the Huechuraba valley.", "pt": "O mirante ocidental da cordilheira de Manquehue com vista panorâmica da zona norte de Santiago.", "fr": "Le contrefort ouest du massif Manquehue offrant une vue imprenable sur le nord de Santiago.", "de": "Der westliche Vorposten des Manquehue-Zuges mit freiem Blick auf das nördliche Stadtgebiet."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Antiguo paso de arrieros y cazadores prehispánicos que conectaba la cuenca de Huechuraba con el valle del Mapocho.',
    '{"es": "Antiguo paso de arrieros y cazadores prehispánicos que conectaba la cuenca de Huechuraba con el valle del Mapocho.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro el guanaco', 'el guanaco huechuraba', 'trekking parquemet norte', 'cerros huechuraba'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'morro-las-papas', 'Morro Las Papas', 1280, 60, 'Sierra de Ramón', ARRAY['Las Condes'], 'Cuenca del Mapocho', -33.402, -70.485,
    'La atalaya clásica del Parque San Carlos de Apoquindo. Un mirador con decks de madera y pendiente suave entre espinales y flora nativa.',
    '{"es": "La atalaya clásica del Parque San Carlos de Apoquindo. Un mirador con decks de madera y pendiente suave entre espinales y flora nativa.", "en": "The classic scenic viewpoint in San Carlos de Apoquindo Park. Features wooden viewing platforms and gentle trails across native woodland.", "pt": "Mirante clássico do Parque San Carlos de Apoquindo com plataformas de madeira e trilha familiar.", "fr": "Belvédère classique du parc San Carlos de Apoquindo avec plateformes d observation en bois.", "de": "Der beliebte Familien- und Trainingsgipfel im Park San Carlos de Apoquindo mit Holz-Aussichtsplattformen."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Nombrado por los antiguos lugareños por los rodados graníticos redondeados que asemejan tubérculos andinos en sus laderas.',
    '{"es": "Nombrado por los antiguos lugareños por los rodados graníticos redondeados que asemejan tubérculos andinos en sus laderas.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['morro las papas', 'san carlos de apoquindo', 'parque cordillera', 'trekking las condes', 'las papas trail'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'alto-del-naranjo', 'Alto del Naranjo', 1890, 110, 'Sierra de Ramón', ARRAY['Las Condes', 'Lo Barnechea'], 'Cuenca del Mapocho', -33.415, -70.472,
    'El gran mirador andino presidido por un quillay centenario. Punto de descanso obligatorio y destino en sí mismo en la arista al Cerro Provincia.',
    '{"es": "El gran mirador andino presidido por un quillay centenario. Punto de descanso obligatorio y destino en sí mismo en la arista al Cerro Provincia.", "en": "The legendary Andean lookout crowned by an ancient quillay tree. Essential resting point and standalone destination on the Provincia ridge.", "pt": "O famoso mirante andino marcado por uma árvore quillay centenária, com vista frontal para a Cordilheira dos Andes.", "fr": "Le belvédère andin légendaire dominé par un quillay centenaire sur l arête menant au Cerro Provincia.", "de": "Der legendäre Aussichtspunkt der Sierra de Ramón mit dem jahrhundertealten Quillay-Baum."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Hito histórico donde los antiguos arrieros hacían una pausa de sombra antes de encarar el acarreo pedregoso hacia la alta cumbre del Provincia.',
    '{"es": "Hito histórico donde los antiguos arrieros hacían una pausa de sombra antes de encarar el acarreo pedregoso hacia la alta cumbre del Provincia.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['alto del naranjo', 'puente nilhue', 'san carlos apoquindo', 'quillay alto del naranjo', 'trekking provincia'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'alto-de-las-vizcachas', 'Alto de las Vizcachas', 1871, 140, 'Sierra de Ramón', ARRAY['Las Condes'], 'Cuenca del Mapocho', -33.408, -70.479,
    'Cumbre de media montaña en el Parque San Carlos de Apoquindo. Tramo final pedregoso y empinado con una de las mejores postales hacia la pared del Cerro Provincia.',
    '{"es": "Cumbre de media montaña en el Parque San Carlos de Apoquindo. Tramo final pedregoso y empinado con una de las mejores postales hacia la pared del Cerro Provincia.", "en": "Mid-mountain summit in San Carlos de Apoquindo Park. Features a steep rocky final ascent with premier front-row views of Mount Provincia.", "pt": "Cume de montanha no Parque San Carlos de Apoquindo com vista espetacular para o Cerro Provincia.", "fr": "Sommet de moyenne montagne à San Carlos de Apoquindo offrant une vue imprenable sur le Cerro Provincia.", "de": "Aussichtsreicher Mittelgebirgsgipfel mit direktem Blick auf die Steilflanke des Cerro Provincia."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Zona de hábitat histórico de la vizcacha andina, roedor montano que habita los grandes bloques graníticos de su arista superior.',
    '{"es": "Zona de hábitat histórico de la vizcacha andina, roedor montano que habita los grandes bloques graníticos de su arista superior.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['alto de las vizcachas', 'alto vizcachas', 'san carlos apoquindo', 'trekking vizcachas las condes'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'morro-del-guayacan', 'Morro del Guayacán', 1650, 75, 'Sierra de Ramón', ARRAY['Las Condes'], 'Cuenca del Mapocho', -33.42, -70.489,
    'Mirador panorámico situado en el lomo intermedio entre San Carlos de Apoquindo y la Quebrada de San Ramón.',
    '{"es": "Mirador panorámico situado en el lomo intermedio entre San Carlos de Apoquindo y la Quebrada de San Ramón.", "en": "Panoramic ridge viewpoint situated between San Carlos de Apoquindo and the San Ramón Gorge.", "pt": "Ponto panorâmico entre San Carlos de Apoquindo e a garganta de San Ramón.", "fr": "Belvédère d arête situé entre San Carlos de Apoquindo et les gorges de San Ramón.", "de": "Aussichtskamm zwischen San Carlos de Apoquindo und der San-Ramón-Schlucht."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Llamado así por los relictos de guayacán nativo (Porlieria chilensis) que sobreviven en sus quebradas secas.',
    '{"es": "Llamado así por los relictos de guayacán nativo (Porlieria chilensis) que sobreviven en sus quebradas secas.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['morro guayacan', 'morro del guayacan', 'parque cordillera', 'san carlos de apoquindo'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-pochoco', 'Cerro Pochoco', 1804, 280, 'Precordillera de Lo Barnechea', ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.364, -70.448,
    'La escuela vertical por excelencia del montañismo santiaguino. Pendiente empinada y constante sobre maicillo desde el Observatorio Achaya hasta su cumbre rocosa.',
    '{"es": "La escuela vertical por excelencia del montañismo santiaguino. Pendiente empinada y constante sobre maicillo desde el Observatorio Achaya hasta su cumbre rocosa.", "en": "The classic steep training ground for Santiago mountaineers. Relentless incline on loose granite gravel from the Achaya Observatory to the rocky summit.", "pt": "A lendária escola de montanhismo de Santiago com subida íngreme constante desde o Observatório Achaya.", "fr": "L école verticale par excellence des alpinistes de Santiago. Pente raide et soutenue depuis l Observatoire Achaya.", "de": "Die legendäre Steil-Trainingsstrecke der Bergsteiger von Santiago mit unverminderter Steigung ab dem Achaya-Observatorium."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'En mapudungún Pochoco se asocia a lugar de colinas o manantiales. Durante décadas ha sido el banco de pruebas físico para montañistas chilenos antes de expediciones andinas.',
    '{"es": "En mapudungún Pochoco se asocia a lugar de colinas o manantiales. Durante décadas ha sido el banco de pruebas físico para montañistas chilenos antes de expediciones andinas.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro pochoco', 'pochoco', 'el arrayan', 'observatorio achaya', 'trekking lo barnechea', 'pochoco hike'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-carpa', 'Cerro Carpa', 2776, 390, 'Cordón de los Españoles', ARRAY['Lo Barnechea'], 'Cuenca del Mapocho', -33.315, -70.435,
    'El coloso del Cordón de los Españoles sobre el Santuario de la Naturaleza El Arrayán. Una cumbre solitaria y agreste con vista directa al macizo de La Paloma y Altar.',
    '{"es": "El coloso del Cordón de los Españoles sobre el Santuario de la Naturaleza El Arrayán. Una cumbre solitaria y agreste con vista directa al macizo de La Paloma y Altar.", "en": "The dominant peak of the Cordón de los Españoles above El Arrayán Sanctuary. A rugged, isolated summit with direct views of Mount La Paloma and Altar.", "pt": "O cume mais alto do Cordón de los Españoles com vistas deslumbrantes sobre os glaciares centrais.", "fr": "Le sommet dominant du Cordón de los Españoles offrant une vue grandiose sur les glaciers andins.", "de": "Der markante Hochgipfel des Cordón de los Españoles über dem Naturschutzgebiet El Arrayán."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Su nombre recuerda su perfil piramidal que asemeja una carpa de campaña cuando se observa desde los valles de La Dehesa.',
    '{"es": "Su nombre recuerda su perfil piramidal que asemeja una carpa de campaña cuando se observa desde los valles de La Dehesa.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro carpa', 'cordon de los españoles', 'santuario el arrayan', 'cerro conchali', 'trekking carpa'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-provincia', 'Cerro Provincia', 2750, 420, 'Sierra de Ramón', ARRAY['Las Condes', 'Lo Barnechea'], 'Cuenca del Mapocho', -33.4358, -70.4652,
    'El titán de la Sierra de Ramón. 1.800 metros de desnivel vertical sostenido, coronado por un refugio domo geodésico de madera sobre el valle de Santiago.',
    '{"es": "El titán de la Sierra de Ramón. 1.800 metros de desnivel vertical sostenido, coronado por un refugio domo geodésico de madera sobre el valle de Santiago.", "en": "The sentinel of the Sierra de Ramón range. 1,800 vertical meters of sustained climb, crowned by a geodesic wooden dome refuge overlooking Santiago.", "pt": "O clássico titã da Sierra de Ramón com 1.800m de desnível positivo e o icônico refúgio domo no cume.", "fr": "Le colosse de la Sierra de Ramón avec 1 800 mètres de dénivelé et son célèbre refuge géodésique au sommet.", "de": "Der Königsgipfel der Sierra de Ramón mit 1.800 Höhenmetern Aufstieg und der markanten Holz-Kuppelhütte am Gipfel."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Antigua atalaya de vigilancia colonial y sendero de tránsito de pastores hacia los valles andinos superiores.',
    '{"es": "Antigua atalaya de vigilancia colonial y sendero de tránsito de pastores hacia los valles andinos superiores.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro provincia', 'provincia', 'refugio cerro provincia', 'puente nilhue provincia', 'trekking alta montaña santiago'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-san-ramon', 'Cerro San Ramón', 3253, 1100, 'Sierra de Ramón', ARRAY['Peñalolén', 'Lo Barnechea'], 'Cuenca del Mapocho', -33.4867, -70.4792,
    'El techo absoluto de la cuenca de Santiago. Supera la barrera de los 3.200 metros ofreciendo una panorámica total del Tupungato, El Plomo y la cordillera central.',
    '{"es": "El techo absoluto de la cuenca de Santiago. Supera la barrera de los 3.200 metros ofreciendo una panorámica total del Tupungato, El Plomo y la cordillera central.", "en": "The highest summit overlooking Santiago city. Surpasses 3,200 meters, commanding sweeping panoramas of Mount Tupungato, El Plomo, and the Andes spine.", "pt": "O teto supremo da bacia de Santiago com mais de 3.250 metros de altitude e vista frontal para o Tupungato.", "fr": "Le toit de la ville de Santiago culminant à plus de 3 200 mètres avec vue royale sur le Tupungato.", "de": "Das Dach des Santiago-Kessels über 3.200m mit atemberaubendem Blick auf den Tupungato und den El Plomo."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Cumbre sagrada de observación meteorológica natural para los antiguos habitantes del valle del Mapocho.',
    '{"es": "Cumbre sagrada de observación meteorológica natural para los antiguos habitantes del valle del Mapocho.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro san ramon', 'san ramon 3253', 'techo de santiago', 'quebrada de macul san ramon', 'alta montaña santiago'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-la-cruz', 'Cerro La Cruz', 2552, 210, 'Sierra de Ramón', ARRAY['Peñalolén'], 'Cuenca del Mapocho', -33.492, -70.498,
    'El gran coloso de Peñalolén por el Parque Quebrada de Macul. Un ascenso exigente que remonta esteros y bosques nativos antes de montar su afilada arista rocosa.',
    '{"es": "El gran coloso de Peñalolén por el Parque Quebrada de Macul. Un ascenso exigente que remonta esteros y bosques nativos antes de montar su afilada arista rocosa.", "en": "The commanding peak of Peñalolén accessed via Quebrada de Macul Park. Demanding ascent traversing native forests before ascending a sharp rocky ridge.", "pt": "O cume clássico de Peñalolén através do Parque Quebrada de Macul, com subida pedregosa e desafiadora.", "fr": "Le colosse de Peñalolén accessible par le parc Quebrada de Macul, arête rocheuse aérienne et sauvage.", "de": "Der markante Felsgipfel über Peñalolén aus dem Quebrada de Macul Park mit steilem Grat-Finale."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Bautizado por la gran cruz metálica instalada en su cumbre que resplandece con los primeros rayos del sol sobre la comuna de Peñalolén.',
    '{"es": "Bautizado por la gran cruz metálica instalada en su cumbre que resplandece con los primeros rayos del sol sobre la comuna de Peñalolén.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro la cruz', 'cerro la cruz peñalolen', 'quebrada de macul', 'la cruz trekking', 'arista los gemelos'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-pintor', 'Cerro Pintor', 4180, 180, 'Cordillera Central (Farellones / La Parva)', ARRAY['Lo Barnechea'], 'Cordillera Central', -33.328, -70.279,
    'El primer cuatro mil clásico de Santiago. Célebre por sus estratos geológicos policromáticos de tonalidades ocres, verdes y rojizas frente a glaciares andinos.',
    '{"es": "El primer cuatro mil clásico de Santiago. Célebre por sus estratos geológicos policromáticos de tonalidades ocres, verdes y rojizas frente a glaciares andinos.", "en": "Santiago signature first 4,000-meter peak. World-renowned for polychromatic mineral strata in ochre, green, and red hues directly facing Andean glaciers.", "pt": "O primeiro pico de 4.000 metros acessível de Santiago, famoso pelas cores minerais de suas encostas.", "fr": "Le premier 4 000 mètres emblématique de Santiago, réputé pour ses strates géologiques aux teintes multicolores.", "de": "Der klassische erste 4.000er von Santiago, weltberühmt für seine farbenprächtigen Mineralbänder in Ocker, Grün und Rot."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Bautizado por los antiguos montañistas del Club Alemán Andino (DAV) debido a la paleta de colores minerales que parece pintada al óleo en sus laderas.',
    '{"es": "Bautizado por los antiguos montañistas del Club Alemán Andino (DAV) debido a la paleta de colores minerales que parece pintada al óleo en sus laderas.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro pintor', 'cerro pintor 4180', 'la parva trekking', 'laguna piuquenes', 'primer 4000 santiago', 'farellones hiking'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-leonera', 'Cerro Leonera', 4954, 410, 'Cordillera Central (Farellones)', ARRAY['Lo Barnechea'], 'Cordillera Central', -33.308, -70.265,
    'El coloso previo a los cinco mil metros. Con campamento base de altura en Cancha de Carreras (4.100m) y vistas frontales al glaciar del Cerro El Plomo.',
    '{"es": "El coloso previo a los cinco mil metros. Con campamento base de altura en Cancha de Carreras (4.100m) y vistas frontales al glaciar del Cerro El Plomo.", "en": "The mighty pre-5,000m peak. Features high-altitude base camp at Cancha de Carreras (4,100m) and direct front-row vistas of Mount El Plomo glacier.", "pt": "A grande montanha de quase 5.000 metros com acampamento de altitude em Cancha de Carreras.", "fr": "Le sommet d altitude majeur à près de 5 000 mètres avec camp de base à Cancha de Carreras.", "de": "Der majestätische Fast-Fünftausender mit Hochlager auf der Hochebene Cancha de Carreras (4.100m)."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Su nombre recuerda las antiguas madrigueras de pumas cordilleranos que cazaban guanacos en las altas planicies de altura.',
    '{"es": "Su nombre recuerda las antiguas madrigueras de pumas cordilleranos que cazaban guanacos en las altas planicies de altura.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro leonera', 'leonera 4954', 'cancha de carreras', 'expedicion leonera', 'alta montaña chile'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'cerro-el-plomo', 'Cerro El Plomo', 5424, 1540, 'Grupo Plomo', ARRAY['Lo Barnechea'], 'Cordillera Central', -33.232, -70.218,
    'El Apu sagrado y guardián espiritual del valle del Mapocho. Expedición de alta montaña de 3 a 4 días cruzando el Glaciar Iver hasta el santuario incaico ceremonial.',
    '{"es": "El Apu sagrado y guardián espiritual del valle del Mapocho. Expedición de alta montaña de 3 a 4 días cruzando el Glaciar Iver hasta el santuario incaico ceremonial.", "en": "The sacred Apu and spiritual guardian of Santiago. Multi-day high mountain expedition crossing the Iver Glacier to the ancient Inca ceremonial summit sanctuary.", "pt": "O santuário inca mais sagrado dos Andes Centrais e o pico tutelar de 5.424m de Santiago.", "fr": "L Apu sacré et gardien spirituel de Santiago, sommet mythique à 5 424m avec sanctuaire inca.", "de": "Der heilige Inka-Berg und Schutzpatron von Santiago auf 5.424 Metern mit dem berühmten Gletschertrekking."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'En 1954 fue descubierto en su cumbre el cuerpo intacto del Niño del Plomo, ofrenda incaica de Capacocha del siglo XV conservada en permafrost.',
    '{"es": "En 1954 fue descubierto en su cumbre el cuerpo intacto del Niño del Plomo, ofrenda incaica de Capacocha del siglo XV conservada en permafrost.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['cerro el plomo', 'el plomo 5424', 'apu sagrado', 'niño del plomo', 'glaciar iver', 'federacion', 'piedra numerada'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'mirador-de-condores', 'Mirador de Cóndores', 1800, 120, 'Cajón del Maipo (Alfalfal)', ARRAY['San José de Maipo'], 'Valle del Maipo', -33.612, -70.298,
    'El santuario por excelencia para el avistamiento del cóndor andino en libertad. Acantilados verticales sobre el río Colorado donde las aves planean a pocos metros.',
    '{"es": "El santuario por excelencia para el avistamiento del cóndor andino en libertad. Acantilados verticales sobre el río Colorado donde las aves planean a pocos metros.", "en": "The premier natural cliff sanctuary for watching wild Andean condors. Vertical crags over the Colorado river where condors soar just meters away.", "pt": "O santuário natural mais famoso do Cajón del Maipo para avistar o condor andino voando a poucos metros.", "fr": "Le sanctuaire naturel emblématique pour observer le condor des Andes planant au-dessus des falaises.", "de": "Der spektakuläre Aussichtsfelsen im Cajón del Maipo zur Beobachtung wilder Andenkondore aus nächster Nähe."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Histórica quebrada de anidación y posada térmica aprovechada por generaciones de cóndores andinos (Vultur gryphus).',
    '{"es": "Histórica quebrada de anidación y posada térmica aprovechada por generaciones de cóndores andinos (Vultur gryphus).", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['mirador de condores', 'condores cajon del maipo', 'alfalfal', 'trekking condores', 'condor andino chile'],
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'volcan-san-jose', 'Volcán San José', 5856, 1320, 'Grupo Volcánico San José', ARRAY['San José de Maipo'], 'Valle del Maipo', -33.785, -69.892,
    'El coloso volcánico activo del Cajón del Maipo en la frontera con Argentina. Expedición mayor de 3 a 4 días con cráter humeante y refugio histórico Plantat.',
    '{"es": "El coloso volcánico activo del Cajón del Maipo en la frontera con Argentina. Expedición mayor de 3 a 4 días con cráter humeante y refugio histórico Plantat.", "en": "The active volcanic giant of the Maipo Canyon on the Argentine border. Major multi-day expedition featuring smoking crater and historic Plantat stone refuge.", "pt": "O vulcão ativo gigante do Cajón del Maipo na fronteira com a Argentina com cratera fumegante.", "fr": "Le géant volcanique actif du Cajón del Maipo à la frontière argentine avec cratère fumant.", "de": "Der aktive Vulkangigant im Cajón del Maipo an der Grenze zu Argentinien mit rauchendem Krater."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'El refugio Plantat de piedra a 3.130m fue construido en 1937 por el arquitecto Enrique Plantat y miembros del Club Alemán Andino.',
    '{"es": "El refugio Plantat de piedra a 3.130m fue construido en 1937 por el arquitecto Enrique Plantat y miembros del Club Alemán Andino.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['volcan san jose', 'san jose 5856', 'refugio plantat', 'las lajas', 'crater activo san jose', 'volcanes chile'],
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;

INSERT INTO public.peaks (
    slug, name, altitude_msnm, prominence_m, massif, comunas, basin, latitude, longitude,
    summary, summary_i18n, panoramic_summary, panoramic_summary_i18n, history_and_cosmovision, history_and_cosmovision_i18n,
    search_keywords, cover_image_url
) VALUES (
    'monumento-natural-el-morado', 'Monumento Natural El Morado', 3120, 210, 'Cajón del Morado', ARRAY['San José de Maipo'], 'Valle del Maipo', -33.818, -70.082,
    'El trekking glaciar protegido por CONAF en Baños Morales. Sendero que remonta aguas minerales subterráneas hasta la laguna glaciar a los pies del Cerro El Morado.',
    '{"es": "El trekking glaciar protegido por CONAF en Baños Morales. Sendero que remonta aguas minerales subterráneas hasta la laguna glaciar a los pies del Cerro El Morado.", "en": "The premier national monument and glacier trek protected by CONAF. Route climbs past natural mineral springs to the alpine glacial lake.", "pt": "Parque protegido pela CONAF com fontes de água mineral e lagoa aos pés do Glaciar San Francisco.", "fr": "Monument naturel protégé par la CONAF menant à la lagune glaciaire et aux eaux minérales de Panimávida.", "de": "Das geschützte CONAF-Naturmonument mit kohlensäurehaltigen Mineralquellen und dem Gletschersee am Fuße des El Morado."}'::jsonb,
    'Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.',
    '{"es": "Vistas panorámicas hacia la cuenca de Santiago y la cordillera principal.", "en": "Panoramic views towards Santiago basin and the main Andes range.", "pt": "Vistas panorâmicas para a bacia de Santiago e a cordilheira principal.", "fr": "Vues panoramiques sur le bassin de Santiago et la chaîne principale des Andes.", "de": "Panoramablick auf das Santiago-Becken und die Hauptkette der Anden."}'::jsonb,
    'Área silvestre protegida desde 1974 que resguarda fósiles marinos del Jurásico y las vertientes gasificadas de Panimávida.',
    '{"es": "Área silvestre protegida desde 1974 que resguarda fósiles marinos del Jurásico y las vertientes gasificadas de Panimávida.", "en": "Historical mountain heritage registered in Santiago Hiking.", "pt": "Patrimônio histórico de montanha registrado no Santiago Hiking.", "fr": "Patrimoine montagnard historique répertorié dans Santiago Hiking.", "de": "Historisches Bergerbe, dokumentiert im Santiago Hiking."}'::jsonb,
    ARRAY['monumento natural el morado', 'laguna el morado', 'baños morales', 'glaciar san francisco', 'conaf el morado'],
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO UPDATE SET
    altitude_msnm = EXCLUDED.altitude_msnm,
    summary = EXCLUDED.summary,
    summary_i18n = EXCLUDED.summary_i18n;


-- =======================================================================================
-- 2. PUNTOS DE ACCESO REALES (PUBLIC.TRAILHEADS - ESTÁNDAR Santiago Hiking & PARQUE CORDILLERA)
-- =======================================================================================
INSERT INTO public.trailheads (
    slug, name, comuna, address_description, latitude, longitude, google_maps_link, waze_deep_link,
    parking_type, parking_fee_clp, parking_security_tip, public_transit_info, operating_hours, entry_fee_required, entry_fee_clp
) VALUES
('via-roja-lo-barnechea', 'Portón Vía Roja / Los Trapenses', 'Lo Barnechea',
 'Final de calle Vía Roja, Los Trapenses', -33.3580, -70.5650, 'https://maps.google.com/?q=-33.3580,-70.5650', 'https://waze.com/ul?ll=-33.3580,-70.5650',
 'calle_publica', 0, 'Estacionamiento sobre calle residencial con guardias vecinales diurnos.',
 'Micro C14 desde Metro Escuela Militar hasta Av. Los Trapenses con Vía Roja.', 'Acceso libre 06:30 a 20:00', false, 0),

('agua-del-palo-vitacura', 'Portón Agua del Palo (Manquehue)', 'Vitacura',
 'Final de calle Agua del Palo / Santa María de Manquehue', -33.3680, -70.5780, 'https://maps.google.com/?q=-33.3680,-70.5780', 'https://waze.com/ul?ll=-33.3680,-70.5780',
 'calle_publica', 0, 'Acceso residencial con control vecinal y cámaras.',
 'Colectivos y micros C02 desde Metro Escuela Militar hasta rotonda Santa María.', 'Acceso libre 06:30 a 20:00', false, 0),

('observatorio-achaya-pochoco', 'Observatorio Achaya / Camino El Alto', 'Lo Barnechea',
 'Camino El Alto 35300, El Arrayán', -33.3580, -70.4550, 'https://maps.google.com/?q=-33.3580,-70.4550', 'https://waze.com/ul?ll=-33.3580,-70.4550',
 'calle_publica', 0, 'Estacionamiento lateral frente al observatorio. No dejar objetos a la vista.',
 'Micro C01 desde Metro Escuela Militar hasta Plaza San Enrique, luego micro C01c o colectivo El Arrayán.', 'Acceso libre 24/7', false, 0),

('aguas-de-ramon-la-reina', 'Parque Natural Aguas de Ramón (Portal La Reina)', 'La Reina',
 'Álvaro Casanova 2583, La Reina Alta', -33.4350, -70.5180, 'https://maps.google.com/?q=-33.4350,-70.5180', 'https://waze.com/ul?ll=-33.4350,-70.5180',
 'parque_oficial', 3500, 'Estacionamiento custodiado oficial Asociación Parque Cordillera con guardaparques y baños.',
 'Micro D02 desde Metro Plaza Egaña hasta Álvaro Casanova.', 'Martes a Domingo 08:00 a 18:00', true, 3500),

('alfalfal-cajon-del-maipo', 'Camino al Alfalfal (Mirador de Cóndores)', 'San José de Maipo',
 'Ruta G-345 km 19, camino a Central Los Queltehues / El Alfalfal', -33.6080, -70.2920, 'https://maps.google.com/?q=-33.6080,-70.2920', 'https://waze.com/ul?ll=-33.6080,-70.2920',
 'calle_publica', 2000, 'Estacionamiento rústico a orilla de camino con cuidadores locales en fines de semana.',
 'Metrobus 72 desde Metro Las Mercedes hasta San Gabriel, luego colectivo local a Alfalfal.', 'Acceso libre diurno', false, 0),

('la-parva-curva-laguna', 'Curva del Viento / La Parva Centro de Ski', 'Lo Barnechea',
 'Camino a Farellones Ruta G-21 hasta La Parva Base', -33.3420, -70.2880, 'https://maps.google.com/?q=-33.3420,-70.2880', 'https://waze.com/ul?ll=-33.3420,-70.2880',
 'parque_oficial', 0, 'Estacionamiento amplio en andariveles de La Parva.',
 'Transporte de montaña / vans desde Mall Sport en temporada alta.', 'Libre en temporada estival', false, 0),

('baños-morales-conaf', 'Centro de Información Ambiental CONAF Baños Morales', 'San José de Maipo',
 'Pueblo de Baños Morales s/n, Cajón del Maipo', -33.8250, -70.0750, 'https://maps.google.com/?q=-33.8250,-70.0750', 'https://waze.com/ul?ll=-33.8250,-70.0750',
 'parque_oficial', 4000, 'Estacionamiento custodiado oficial CONAF frente a administración del monumento.',
 'Turismo Maipo / buses cordilleranos desde Puente Alto en fines de semana.', 'Miércoles a Domingo 08:30 a 17:00 (Registro previo Aspticket CONAF)', true, 4000)
ON CONFLICT (slug) DO UPDATE SET
    parking_security_tip = EXCLUDED.parking_security_tip,
    public_transit_info = EXCLUDED.public_transit_info;


-- =======================================================================================
-- 3. TRAZADOS Y VARIANTES TÉCNICAS (PUBLIC.TRAILS - RUTAS OFICIALES Santiago Hiking)
-- =======================================================================================
INSERT INTO public.trails (
    slug, name, trail_type, distance_km, elevation_gain_m, elevation_loss_m, max_altitude_m,
    avg_duration_up_hours, avg_duration_down_hours, technical_difficulty, physical_exertion,
    trail_surface, water_available, water_detail, shade_percentage, best_time_of_day,
    route_topology, direction_sense, ascent_distance_km, return_notes, rescue_jurisdiction,
    description, crux_highlights, required_equipment, escape_routes_info, glow_color, elevation_profile
) VALUES
('manquehue-normal-via-roja', 'Cerro Manquehue por Vía Roja (Ruta Normal Santiago Hiking)', 'cumbre_directa', 4.8, 625, 625, 1638,
 2.2, 1.3, 'moderada_trekker', '3/5', 'Sendero de tierra con tramo cumbrero rocoso de gateo técnico (escalones de piedra)',
 false, 'Ruta 100% seca. Portar mínimo 2 litros por persona.', 'Baja (15%)', 'Amanecer / Ocaso',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 2.4, 'Descenso con precaución en el espolón rocoso hacia el portezuelo.', 'GOPE Carabineros · Socorro Andino 136',
 'La ascensión clásica a la cumbre más alta de Santiago urbano. El sendero asciende con pendiente moderada hasta el portezuelo que divide el Manquehuito del Manquehue para luego encarar el filo rocoso final.',
 ARRAY['Portezuelo Manquehue (1.250m)', 'Espolón Rocoso de Gateo (1.480m)', 'Cumbre y Planicie Ceremonial (1.638m)'],
 ARRAY['Calzado con suela de agarre (Vibram)', '2L agua', 'Bastones de trekking', 'Protección solar'],
 'Descenso por la misma vía hacia el portezuelo. No descolgarse por canaletas norte.', '#f59e0b',
 '[{"km": 0.0, "alt": 1050, "label": "Portón Vía Roja"}, {"km": 1.1, "alt": 1250, "label": "Portezuelo"}, {"km": 1.8, "alt": 1480, "label": "Crux Espolón Rocoso"}, {"km": 2.4, "alt": 1638, "label": "Cumbre Cerro Manquehue"}]'::jsonb),

('manquehuito-normal', 'Cerro Manquehuito por Vía Roja (Ruta Clásica Santiago Hiking)', 'cumbre_directa', 3.6, 280, 280, 1319,
 1.2, 0.8, 'facil_iniciacion', '1/5', 'Sendero suave de bosque esclerófilo y filo suave de arista',
 false, 'Sin vertientes. Carga sugerida: 1.5 litros.', 'Media (35%)', 'Atardecer / Puesta de Sol',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 1.8, 'Retorno por el mismo sendero de arista al portón Vía Roja.', 'Seguridad Ciudadana Lo Barnechea · Socorro Andino 136',
 'La excursión de iniciación por excelencia. Ascenso amigable entre quillayes, litres y espinos hasta el mirador de madera y la cruz cumbrera.',
 ARRAY['Bosque Esclerófilo', 'Mirador Portezuelo', 'Cruz de Madera Cumbre'],
 ARRAY['Zapatillas de trail o trekking', '1.5L agua', 'Cortaviento para la cumbre', 'Frontal si es al atardecer'],
 'Descenso directo al portón de Vía Roja.', '#34d399',
 '[{"km": 0.0, "alt": 1050, "label": "Portón Vía Roja"}, {"km": 0.9, "alt": 1210, "label": "Portezuelo Este"}, {"km": 1.8, "alt": 1319, "label": "Cumbre Manquehuito"}]'::jsonb),

('pochoco-normal', 'Cerro Pochoco por El Arrayán (Ruta Normal Santiago Hiking)', 'cumbre_directa', 4.4, 780, 780, 1804,
 2.5, 1.5, 'moderada_trekker', '3/5', 'Pendiente vertical constante sobre maicillo resbaladizo y bloques de granito',
 false, 'Ruta 100% seca. Mínimo 2.5 litros por persona.', 'Nula (5%)', 'Mañana temprano (07:00 AM)',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 2.2, 'Descenso muy exigente para cuadríceps sobre maicillo suelto. Bastones obligatorios.', 'Socorro Andino 136 · GOPE Carabineros',
 'La mayor escuela vertical del valle central. Desnivel implacable desde el observatorio hasta la arista cumbrera. Exige buena tracción y concentración constante.',
 ARRAY['Torre Eléctrica (Hito 1)', 'La Pirca de Descanso (Hito 2)', 'El Paso de Roca (1.680m)', 'Cumbre Pochoco (1.804m)'],
 ARRAY['Calzado de caña media con suela profunda', '2.5L agua con sales', 'Bastones de trekking', 'Gorra y bloqueador'],
 'Bajar estrictamente por la huella central del filo. Prohibido desviarse hacia las quebradas laterales.', '#f43f5e',
 '[{"km": 0.0, "alt": 1024, "label": "Observatorio Achaya"}, {"km": 0.8, "alt": 1320, "label": "Pirca de Descanso"}, {"km": 1.5, "alt": 1620, "label": "Paso de Roca"}, {"km": 2.2, "alt": 1804, "label": "Cumbre Cerro Pochoco"}]'::jsonb),

('salto-de-apoquindo-aguas-de-ramon', 'Sendero Salto de Apoquindo (Parque Natural Aguas de Ramón)', 'circuito_cerrado', 17.5, 810, 810, 1650,
 4.0, 3.0, 'moderada_trekker', '3/5', 'Sendero de ribera de río, cruce de puentes colgantes, bosque esclerófilo y acarreo final',
 true, 'Agua pura de vertiente en el estero. Se recomienda pastillas potabilizadoras o filtro.', 'Media (40%)', 'Salida 08:00 AM (Cierre de guardaparques 17:30)',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 8.7, 'Retorno obligatorio antes de las 14:00 hrs desde la cascada hacia la portería.', 'Guardaparques Parque Cordillera · Fono 1402',
 'Una de las travesías fluviales y de bosque más hermosas de la precordillera. Remonta el estero de Ramón cruzando puentes colgantes hasta la imponente cascada de 30 metros.',
 ARRAY['Centro de Educación Ambiental', 'Paso Los Peumos (Puente Colgante)', 'Mirador del Enlace', 'Cascada Salto de Apoquindo (30m)'],
 ARRAY['Mochila 20L', '2.5L agua', 'Calzado impermeable o transpirable', 'Almuerzo de marcha', 'Frontal'],
 'Seguir estrictamente el sendero señalizado con estacas numeradas de guardaparques.', '#06b6d4',
 '[{"km": 0.0, "alt": 840, "label": "Portería La Reina"}, {"km": 3.8, "alt": 1100, "label": "Los Peumos"}, {"km": 6.2, "alt": 1380, "label": "El Salto Chico"}, {"km": 8.7, "alt": 1650, "label": "Cascada Salto de Apoquindo"}]'::jsonb),

('mirador-de-condores-alfalfal', 'Mirador de Cóndores por El Alfalfal (Ruta Oficial Santiago Hiking)', 'cumbre_directa', 8.2, 540, 540, 1800,
 2.2, 1.5, 'facil_iniciacion', '2/5', 'Sendero de herradura de tierra compacta y faldeo andino con mirador en acantilado',
 false, 'Sin fuentes de agua en la ruta. Carga: 2 litros.', 'Baja (10%)', 'Tarde (Vuelo térmico de cóndores 14:00 a 17:00)',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 4.1, 'Descenso cómodo por el sendero principal hacia la carretera de Alfalfal.', 'Socorro Andino Cajón del Maipo · Carabineros San Gabriel',
 'La mejor ruta de avistamiento de fauna andina de la zona central. El sendero asciende suavemente por el lomo montañoso hasta un anfiteatro rocoso vertical donde anidan los cóndores.',
 ARRAY['El Portón de Inicio', 'El Espino Solitario', 'La Meseta de Observación', 'Acantilado Mirador de Cóndores'],
 ARRAY['Calzado de trekking', '2L de agua', 'Prismáticos o cámara con teleobjetivo', 'Cortaviento'],
 'No acercarse al borde sin precaución en días de ráfagas de viento.', '#f59e0b',
 '[{"km": 0.0, "alt": 1260, "label": "Acceso Alfalfal"}, {"km": 2.0, "alt": 1520, "label": "Loma Media"}, {"km": 4.1, "alt": 1800, "label": "Mirador de Cóndores"}]'::jsonb),

('pintor-normal-la-parva', 'Cerro Pintor por La Parva y Piuquenes (Ruta Clásica Santiago Hiking)', 'cumbre_directa', 13.5, 920, 920, 4180,
 3.8, 2.2, 'exigente_montana', '4/5', 'Desierto andino de altura, acarreos policromáticos de gran pendiente y viento helado',
 false, 'Ruta 100% congelada / seca. Carga mínima: 3 litros isotónicos.', 'Nula (0%)', 'Alba (Inicio 07:00 AM)',
 'ida_y_vuelta', 'ascenso_descenso_mismo_punto', 6.7, 'Retorno por el filo andino pasando por Falsa Parva y La Parva hacia los andariveles.', 'Cuerpo de Socorro Andino 136 · Patrullas La Parva',
 'El gran bautismo en los 4.000 metros de altitud. Asciende por el filo que bordea la Laguna Piuquenes, superando las cumbres de Falsa Parva (3.880m) y La Parva (3.970m) antes del cono de colores del Pintor.',
 ARRAY['Laguna Piuquenes (3.500m)', 'Cumbre Cerro La Parva (3.970m)', 'Portezuelo Pintor-Leonera', 'Cumbre Cerro Pintor (4.180m)'],
 ARRAY['Ropa de abrigo 3 capas técnica (pluma + cortaviento Gore-Tex)', '3L agua', 'Lentes de sol UV400 categoría 4', 'Botiquín de altura'],
 'En caso de niebla o viento blanco, replegarse inmediatamente al andarivel de La Parva.', '#8b5cf6',
 '[{"km": 0.0, "alt": 3260, "label": "Andarivel Tórtolas"}, {"km": 2.5, "alt": 3500, "label": "Laguna Piuquenes"}, {"km": 4.5, "alt": 3970, "label": "Cumbre Cerro La Parva"}, {"km": 6.7, "alt": 4180, "label": "Cumbre Cerro Pintor"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
    elevation_profile = EXCLUDED.elevation_profile,
    crux_highlights = EXCLUDED.crux_highlights;


-- =======================================================================================
-- 4. SALIDAS COMERCIALES GUIADAS (MODELO MUCH BETTER ADVENTURES)
-- =======================================================================================
DO $$
DECLARE
    v_t_manquehue UUID;
    v_t_manquehuito UUID;
    v_t_pochoco UUID;
    v_t_salto UUID;
    v_t_condores UUID;
    v_t_pintor UUID;
BEGIN
    SELECT id INTO v_t_manquehue FROM public.trails WHERE slug = 'manquehue-normal-via-roja';
    SELECT id INTO v_t_manquehuito FROM public.trails WHERE slug = 'manquehuito-normal';
    SELECT id INTO v_t_pochoco FROM public.trails WHERE slug = 'pochoco-normal';
    SELECT id INTO v_t_salto FROM public.trails WHERE slug = 'salto-de-apoquindo-aguas-de-ramon';
    SELECT id INTO v_t_condores FROM public.trails WHERE slug = 'mirador-de-condores-alfalfal';
    SELECT id INTO v_t_pintor FROM public.trails WHERE slug = 'pintor-normal-la-parva';

    -- Cerro Manquehue
    IF v_t_manquehue IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_manquehue, '2026-10-24', '16:30 hrs', 'Sunset & Cerveza de Cumbre en el Manquehue', 8, 3, 38000, 40, 'open'),
        (v_t_manquehue, '2026-10-31', '08:00 AM', 'Ascenso Clásico & Técnica de Espolón Rocoso', 8, 5, 35000, 37, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Cerro Manquehuito
    IF v_t_manquehuito IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_manquehuito, '2026-10-23', '17:30 hrs', 'Atardecer Dorado & Café de Altura', 10, 4, 28000, 30, 'open'),
        (v_t_manquehuito, '2026-10-30', '17:30 hrs', 'Iniciación al Trekking & Ocaso Cordillerano', 10, 6, 28000, 30, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Cerro Pochoco
    IF v_t_pochoco IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_pochoco, '2026-10-25', '07:30 AM', 'Entrenamiento Vertical & Desafío Pochoco', 8, 4, 35000, 37, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Mirador de Cóndores
    IF v_t_condores IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_condores, '2026-10-25', '13:30 hrs', 'Expedición Avistamiento de Cóndores & Picnic', 10, 5, 42000, 45, 'open')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Cerro Pintor 4.180m
    IF v_t_pintor IS NOT NULL THEN
        INSERT INTO public.expedition_dates (trail_id, departure_date, departure_time, title_theme, total_slots, available_slots, price_clp, price_usd, status)
        VALUES
        (v_t_pintor, '2026-11-01', '06:30 AM', 'Tu Primer Cuatro Mil: Expedición Cerro Pintor', 6, 2, 85000, 90, 'last_slots')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
