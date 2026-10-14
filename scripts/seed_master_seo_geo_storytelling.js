const fs = require('fs');
const path = require('path');
const { createClient } = require(path.join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js'));

const env = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const MASTER_SEO_GEO_STORIES = {
  // ── 1. SALIDAS GRUPALES ──────────────────────────────────────────────────────
  'Carbón': {
    tagline: 'El balcón de la cuenca poniente donde el atardecer ilumina el skyline de Santiago.',
    paragraphs: [
      'El Cerro Carbón (1.365 msnm) forma parte integral del Cordón Manquehue, una formación precordillerana de origen volcánico y sedimentario que divide la cuenca de Santiago con el valle de Huechuraba y Chicureo. Su nombre evoca las antiguas actividades de carboneros durante la época colonial y republicana temprana, quienes aprovechaban la biomasa de espinos y quillayes para abastecer de combustible al naciente Santiago.',
      'Geológicamente, su ladera poniente exhibe un perfil escarpado moldeado por la tectónica andina y el paso del Río Mapocho en su cuenca baja. Su sendero cruza un microclima de bosque esclerófilo adaptado a sequías extremas, donde abundan litres, guayacanes y el vistoso chagual (Puya chilensis), especie endémica que alimenta a las mariposas del género Castnia y atrae al picaflor gigante cordillerano.',
      'Hoy en día, el Cerro Carbón es reconocido por montañistas y la comunidad de Santiago Hiking como la ruta panorámica vespertina por excelencia. Su cumbre ofrece un ángulo visual privilegiado hacia la Costanera Norte, el Río Mapocho y las torres del distrito financiero de Vitacura y Providencia, convirtiéndose en el hito predilecto para contemplar la puesta de sol cayendo tras la Cordillera de la Costa.'
    ]
  },
  'Manquehuito Sunset': {
    tagline: 'Tu primera cumbre sobre el mar de nubes de Santiago de Chile.',
    paragraphs: [
      'El Cerro Manquehuito (1.319 msnm), diminutivo cariñoso de su hermano mayor el Manquehue, tiene su origen toponímico en la lengua Mapudungun: "Lugar de cóndores pequeños" (Manque: cóndor; We: lugar). Erigido en el límite norte de la comuna de Lo Barnechea, constituyó históricamente un punto de vigilancia natural para los pueblos originarios y cazadores recolectores que dominaban los afluentes del río Mapocho.',
      'La geología del Manquehuito destaca por sus afloramientos de roca andesítica y suaves pendientes de tierra arcillosa en su cara sur, contrastando con cortes rocosos en su arista norte. El sendero asciende entre un bosque nativo de peumos centenarios, tebos y colliguayes, donde en los meses de otoño e invierno se genera el fenómeno de inversión térmica, depositando una densa capa de neblina que cubre la capital como un océano blanco.',
      'En la cultura contemporánea de Santiago Hiking, conquistar la cruz del Manquehuito al romper el alba o al atardecer representa el rito de iniciación andino. Disfrutar de un café caliente de especialidad en su cima mientras las luces de la urbe se encienden bajo el cielo estrellado es una vivencia formativa que conecta el bienestar moderno con la majestuosidad de la cordillera.'
    ]
  },
  'Manquehue': {
    tagline: 'El gran centinela tutelar de la capital andina y nido ancestral de cóndores.',
    paragraphs: [
      'El Cerro Manquehue (1.627 msnm) es el icono geográfico y tutelar indiscutido del valle central de Santiago. Su denominación en Mapudungun ("Lugar de cóndores") no es casual: sus farallones rocosos y corrientes térmicas ascendentes han sido históricamente el refugio y nido del Vultur gryphus (cóndor andino). Para la cultura incaica y picunche local, esta mole de roca volcánica marcaba el calendario solar del equinoccio sobre el valle del Mapocho.',
      'Con una data geológica de más de 19 millones de años perteneciente a la Formación Abanico, el Manquehue es un estratovolcán extinto y erosionado. Su arista cumbrera norte exige un gateo técnico sobre bloques de roca andesita fragmentada por la crioclastia (hielo y deshielo), rodeado de una vegetación xerófita de cactáceas quiscos (Echinopsis chiloensis) y espinos milenarios que sobreviven en laderas de fuerte exposición solar.',
      'Como hito montañero, el Manquehue es la cumbre más codiciada de la precordillera central. Su meseta cumbrera de 360 grados permite abarcar con una sola mirada la cordillera de la Costa por el poniente y el monumental macizo de 5.000 metros de El Plomo por el oriente, consolidándose como la cima escuela donde generaciones de chilenos descubren la pasión por las alturas.'
    ]
  },
  'Alto del Naranjo': {
    tagline: 'La gran terraza de media montaña bajo los farallones del Cerro Provincia.',
    paragraphs: [
      'El Alto del Naranjo (1.890 msnm) se erige en los contrafuertes cordilleranos de la comuna de Las Condes como el descanso natural y puerta de entrada hacia la mítica Sierra de Ramón. A pesar de su nombre, no alberga cítricos, sino que debe su denominación a la presencia histórica de arrieros y antiguos exploradores que bautizaron la meseta en referencia a los tonos anaranjados intensos que tiñen sus riscos durante el ocaso invernal.',
      'El ascenso se remonta desde la confluencia del Estero San Ramón y Puente Ñilhue, remontando una dorsal montañosa con más de 850 metros de desnivel vertical sostenido. El paisaje geográfico se caracteriza por el milenario "Árbol del Naranjo", un imponente ejemplar de Quillay (Quillaja saponaria) de copa monumental que ha resistido rayos, nevazones y vientos cordilleranos durante más de un siglo, brindando sombra vital a los caminantes.',
      'Para la comunidad deportiva y de expedición, el Alto del Naranjo representa la graduación de media montaña. Quienes alcanzan su explanada no solo disfrutan de una vista cenital a Farellones y el Cerro Pochoco, sino que enfrentan la imponente pared oeste del Cerro Provincia, templando las piernas y la resistencia cardiovascular para ascensos de alta graduación.'
    ]
  },
  'Pochoco': {
    tagline: 'La escuela vertical de Santiago donde se forja el carácter montañero.',
    paragraphs: [
      'El Cerro Pochoco (1.804 msnm), ubicado en el histórico sector de El Arrayán en Lo Barnechea, toma su nombre de las voces indígenas locales asociadas a las aguas y vertientes del estero homónimo. A sus pies se construyó en la década de 1960 el Observatorio Astronómico de la Asociación Chilena de Astronomía y Astronáutica (ACHAYA), aprovechando la notable nitidez de sus cielos cordilleranos libres del esmog de la cuenca.',
      'Geográficamente, el Pochoco es famoso por su implacable gradiente: supera más de 800 metros de desnivel en apenas 3 kilómetros de recorrido lineal sobre un suelo descompuesto de maicillo, tierra suelta y bloques de diorita. Su exposición directa a los vientos andinos genera un ecosistema riguroso donde predominan el chagualillo, la bofedilla y el litre achaparrado adaptado a la pendiente continua.',
      'Dentro de la historia del montañismo en Chile, el Pochoco es unánimemente respetado como "la pista de pruebas" de Santiago. Ningún andinista nacional va al Aconcagua o al Plomo sin haber medido antes su ritmo y cadencia en sus aristas empinadas. Es la experiencia perfecta para aprender el uso técnico de bastones, pisada en terreno resbaladizo y respiración controlada.'
    ]
  },
  'Cuevas del Manzano': {
    tagline: 'Cavernas sedimentarias, aguas de deshielo y sombra nativa en el Cajón del Maipo.',
    paragraphs: [
      'Las Cuevas del Manzano (1.650 msnm) se encuentran resguardadas en la quebrada del Estero El Manzano, en la comuna de San José de Maipo. Este valle fluvial fue durante milenios el corredor biológico y camino de trashumancia utilizado por pueblos cazadores Chiquillanes y arrieros cordilleranos para conectar los pastizales altos de los Andes con la cuenca fértil del Río Maipo.',
      'El valor geológico de la ruta radica en sus cavernas y aleros rocosos formados por la disolución de rocas calizas y la erosión fluvial y eólica a lo largo de millones de años. La caminata transcurre a la sombra de un bosque nativo esclerófilo denso y húmedo, enriquecido por peumos, arrayanes y canelos que crecen junto a pozas de agua cristalina alimentadas por los deshielos de la Sierra de Ramón.',
      'Esta experiencia combina trekking formativo y educación geológica. Las cavidades naturales ofrecen un refugio fresco frente al calor estival y miradores privilegiados hacia los farellones de escalada en roca de El Manzano, constituyendo la escapada perfecta para quienes buscan desconectar de la metrópoli y sumergirse en la naturaleza virgen del Cajón del Maipo.'
    ]
  },
  'WildTrek': {
    tagline: 'Exploración fuera de pista por las quebradas salvajes de Lo Barnechea.',
    paragraphs: [
      'WildTrek nació como una filosofía de exploración pura: adentrarse en los filos secundarios y quebradas menos transitadas de la precordillera de Lo Barnechea y La Dehesa. Antiguamente, estos cañones albergaban senderos secretos transitados exclusivamente por baqueanos en busca de ganado extraviado y botánicos pioneros en busca de flora medicinal andina.',
      'El recorrido transita por aristas con microclimas de transición, donde la vegetación densa de quebrada da paso abruptamente a crestas venteadas de roca viva y pastos amarillos de altura. En este corredor biológico es frecuente divisar aves rapaces como el aguilucho común (Geranoaetus polyosoma), zorros culpeos y bandadas de tencas que habitan en los matorrales de espino y maitén.',
      'WildTrek desafía el concepto de trekking convencional de sendero marcado. Invita a los aventureros de Gaz-Style a entrenar el sentido de orientación, la lectura del relieve andino y la resiliencia mental sobre terreno variado, culminando siempre en miradores vírgenes con una taza de café caliente sobre el horizonte santiaguino.'
    ]
  },
  'Networking Manquehuito': {
    tagline: 'Conexión estratégica, liderazgo y claridad mental en la cota 1.319m.',
    paragraphs: [
      'El concepto de Networking en la Montaña transforma la cumbre andina en la sala de reuniones más inspiradora del continente. Inspirado en las expediciones de liderazgo en los Alpes y las Rocosas, aprovecha el entorno del Cerro Manquehuito en Lo Barnechea para despojar a ejecutivos, fundadores y creativos de las jerarquías y ruidos corporativos de la ciudad.',
      'Científicamente, el ejercicio cardiovascular sostenido en la naturaleza libera dopamina y endorfinas, reduciendo los niveles de cortisol y abriendo canales de pensamiento lateral y creatividad. Al ascender entre los aromas del quillay y la brisa cordillerana, las conversaciones fluyen con una honestidad y profundidad imposibles de alcanzar en un café tradicional o una videollamada.',
      'Cada edición reúne a una comunidad seleccionada con cupos estrictamente limitados. Guiados por Gaz con protocolos WFR, los participantes comparten desafíos de negocios, proyectos y visiones estratégicas, sellando alianzas duraderas durante el brindis con infusión caliente frente al espectáculo visual del mar de nubes.'
    ]
  },
  'Sunset Treks ': {
    tagline: 'La hora dorada de los Andes: el arte de despedir el día desde las cumbres de Santiago.',
    paragraphs: [
      'Los Sunset Treks representan el tributo andino a la hora mágica. En la mitología cordillerana, el solsticio y los atardeceres sobre los cordones precordilleranos de la cuenca central eran momentos ceremoniales donde las montañas proyectaban sombras monumentales sobre el valle, anunciando el reposo y la vigilia de las cumbres.',
      'La ruta aprovecha senderos de pendiente amable y segura en los cordones de Vitacura y Lo Barnechea. El terreno permite avanzar con paso tranquilo mientras la temperatura desciende y la luz solar vira del ámbar al magenta, contrastando con la silueta de los glaciares lejanos y la masa de rascacielos que comienza a titilar en la penumbra urbana.',
      'Es la experiencia de entrada ideal para quienes trabajan en la ciudad y desean culminar su jornada laboral con ejercicio regenerativo. Concluye en un mirador seguro donde compartimos termo en mano, fotografías de alta definición y un descenso nocturno asistido con linternas frontales que transforma la bajada en una aventura mágica.'
    ]
  },

  // ── 2. TRAVESÍAS & GRANDES DESAFÍOS ──────────────────────────────────────────
  'Travesía Sierra de Ramón': {
    tagline: 'La columna vertebral de Santiago: 21 kilómetros de filo andino a más de 3.000 metros.',
    paragraphs: [
      'La Sierra de Ramón es el muro orográfico natural que contiene a Santiago por el oriente. Su travesía completa es una leyenda viva del andinismo chileno: encadena el Cerro Provincia (2.750m), el Morro del Tambo, el Cerro Los Azules y la cumbre mayor de San Ramón (3.253m). Su historia se remonta a los primeros trazados indígenas y a las expediciones de arrieros que pastoreaban en las vegas altas durante los veranos del siglo XIX.',
      'Geológicamente, la sierra es un bloque alzado producto de la compresión tectónica de la Placa de Nazca bajo la Sudamericana, expuesto a intensas oscilaciones térmicas. La ruta es un desafío continuo sin fuentes de agua en las alturas: avanza sobre aristas rocosas afiladas, canchales de acarreo inestables y pasos de escalada fácil (tercer grado) donde el abismo hacia Peñalolén y La Reina se abre a miles de metros bajo los pies.',
      'Completar la Sierra de Ramón en una jornada non-stop (+2.100m de desnivel acumulado y más de 12 horas de marcha) es una consagración deportiva en Chile. Requiere una gestión impecable de hidratación, nutrición de marcha y fortaleza psicológica para sostener el ritmo sobre las nubes, recompensado con la vista colosal a los colosos glaciares de El Plomo, Tupungato y el volcán San José.'
    ]
  },
  'Desbloqueando Santiago': {
    tagline: 'El programa de maestría andina: 6 semanas, 6 cumbres para dominar la cuenca central.',
    paragraphs: [
      'Desbloqueando Santiago es el método formativo definitivo concebido por Gaz-Style para transformar a caminantes urbanos en montañistas de autonomía real. Históricamente, las cumbres de la capital eran abordadas de forma improvisada; este programa rescata la metodología progresiva de las escuelas de guías europeas, estructurando un circuito graduado que va de los 1.300 a los 3.250 metros de altitud.',
      'El plan abarca el estudio biogeográfico de toda la cuenca: desde el bosque esclerófilo denso del Carbón y Manquehuito, hasta el piso periglacial de roca viva y congelamiento nocturno en la cumbre del San Ramón. Cada sábado, los participantes aprenden técnica de zancada eficiente, biomecánica con bastones, termorregulación por capas y lectura meteorológica de la atmósfera andina.',
      'Al completar las 6 semanas, el aventurero no solo ha ganado un estado físico de élite y reducido grasa corporal, sino que ha desbloqueado la cartografía completa de su territorio natal, convirtiéndose en guardián de la montaña con certificación de competencias y camaradería indestructible.'
    ]
  },
  'Cerro La Cruz 2.552m': {
    tagline: 'La arista escarpada de la Sierra de Ramón que desafía el vértigo sobre Peñalolén.',
    paragraphs: [
      'El Cerro La Cruz (2.552 msnm) es la cumbre más técnica y agreste de la cara poniente de la Sierra de Ramón. Visible desde cualquier punto del oriente santiaguino por su marcada silueta piramidal, fue bautizado por los primeros pobladores de la comuna de Peñalolén y Las Condes en alusión a las cruces de hierro erigidas en memoria de las primeras expediciones religiosas y montañeras del siglo pasado.',
      'Su aproximación por el Parque Natural Quebrada de Macul o Parque Mahuida remonta una pendiente demoledora de más de 1.600 metros de desnivel vertical. El tercio final de la ruta abandona el sendero pedestre para encaramarse sobre una arista rocosa donde el gateo de manos (scrambling) y el tránsito sobre gendarmes de andesita exigen concentración absoluta y cero propensión al vértigo.',
      'Para los amantes del trail de montaña y hiking extremo, La Cruz es el gran termómetro de agilidad alpina. Su cumbre solitaria premia con una panorámica vertiginosa que cae en picada sobre la ciudad de Santiago, ofreciendo la sensación inigualable de flotar en una isla de roca sobre la metrópoli.'
    ]
  },
  'Cerro Carpa & Conchalí 2.776m': {
    tagline: 'El balcón infinito sobre El Arrayán y los glaciares mayores de la cordillera.',
    paragraphs: [
      'El Cerro Carpa (2.776 msnm) y su contiguo Cerro Conchalí dominan la cuenca alta del río Mapocho en Lo Barnechea. Tradicionalmente, sus lomajes y filos fueron utilizados por arrieros de El Arrayán para conducir ganado hacia las veranadas de la alta cordillera, conectando de forma natural con los valles de Farellones y el Cajón del Plomo.',
      'Geológicamente, esta travesía se distingue por sus extensas aristas cumbreras de viento constante y cielos puros. A diferencia de las quebradas boscosas de la base, sobre los 2.000 metros el terreno se abre a planicies periglaciares donde la vegetación se reduce a bofedales andinos y diminutas flores de altura como las llaretas (Azorella compacta) y las senecios cordilleranos.',
      'El ascenso conjunto a Carpa y Conchalí es una jornada de resistencia pura: más de 8 a 9 horas de marcha continua con vistas frontales y despejadas al gigantesco macizo de El Plomo (5.424m) y al Glaciar La Paloma. Es la expedición predilecta para quienes buscan soledad montañera sin multitudes en las proximidades de Santiago.'
    ]
  },
  'Morro Buitrero & Cerro San Roque': {
    tagline: 'Canchales vírgenes y avistamiento de cóndores en la antesala de Farellones.',
    paragraphs: [
      'El Morro Buitrero y el Cerro San Roque se yerguen como centinelas de roca sobre la garganta de El Arrayán en Lo Barnechea. Su toponimia hace honor directo al buitre o cóndor andino, cuyas colonias de descanso utilizan los farellones verticales del morro como plataforma de despegue hacia las corrientes térmicas que suben del valle.',
      'La geología de estos cerros se caracteriza por canchales de piedra fragmentada y una marcada aridez en sus aristas superiores, testimonio de la erosión glacial del pleistoceno en la cuenca central. Los senderos son antiguos pasos de herradura apenas visibles entre matorrales bajos y espinales achaparrados por la altitud.',
      'Esta travesía es una joya oculta para quienes buscan salir de las rutas masivas. Proporciona un entrenamiento de equilibrio técnico en descensos pronunciados y regala una perspectiva salvaje y poco fotografiada de la cordillera andina que custodia la zona oriente de la capital.'
    ]
  },
  'Cerro Provincia': {
    tagline: 'El titán de 2.750m: 1.800 metros de desnivel vertical en una sola jornada heroica.',
    paragraphs: [
      'El Cerro Provincia (2.750 msnm) es el reto de resistencia por antonomasia de los Andes santiaguinos. Su nombre data de los tiempos virreinales, cuando delimitaba los linderos de la provincia y servía de brújula a los viajeros que cruzaban desde Mendoza por los pasos cordilleranos. En su cumbre descansa el histórico domo refugio metálico erigido por el Club Alemán Andino (DAV), símbolo de décadas de hermandad de montaña.',
      'Con un desnivel positivo de más de 1.800 metros directos desde Puente Ñilhue, el Provincia exige superar tres pisos ecológicos: el bosque esclerófilo inicial, la estepa andina de matorral bajo sobre Alto del Naranjo, y el desierto periglacial rocoso final. Las temperaturas pueden oscilar entre los 25°C en la base y congelamiento bajo cero con ráfagas de viento blanco en la arista cumbrera.',
      'Alcanzar la cumbre del Provincia es una prueba de carácter físico y templanza mental. Quienes firman el libro del domo refugio saben que han completado uno de los desniveles continuos de acceso urbano más brutales del mundo, con una vista majestuosa al volcán Tupungatito y a la inmensidad de los Andes centrales.'
    ]
  },
  'La Triple Corona Andina': {
    tagline: 'El triatlón de senderos: Manquehuito, Manquehue y Pochoco encadenados en un día.',
    paragraphs: [
      'La Triple Corona Andina es la máxima expresión del ultra-hiking de la cuenca central. Nacida como un desafío de resistencia deportiva concebido por atletas de montaña y guías de Gaz-Style, encadena en una sola jornada sin pausas las tres cumbres más emblemáticas de la precordillera de Santiago: Manquehuito (1.319m), Manquehue (1.627m) y Pochoco (1.804m).',
      'La prueba suma más de 2.100 metros de desnivel positivo acumulado y más de 18 kilómetros de terreno hostil, intercalando acarreos sueltos, gateos sobre andesita y pendientes verticales. La logística demanda transiciones cronometradas de hidratación, alimentación electrolítica y traslados estratégicos entre los puntos de acceso de Lo Barnechea y Vitacura.',
      'Solo un porcentaje reducido de deportistas logra completar la corona antes de que caiga el sol. Es una experiencia de alta graduación física que forja una camaradería inquebrantable entre los integrantes del grupo, celebrada con el tradicional brindis y credencial de cumbre de Santiago Hiking.'
    ]
  },
  'Desafío 5:00 AM': {
    tagline: 'Sube antes de que despierte la ciudad. Vuelve a tu día transformado.',
    paragraphs: [
      'El Desafío 5:00 AM es la experiencia insignia de desconexión temprana en Santiago de Chile. Mientras la capital descansa en un silencio absoluto, la cordillera cobra vida bajo un manto de estrellas. Esta travesía rescata la antigua disciplina de los ascensos nocturnos alpinos, donde el montañista gana el desnivel en la frescura de la madrugada para evitar el castigo del sol estival.',
      'Subir de noche agudiza los sentidos de forma profunda: el crujir del suelo bajo las botas, la respiracióncompasada, el susurro del viento andino en los espinos y la vista hipnótica de la cuenca urbana iluminada como una galaxia dorada bajo nuestros pies. El paso sincronizado de las linternas frontales genera una sensación de tribu y seguridad inigualable.',
      'La cumbre del Manquehuito nos recibe en el momento exacto en que la línea del horizonte cordillerano estalla en colores ámbar, violeta y carmesí. Con café de especialidad caliente recién preparado y servido en la cima, celebramos la vida y la montaña antes de descender al valle, comenzando la jornada con una energía y claridad mental invencibles.'
    ]
  },
  'La Triple Corona de Santiago': {
    tagline: 'El reto legendario de ultra-resistencia por los tres gigantes de la precordillera.',
    paragraphs: [
      'La Triple Corona de Santiago es el hito definitivo para los atletas outdoor de Chile. Diseñada para evaluar la fuerza muscular excéntrica, la capacidad pulmonar en altitud y la resiliencia psicológica ante la fatiga prolongada, conecta en un solo esfuerzo continuo las aristas más demandantes de la cuenca del Mapocho.',
      'Desde el primer ascenso madrugador con el alba hasta el descenso final al crepúsculo, los participantes experimentan los contrastes extremos del clima de montaña de Santiago: inversión térmica matinal, calor seco en las laderas expuestas al mediodía y vientos gélidos en los filos altos. El protocolo de seguridad WFR y monitoreo cardíaco constante garantiza que cada aventurero rinda al máximo sin arriesgar su integridad física.',
      'Quien conquista la Triple Corona ingresa al cuadro de honor de Santiago Hiking. Es una odisea deportiva que deja una huella imborrable en el cuerpo y el espíritu, demostrando que los límites urbanos quedan chicos frente al potencial humano en la montaña.'
    ]
  },
  'Cerro San Ramón 3.253m': {
    tagline: 'El techo de la cuenca central: la cumbre más alta frente a la capital de Chile.',
    paragraphs: [
      'El Cerro San Ramón (3.253 msnm) es el monarca absoluto que corona la Sierra de Ramón. En la cosmovisión prehispánica de los valles centrales, este macizo nevado era venerado como el principal hito dador de agua, alimentando a través de sus neveros y esteros (Macul, San Ramón) la agricultura de los pueblos diaguitas y picunches locales mucho antes de la llegada de Pedro de Valdivia.',
      'Con un desnivel salvaje de más de 2.300 metros verticales desde la base de Parque Mahuida o Quebrada de Macul, el ascenso al San Ramón equivale a subir un ocho mil en miniatura en cuanto a esfuerzo físico de un día. Su arista final cruza canchales periglaciares, manchones de nieve perenne y formaciones rocosas erosionadas por vientos huracanados que superan los 80 km/h en invierno.',
      'Alcanzar la cumbre de 3.253 metros sitúa al montañista sobre la estratosfera visual de Santiago. Hacia el oriente se despliegan en toda su gloria el coloso Volcán Tupungato (6.570m), el Cerro El Plomo y los glaciares infinitos de los Andes centrales, en una de las vivencias de montañismo de mayor orgullo del territorio chileno.'
    ]
  },

  // ── 3. EXPEDITION HIGH MOUNTAIN ──────────────────────────────────────────────
  'Expedición Cerro El Plomo 5.424m': {
    tagline: 'El Apu sagrado del Tawantinsuyu y santuario incaico de mayor altura en los Andes centrales.',
    paragraphs: [
      'El Cerro El Plomo (5.424 msnm) es la montaña más sagrada y monumental visible desde Santiago. A más de cinco mil metros de altitud, albergó el santuario incaico de altura donde en 1954 fue descubierto el famoso "Niño del Plomo", ofrenda sagrada de la ceremonia de Capacocha del siglo XV. Para la civilización del Tawantinsuyu, El Plomo no era solo una cumbre, sino el Apu supremo que regulaba las lluvias, los deshielos del río Mapocho y la vida de toda la cuenca.',
      'La expedición técnica remonta valles glaciares míticos partiendo desde Valle Nevado o La Parva, cruzando Piedra Numerada (3.350m) y estableciendo campamento base de altura en el refugio Federación (4.150m). El día de cumbre exige atravesar el sobrecogedor nevero del Glaciar Iver a más de 5.200 metros sobre el nivel del mar, utilizando crampones y piolet con temperaturas que descienden de los -15°C.',
      'Guiada con logística de porteo en mulas, arrieros tradicionales de Farellones, carpas de expedición cuatro estaciones y monitoreo constante de oximetría y WFR, la conquista de El Plomo con Santiago Hiking es la coronación de un sueño andinista de clase mundial, igualando los más altos estándares internacionales de seguridad y respeto patrimonial.'
    ]
  },
  'Expedición Cerro Leonera 4.954m': {
    tagline: 'La gran escuela de cinco mil metros y balcón directo a la pared sur de El Plomo.',
    paragraphs: [
      'El Cerro Leonera (4.954 msnm) debe su nombre a los antiguos relatos de arrieros y cazadores de guanacos de Farellones, quienes avistaban pumas (leones de montaña) refugiándose en sus quebradas antes de que el invierno cubriera de nieve sus laderas altas. Es el vecino inmediato y compañero de cordón del Cerro El Plomo, compartiendo su misma alcurnia andina.',
      'La ruta establece su campamento avanzado en la meseta de Cancha de Carreras (4.100 msnm), un altiplano periglacial barrido por el viento andino donde las noches regalan una vía láctea de nitidez cósmica. El ascenso final por su filo norte discurre sobre acarreos de piedra volcánica y bandas rocosas con vistas sobrecogedoras a la pared sur de El Plomo y a los glaciares colgantes de La Paloma y El Altar.',
      'El Leonera es considerado unánimemente por los instructores de montaña como la antesala perfecta para expediciones a seismiles en el norte de Chile y el Himalaya. Permite evaluar la aclimatación a casi 5.000 metros en un formato de 2 a 3 días con logística integral de campamento base, alimentación gourmet liofilizada y guiado experto.'
    ]
  },
  'Expedición Volcán San José 5.856m': {
    tagline: 'El coloso volcánico activo del Cajón del Maipo en la frontera con Argentina.',
    paragraphs: [
      'El Volcán San José (5.856 msnm) es un estratovolcán activo monumental ubicado en el extremo oriental del Cajón del Maipo, marcando el límite geopolítico entre Chile y Argentina. Su inmenso cráter de casi dos kilómetros de diámetro y sus fumarolas azufradas activas han sido veneradas y temidas por los pueblos andinos desde tiempos inmemoriales como morada de las fuerzas telúricas de la cordillera.',
      'La expedición se inicia en el sector de Cabreríos o Valle de La Engorda, ascendiendo hacia el histórico Refugio Plantat (3.130m) construido en 1937, para luego emplazar campamentos de altura sobre las morrenas glaciares (Campamento Las Lajas a 4.100m). La jornada de cumbre demanda sortear extensos campos de penitentes de hielo, neveros de alta inclinación y bajas temperaturas extremas.',
      'Alcanzar la cumbre de 5.856 metros sobre el cráter humeante del San José es una hazaña de alta montaña absoluta. La perspectiva visual abarca desde los valles argentinos de Mendoza hasta la cuenca central chilena, en una travesía de autonomía y liderazgo guiada con los máximos protocolos de expedición de Puma Adventures y Gaz-Style.'
    ]
  },

  // ── 4. EXPEDITION BOUTIQUE ──────────────────────────────────────────────────
  'Monumento Natural El Morado VIP': {
    tagline: 'Laguna glaciar, aguas minerales y la elegancia del Cajón del Maipo privado.',
    paragraphs: [
      'El Monumento Natural El Morado, custodiado por la Corporación Nacional Forestal (CONAF) en el corazón del Cajón del Maipo, es uno de los santuarios geológicos más espectaculares de Chile central. Dominado por el Cerro Morado (5.060m) y el Cerro San Francisco, su valle glacial exhibe depósitos sedimentarios marinos fosilíferos que datan de cuando los Andes se encontraban sumergidos bajo el océano Pacífico.',
      'La caminata privada remonta el valle hasta el sector de Aguas Panimávidas —fuentes naturales de aguas minerales carbonatadas que brotan a temperatura constante— para culminar en la Laguna Glaciar El Morado a 2.400 metros de altitud, donde colosales bloques de hielo flotan sobre aguas lechosas de origen nival.',
      'En el formato Expedition Boutique, el cliente disfruta de transporte privado ejecutivo puerta a puerta desde su hotel en Santiago, catering gourmet de montaña, registro fotográfico y video Reel 4K profesional, cerrando la jornada con un circuito de relajación en aguas termales del cajón.'
    ]
  },
  'Cerro Pintor 4.180m VIP': {
    tagline: 'El coliseo de colores sobre La Parva y la puerta de entrada a los cuatro mil metros.',
    paragraphs: [
      'El Cerro Pintor (4.180 msnm) hace gala a su nombre con una de las paletas cromáticas más asombrosas de la cordillera andina. Las sucesivas capas de minerales de cobre, azufre, hierro y manganeso han oxidado sus laderas en tonalidades que van del rojo ocre y amarillo terracota al verde turquesa y violeta, creando una auténtica pintura geológica al aire libre.',
      'Partiendo desde los andariveles altos de La Parva a más de 3.000 metros, la ruta corona primero la Falsa Parva y la cumbre de La Parva (3.970m), para recorrer una arista panorámica sobre el filo que divide la cuenca del Mapocho con el santuario natural de Yerba Loca. Desde su cima, la pared de hielo del Glaciar La Paloma y el macizo del Altar parecen estar al alcance de la mano.',
      'El programa Boutique ofrece un ascenso exclusivo de alta gama a un seismil en potencia: incluye aclimatación guiada paso a paso, transporte en SUV 4x4 de alta gama hasta la base, snack gourmet de marcha y material audiovisual premium para redes sociales.'
    ]
  },
  'Cerro Manquehue Sunset VIP': {
    tagline: 'El centinela de Santiago en privado: catering de altura y regreso nocturno asistido.',
    paragraphs: [
      'El Cerro Manquehue Sunset VIP reinventa el clásico ascenso a la cumbre más representativa de Santiago como una experiencia de hospitalidad y lujo al aire libre. Pensada para viajeros internacionales, parejas y comitivas privadas que buscan vivir la montaña sin las multitudes ni la prisa del senderismo masivo.',
      'La travesía comienza con el pick-up privado en el hotel del huésped en Las Condes, Vitacura o Lo Barnechea. El ascenso es pausado y guiado de forma personalizada por Gaz, interpretando la flora nativa, la geología del antiguo volcán extinto y la historia de la fundación de Santiago bajo la mirada del cóndor andino.',
      'En la cumbre, mientras el cielo se incendia con la puesta de sol sobre el Pacífico, se monta un servicio de catering con infusiones de montaña, café filtrado y tablas gourmet de degustación andina, descendiendo bajo un cielo estrellado con linternas de alta gama y total seguridad.'
    ]
  },
  'Glaciar Nieves Negras & Termas de Colina VIP': {
    tagline: 'Morrenas glaciares al pie del Volcán San José y pozas termales minerales al anochecer.',
    paragraphs: [
      'El Glaciar Nieves Negras es un fenómeno glaciológico excepcional: una inmensa masa de hielo fósil cubierta por morrenas oscuras de roca volcánica y ceniza expulsadas por las milenarias erupciones del Volcán San José. El contraste entre el hielo milenario, el polvo negro volcánico y las vertientes turquesas del Río Volcán crea un paisaje sobrecogedor de aspecto casi lunar.',
      'La expedición privada recorre el cajón del río hasta alcanzar los pies de la morrena glacial, donde se aprecian grietas, seracs y lagunas de deshielo en un entorno de aislamiento total. El guía experto WFR instruye sobre la dinámica de retroceso glaciar y la geología del arco volcánico andino.',
      'La jornada culmina con el descenso hacia las Termas de Valle de Colina, donde pozas escalonadas de agua termal mineralizada a temperaturas de entre 30°C y 55°C relajan el cuerpo bajo las estrellas cordilleranas, complementado con traslado VIP puerta a puerta y producción fotográfica 4K.'
    ]
  }
};

async function seedMasterStorytelling() {
  console.log('=== ACTUALIZANDO HISTORIA MASTER & SEO GEO EN SUPABASE ===\n');
  const { data: routes, error } = await supabase
    .from('adventures_catalog')
    .select('id, title, vertical_type');

  if (error) {
    console.error('Error al obtener catálogo:', error.message);
    return;
  }

  let updatedCount = 0;

  for (const route of routes) {
    const rawTitle = route.title.trim();
    // Buscar coincidencia en MASTER_SEO_GEO_STORIES
    let matchKey = Object.keys(MASTER_SEO_GEO_STORIES).find(k => 
      rawTitle.toLowerCase() === k.toLowerCase() ||
      rawTitle.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(rawTitle.toLowerCase())
    );

    if (matchKey) {
      const storyData = MASTER_SEO_GEO_STORIES[matchKey];
      const { error: updateError } = await supabase
        .from('adventures_catalog')
        .update({
          story_paragraphs: storyData.paragraphs,
          tagline: storyData.tagline
        })
        .eq('id', route.id);

      if (updateError) {
        console.error(`✗ Error actualizando "${route.title}":`, updateError.message);
      } else {
        console.log(`✓ [${route.vertical_type}] "${route.title}" -> 3 párrafos de historia inyectados.`);
        updatedCount++;
      }
    } else {
      console.log(`- Sin coincidencia exacta para: "${route.title}"`);
    }
  }

  console.log(`\n=== FINALIZADO: ${updatedCount}/${routes.length} RUTAS ACTUALIZADAS CON HISTORIA SEO GEO ===`);
}

seedMasterStorytelling();
