export interface ChallengeDetail {
  slug: string;
  badge: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  coverImage: string;
  gallery: { url: string; caption: string }[];
  metrics: {
    altitud: string;
    desnivel: string;
    distancia: string;
    tiempo: string;
    dificultad: string;
    ubicacion: string;
    temporada: string;
    cupoMax: string;
  };
  descripcion: {
    parrafo1: string;
    parrafo2: string;
    parrafo3: string;
  };
  dondeEsta: {
    sector: string;
    acceso: string;
    puntoEncuentro: string;
    coordenadas: string;
  };
  queVemos: {
    titulo: string;
    descripcion: string;
  }[];
  itinerario: {
    hora: string;
    titulo: string;
    descripcion: string;
  }[];
  incluye: string[];
  noIncluye: string[];
  equipoRequerido: string[];
  precioReferencial: string;
  precioCLP: number;
  precioText: string;
  precioUSD: string;
  precioBajada: string;
  fechasDisponibles: {
    id: string;
    fecha: string;
    hora: string;
    cuposDisponibles: number;
    cuposTotales: number;
    estado: string;
  }[];
  whatsappMessage: string;
}

export const challengesData: Record<string, ChallengeDetail> = {
  'desafio-5am': {
    slug: 'desafio-5am',
    badge: 'SERIE ALBA · COTA 1.638M',
    number: '01',
    title: 'Desafío 5:00 AM',
    subtitle: 'Ascenso nocturno al Manquehuito para conquistar la cumbre al romper el alba sobre el mar de nubes de Santiago.',
    tagline: 'Sube antes de que despierte la ciudad. Vuelve a tu día transformado.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=85',
        caption: 'Los primeros rayos del sol sobre la Cordillera de los Andes'
      },
      {
        url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1000&q=85',
        caption: 'Amanecer dorado en la cruz cumbrera'
      },
      {
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=85',
        caption: 'Contemplación sobre la cuenca de Santiago cubierta de nubes'
      }
    ],
    metrics: {
      altitud: '1.638 msnm',
      desnivel: '+420m D+',
      distancia: '4.2 km ida y vuelta',
      tiempo: '3.5 a 4 horas totales',
      dificultad: 'Iniciación Activa / Moderada',
      ubicacion: 'Cerro Manquehuito, Lo Barnechea, Santiago',
      temporada: 'Todo el año (Otoño / Invierno amaneceres épicos)',
      cupoMax: '8 personas (Grupo reducido boutique)'
    },
    descripcion: {
      parrafo1: 'El Desafío 5:00 AM es la experiencia insignia de desconexión temprana en Santiago. Mientras la ciudad duerme en silencio, nos reunimos al pie de la montaña con linternas frontales encendidas para iniciar una caminata pausada, rítmica y consciente bajo el cielo estrellado.',
      parrafo2: 'Subir de noche agudiza los sentidos: el sonido del viento andino en los matorrales esclerófilos, la vista de la cuenca iluminada como un mapa de luces titilantes y el aire frío de la madrugada que despeja la mente de toda carga laboral.',
      parrafo3: 'La cumbre nos recibe justo cuando el horizonte cordillerano comienza a teñirse de tonos ámbar, violeta y dorado. Allí, en la cruz del Manquehuito, contemplamos el amanecer, celebramos la cumbre y descendemos antes de las 9:00 AM para que comiences tu día con la energía de la montaña.'
    },
    dondeEsta: {
      sector: 'Sector El Golf Manquehue / Los Trapenses, Comuna de Lo Barnechea.',
      acceso: 'Camino pavimentado hasta el inicio de sendero. Estacionamientos seguros en la zona baja.',
      puntoEncuentro: 'Punto de encuentro coordinado en Lo Barnechea (o traslado opcional a convenir).',
      coordenadas: "33°20'45\"S 70°34'12\"W"
    },
    queVemos: [
      {
        titulo: 'Amanecer sobre el Mar de Nubes',
        descripcion: 'Durante gran parte del año, la vaguada costera cubre Santiago de una alfombra blanca de nubes sobre la cual asoman únicamente las cumbres andinas.'
      },
      {
        titulo: 'Celebración en Cumbre',
        descripcion: 'Contemplamos los primeros rayos de sol sobre la cordillera a 1.600 metros de altura.'
      },
      {
        titulo: 'Vista 360° de la Cuenca Andina',
        descripcion: 'Panorámica completa hacia el Cerro Manquehue, Cerro Pochoco, la Sierra de Ramón y la imponente pared del Glaciar El Plomo al fondo.'
      },
      {
        titulo: 'Flora y Fauna Nativa Esclerófila',
        descripcion: 'Bosque nativo de litres, quillayes y espinos, con frecuentes avistamientos de lechuzas al amanecer y cóndores sobrevolando las crestas.'
      }
    ],
    itinerario: [
      {
        hora: '05:00 AM',
        titulo: 'Punto de Encuentro y Charla Técnica',
        descripcion: 'Revisión de equipo, entrega de linternas y bastones, chequeo de seguridad y ajuste de mochilas.'
      },
      {
        hora: '05:20 AM',
        titulo: 'Inicio del Ascenso con Frontales',
        descripcion: 'Caminata nocturna a ritmo constante y amable, con pausas de hidratación y aclimatación.'
      },
      {
        hora: '06:40 AM',
        titulo: 'Cumbre Manquehuito & Romper del Alba',
        descripcion: 'Llegada a la cima. Apagamos linternas y contemplamos la salida del sol sobre los Andes centrales.'
      },
      {
        hora: '07:00 AM',
        titulo: 'Ritual de Cumbre al Amanecer',
        descripcion: 'Ración de marcha energética, hidratación y sesión de fotos profesionales.'
      },
      {
        hora: '07:45 AM',
        titulo: 'Descenso Seguro',
        descripcion: 'Bajada con luz de día apreciando la vegetación y senderos de la ladera norte.'
      },
      {
        hora: '08:45 AM',
        titulo: 'Cierre de Jornada',
        descripcion: 'Llegada al punto de partida. Estiramiento, hidratación final y regreso a la ciudad.'
      }
    ],
    incluye: [
      'Guía profesional certificado Wilderness First Responder (WFR)',
      'Ración de marcha energética premium',
      'Equipamiento técnico de apoyo para la marcha',
      'Linterna frontal de alta potencia disponible para quien la requiera',
      'Botiquín de trauma y primeros auxilios avanzado en ruta',
      'Comunicación satelital y radios VHF de montaña',
      'Registro fotográfico profesional en alta definición incluido',
      'Seguro de accidentes personales en montaña'
    ],
    noIncluye: [
      'Transporte hasta el punto de inicio (disponible con recargo coordinado)',
      'Calzado técnico personal y ropa de abrigo',
      'Propinas voluntarias'
    ],
    equipoRequerido: [
      'Calzado de trekking con buen agarre (suela con dibujo antideslizante)',
      'Chaqueta cortaviento o pluma liviana (hace frío en cumbre antes de la salida del sol)',
      'Primera capa térmica o polera deportiva transpirable',
      'Botella o termo con mínimo 1.5 litros de agua',
      'Mochila pequeña de ataque (15 a 25 litros)'
    ],
    precioReferencial: '$45.000 CLP / $50 USD por persona',
    precioCLP: 45000,
    precioText: '$45.000 CLP',
    precioUSD: 'US$ 50',
    precioBajada: 'Por persona · Guía profesional + fotos en alta resolución incluidas',
    fechasDisponibles: [
      {
        id: '5am-oct24',
        fecha: 'Sábado 24 Octubre 2026',
        hora: '05:00 AM',
        cuposDisponibles: 4,
        cuposTotales: 8,
        estado: 'Cupos abiertos'
      },
      {
        id: '5am-nov01',
        fecha: 'Domingo 1 Noviembre 2026',
        hora: '05:00 AM',
        cuposDisponibles: 2,
        cuposTotales: 8,
        estado: 'Últimos 2 cupos'
      },
      {
        id: '5am-nov07',
        fecha: 'Sábado 7 Noviembre 2026',
        hora: '05:00 AM',
        cuposDisponibles: 6,
        cuposTotales: 8,
        estado: 'Cupos abiertos'
      }
    ],
    whatsappMessage: 'Hola Gaz! Me interesa sumarme o agendar una salida para el Desafío 5:00 AM Manquehuito.'
  },

  'triple-corona': {
    slug: 'triple-corona',
    badge: 'EL RETO DEFINITIVO · 3 CUMBRES',
    number: '02',
    title: 'La Triple Corona de Santiago',
    subtitle: 'El circuito andino supremo: Manquehuito (1.638m), Cerro Manquehue (1.635m) y Cerro Pochoco (1.804m) en un programa de resistencia y conquista real.',
    tagline: 'Tres cumbres clásicas. Más de 2.100 metros de desnivel acumulado. Tu consagración en la cuenca.',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1000&q=85',
        caption: 'Aristas de roca viva en el ascenso al Cerro Manquehue'
      },
      {
        url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=1000&q=85',
        caption: 'El grupo avanzando con bastones por senderos andinos'
      },
      {
        url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=85',
        caption: 'La imponente vista desde la cumbre rocosa de Pochoco'
      }
    ],
    metrics: {
      altitud: '1.804 msnm (Cumbre Pochoco)',
      desnivel: '+2.100m D+ acumulados',
      distancia: '18.5 km totales',
      tiempo: '10 a 12 horas (o formato 2 días)',
      dificultad: 'Alta / Exigente (Física y Mental)',
      ubicacion: 'Cordón Manquehue & Arrayán, Lo Barnechea',
      temporada: 'Abril a Noviembre (Clima fresco de media temporada)',
      cupoMax: '6 personas (Ratio guía-pax ultra seguro)'
    },
    descripcion: {
      parrafo1: 'La Triple Corona es el hito formativo por excelencia para todo montañista en la zona central de Chile. Conecta en una sola épica travesía las tres montañas más emblemáticas y demandantes de la precordillera capitalina: el ágil Manquehuito, el colosal Manquehue con su arista de roca y la verticalidad del Cerro Pochoco.',
      parrafo2: 'No se trata solo de caminar: es una prueba de dosificación de energía, hidratación táctica, ritmo de respiración y temple mental. Superar los 2.100 metros de ascenso te sitúa en el nivel de montañista preparado para expediciones mayores en los Andes.',
      parrafo3: 'Acompañado en todo momento por Gaz con protocolos internacionales WFR y apoyo logístico entre tramos, este desafío transforma tu relación con tu propio cuerpo y te gradúa como conocedor absoluto de la cuenca andina de Santiago.'
    },
    dondeEsta: {
      sector: 'Cordón Manquehue, Bosques de Santa María y Quebrada del Arrayán, Lo Barnechea.',
      acceso: 'Puntos de partida y transición con vehículo de apoyo coordinado.',
      puntoEncuentro: 'Plaza San Enrique o punto base en Lo Barnechea.',
      coordenadas: "33°21'10\"S 70°32'40\"W"
    },
    queVemos: [
      {
        titulo: 'Las Tres Perspectivas de la Cuenca',
        descripcion: 'Desde el Manquehue verás toda la ciudad a tus pies; desde Pochoco, la entrada profunda al Cajón del Arrayán y las altas cumbres glaciares.'
      },
      {
        titulo: 'Terreno Técnico y Pasos de Bloques',
        descripcion: 'Aprenderás a transitar acarreo andino, trepadas sencillas en roca firme y uso técnico de bastones para no castigar rodillas.'
      },
      {
        titulo: 'Vuelo de Cóndores Andinos',
        descripcion: 'Las térmicas del cordón Manquehue y Pochoco albergan las colonias de cóndores más activas de Santiago; los verás planear a escasos metros.'
      },
      {
        titulo: 'El Festejo del Tercer Tiempo',
        descripcion: 'Al culminar la tercera cumbre, bajamos a celebrar con maridaje local, hidratación fría y la entrega de tu distinción de la Triple Corona.'
      }
    ],
    itinerario: [
      {
        hora: '06:00 AM',
        titulo: 'Cumbre 1: Cerro Manquehuito',
        descripcion: 'Calentamiento progresivo y primera conquista con las primeras luces del día.'
      },
      {
        hora: '08:30 AM',
        titulo: 'Cumbre 2: Cerro Manquehue (El Gran Guardián)',
        descripcion: 'Ascenso por la ladera este, superando la arista rocosa hasta los 1.635m.'
      },
      {
        hora: '12:30 PM',
        titulo: 'Punto de Reabastecimiento e Hidratación',
        descripcion: 'Transición, comida balanceada de montaña y chequeo de signos vitales.'
      },
      {
        hora: '02:00 PM',
        titulo: 'Cumbre 3: Cerro Pochoco (La Pared Vertical)',
        descripcion: 'Ascenso exigente y técnico por la quebrada del Arrayán hasta la cumbre a 1.804m.'
      },
      {
        hora: '05:30 PM',
        titulo: 'Descenso Final & Celebración',
        descripcion: 'Bajada con técnica de bastones, regreso al punto base y tercer tiempo de camaradería.'
      }
    ],
    incluye: [
      'Guía líder certificado WFR con amplia experiencia en rutas de alta exigencia',
      'Monitoreo constante de hidratación, pulsaciones y bienestar en ruta',
      'Ración de marcha técnica especializada (electrolitos, frutos secos, barritas bio)',
      'Apoyo logístico y de enlace entre cumbres',
      'Equipamiento de apoyo para la marcha',
      'Botiquín de trauma y radios de alta potencia',
      'Fotografía editorial del reto en alta resolución',
      'Insignia / Certificado de cumplimiento de La Triple Corona'
    ],
    noIncluye: [
      'Calzado técnico rígido/semirrígido personal',
      'Comidas fuera del menú de marcha',
      'Transporte privado individual hasta el punto de inicio'
    ],
    equipoRequerido: [
      'Botas o zapatillas de trail running con excelente tracción',
      'Mochila técnica de 20-30L con sistema de hidratación de mínimo 3 litros',
      'Equipamiento de apoyo para los descensos',
      'Cortaviento liviano, polar y camiseta de cambio',
      'Gafas de sol con filtro UV categoría 3 o 4 y gorro legionaria/visera'
    ],
    precioReferencial: '$110.000 CLP / $120 USD por persona',
    precioCLP: 110000,
    precioText: '$110.000 CLP',
    precioUSD: 'US$ 120',
    precioBajada: 'Por persona · 3 cumbres + enlace logístico + ración de marcha + distinción oficial',
    fechasDisponibles: [
      {
        id: 'tc-nov07',
        fecha: 'Sábado 7 Noviembre 2026',
        hora: '06:00 AM',
        cuposDisponibles: 3,
        cuposTotales: 6,
        estado: 'Últimos 3 cupos'
      },
      {
        id: 'tc-nov21',
        fecha: 'Sábado 21 Noviembre 2026',
        hora: '06:00 AM',
        cuposDisponibles: 5,
        cuposTotales: 6,
        estado: 'Cupos abiertos'
      }
    ],
    whatsappMessage: 'Hola Gaz! Quiero postular al Desafío Triple Corona de Santiago.'
  },

  'sierra-de-ramon': {
    slug: 'sierra-de-ramon',
    badge: 'ALTA EXIGENCIA · COTA 3.250M',
    number: '03',
    title: 'Travesía Sierra de Ramón',
    subtitle: 'La travesía alpina reina de la cuenca central. Aristas de roca pura sobre los 3.000 metros de altitud, vistas panorámicas de 360° y autosuficiencia con seguridad WFR.',
    tagline: 'Caminar sobre el filo de la cordillera. 3.250 metros de pura montaña andina.',
    coverImage: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=85',
        caption: 'La arista cimera con vistas abiertas a ambos lados de la cordillera'
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85',
        caption: 'Cumbres nevadas de los Andes centrales desde la cota 3.250m'
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
        caption: 'Travesía técnica entre formaciones de roca volcánica antigua'
      }
    ],
    metrics: {
      altitud: '3.250 msnm (Cumbre Cerro de Ramón)',
      desnivel: '+1.850m D+ de subida continua',
      distancia: '22 km de travesía integral',
      tiempo: '11 a 13 horas de actividad',
      dificultad: 'Muy Exigente / Alta Montaña por el Día',
      ubicacion: 'Parque Natural Quebrada de Macul / San Carlos de Apoquindo',
      temporada: 'Octubre a Mayo (libre de neveros peligrosos)',
      cupoMax: '6 personas (Grupo ultra seleccionado)'
    },
    descripcion: {
      parrafo1: 'La Sierra de Ramón es el muro gigantesco que custodia el oriente de Santiago. Visible desde cualquier esquina de la capital, coronar su cumbre a 3.250 metros es dar el salto definitivo hacia la alta montaña real.',
      parrafo2: 'Esta expedición te sumerge en un ambiente alpino agreste y solitario: pasamos de quebradas con arroyos y vegetación nativa a filos rocosos de gran altitud donde la vegetación desaparece y el viento andino domina el paisaje. Arriba, el aire es diáfano y el horizonte abarca desde el Océano Pacífico (en días despejados) hasta el Glaciar Olivares y el Aconcagua.',
      parrafo3: 'Diseñada bajo protocolos estrictos de autosuficiencia, comunicación satelital inReach y control médico en ruta, esta salida es el examen de grado perfecto para quienes aspiran a cumbres de más de 4.000 y 5.000 metros como El Pintor o El Plomo.'
    },
    dondeEsta: {
      sector: 'Sierra de Ramón, acceso por San Carlos de Apoquindo o Quebrada de Macul.',
      acceso: 'Entrada oficial por parques cordillera con registro de seguridad y guardaparques.',
      puntoEncuentro: 'Estadio San Carlos de Apoquindo o Parque Quebrada de Macul.',
      coordenadas: "33°29'08\"S 70°29'45\"W"
    },
    queVemos: [
      {
        titulo: 'La Panorámica de los Andes Centrales',
        descripcion: 'Vista directa e ininterrumpida a los gigantes de los Andes: Cerro El Plomo (5.424m), Volcán San José (5.856m), Cerro Marmolejo y Cerro Provincia.'
      },
      {
        titulo: 'Transición Ecológica Completa',
        descripcion: 'Caminamos desde el bosque esclerófilo de quebrada hasta la tundra y estepa altoandina, culminando en roca desnuda mineralizada.'
      },
      {
        titulo: 'El Filo Cimero de la Sierra',
        descripcion: 'Caminar durante más de dos horas sobre una cresta de montaña con Santiago a tu derecha y los valles cordilleranos profundos a tu izquierda.'
      },
      {
        titulo: 'Aislamiento y Silencio de Altura',
        descripcion: 'A pesar de estar cerca de la ciudad, la Sierra de Ramón ofrece una desconexión y una escala monumental digna de expediciones remotas.'
      }
    ],
    itinerario: [
      {
        hora: '05:30 AM',
        titulo: 'Encuentro e Inicio de Marcha',
        descripcion: 'Registro en guardaparques, ajuste de bastones e inicio en penumbra a ritmo suave.'
      },
      {
        hora: '08:00 AM',
        titulo: 'Llegada al Alto del Naranjo (1.890m)',
        descripcion: 'Primera pausa técnica bajo el mítico quillay gigante, hidratación y desayuno de marcha.'
      },
      {
        hora: '11:00 AM',
        titulo: 'Portezuelo y Entrada al Filo (2.750m)',
        descripcion: 'Superamos la cota de vegetación. Nos abrigamos y comenzamos la caminata de arista.'
      },
      {
        hora: '01:30 PM',
        titulo: 'Cumbre Cerro de Ramón (3.250m)',
        descripcion: 'Conquista del hito cumbre. Descanso largo, almuerzo de altura, fotos y contemplación.'
      },
      {
        hora: '02:30 PM',
        titulo: 'Inicio del Descenso Técnico',
        descripcion: 'Bajada cuidadosa dosificando articulaciones con técnica guiada de bastones.'
      },
      {
        hora: '06:30 PM',
        titulo: 'Llegada a Base & Check-out de Seguridad',
        descripcion: 'Cierre de bitácora con guardaparques, hidratación de recuperación y regreso.'
      }
    ],
    incluye: [
      'Guía profesional de montaña certificado Wilderness First Responder (WFR)',
      'Dispositivo satelital Garmin inReach con SOS activo y rastreo en tiempo real',
      'Box lunch de alta energía adaptado a requerimientos (vegano/vegetariano disponible)',
      'Tickets y permisos de acceso a parques cordillera',
      'Equipamiento técnico de apoyo',
      'Botiquín de trauma completo y oxímetro de pulso para control de altitud',
      'Registro fotográfico profesional de expedición',
      'Seguro de rescate y accidentes en montaña'
    ],
    noIncluye: [
      'Calzado de caña media o alta con suela Vibram (obligatorio)',
      'Ropa técnica de montaña por capas (primera, segunda y tercera capa)',
      'Mochila técnica de mínimo 30 litros'
    ],
    equipoRequerido: [
      'Botas de montaña con caña media/alta con buen taco',
      'Mínimo 3.5 litros de agua o electrolitos',
      'Chaqueta cortaviento impermeable (Gore-Tex o similar) y polar o pluma térmica',
      'Gorro para el sol, gorro de lana/polar y guantes livianos para el filo',
      'Gafas de sol categoría 3 o 4 (imprescindibles por radiación UV en altura)',
      'Bloqueador solar factor 50+'
    ],
    precioReferencial: '$135.000 CLP / $145 USD por persona',
    precioCLP: 135000,
    precioText: '$135.000 CLP',
    precioUSD: 'US$ 145',
    precioBajada: 'Por persona · Cota 3.250m · Rastreo satelital inReach + box lunch de altura + seguros',
    fechasDisponibles: [
      {
        id: 'sr-nov14',
        fecha: 'Sábado 14 Noviembre 2026',
        hora: '05:30 AM',
        cuposDisponibles: 4,
        cuposTotales: 6,
        estado: 'Cupos abiertos'
      },
      {
        id: 'sr-nov28',
        fecha: 'Sábado 28 Noviembre 2026',
        hora: '05:30 AM',
        cuposDisponibles: 2,
        cuposTotales: 6,
        estado: 'Últimos 2 cupos'
      }
    ],
    whatsappMessage: 'Hola Gaz! Me interesa postular a la Travesía Sierra de Ramón (3.250m).'
  },

  'desbloqueando-santiago': {
    slug: 'desbloqueando-santiago',
    badge: 'PASAPORTE OUTDOOR · 6 SEMANAS',
    number: '04',
    title: 'Desbloqueando Santiago',
    subtitle: 'El programa formativo progresivo de 6 semanas: 1 cerro por semana, desde tu primera cumbre urbana hasta tu consagración en alta montaña con comunidad.',
    tagline: 'Construye resistencia real, aprende orientación en terreno y conquista la capital cima por cima.',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85',
        caption: 'Senderos formativos ideales para ganar condición y técnica'
      },
      {
        url: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1000&q=85',
        caption: 'Atardeceres andinos con vistas panorámicas sobre el valle de Santiago'
      },
      {
        url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=1000&q=85',
        caption: 'Comunidad outdoor unida compartiendo cada nueva cumbre desbloqueada'
      }
    ],
    metrics: {
      altitud: 'Progresiva (desde 1.100m hasta 2.750m)',
      desnivel: 'Desde +250m D+ hasta +1.400m D+',
      distancia: '6 salidas de trekking (1 por semana)',
      tiempo: 'Programa integral de 6 semanas',
      dificultad: 'Progresiva: de Iniciación a Avanzado',
      ubicacion: 'Cordillera de Santiago (6 parques y reservas diferentes)',
      temporada: 'Todo el año (Convocatorias abiertas cada mes)',
      cupoMax: '10 personas por cohorte / generación'
    },
    descripcion: {
      parrafo1: 'Desbloqueando Santiago es la puerta de entrada definitiva a la cultura de montaña. Pensado para profesionales activos que pasan la semana en oficinas o teletrabajo y quieren un plan estructurado, guiado y motivante para ponerse en forma y conquistar la cordillera.',
      parrafo2: 'Cada fin de semana desbloqueamos un nuevo nivel: empezamos con rutas amables de puesta a punto física y aprendizaje de equipo, y avanzamos semana a semana por senderos con mayor desnivel, técnicas de respiración, lectura de terreno y seguridad WFR.',
      parrafo3: 'Al finalizar las 6 semanas, no solo tendrás en tu pasaporte las cumbres más codiciadas de Santiago: habrás ganado una condición cardiovascular superior, amigos con tus mismos intereses y la confianza técnica para salir a la montaña con total autonomía.'
    },
    dondeEsta: {
      sector: 'Cuenca de Santiago: Lo Barnechea, Las Condes, La Reina, Peñalolén y Cajón del Maipo.',
      acceso: 'Puntos de encuentro de fácil acceso en cada comuna con transporte coordinado.',
      puntoEncuentro: 'Varía según la salida semanal (avisado en el grupo privado de WhatsApp).',
      coordenadas: "33°24'00\"S 70°35'00\"W"
    },
    queVemos: [
      {
        titulo: 'Semana 1 a 2: Iniciación y Fundamentos',
        descripcion: 'Cerro Carbón y Manquehuito. Ajuste de mochilas, pisada eficiente, ritmo cardíaco sostenido y vistas panorámicas al atardecer.'
      },
      {
        titulo: 'Semana 3 a 4: Elevación y Técnica',
        descripcion: 'Morro Las Papas a Alto del Naranjo y Cerro Pochoco. Gestión de acarreo, uso de bastones en bajadas empinadas y nutrición de marcha.'
      },
      {
        titulo: 'Semana 5 a 6: Consagración Andina',
        descripcion: 'Cerro Manquehue integral y la gran cumbre del Cerro Provincia (2.750m). Ascenso de día completo y graduación de la cohorte.'
      },
      {
        titulo: 'Comunidad Outdoor y Red',
        descripcion: 'Acceso exclusivo al chat del Círculo Santiago Hiking con salidas espontáneas, descuentos en tiendas aliadas y tercer tiempo.'
      }
    ],
    itinerario: [
      {
        hora: 'Semana 1',
        titulo: 'Nivel 1: Cerro Carbón (1.365m)',
        descripcion: 'Diagnóstico físico, regulación de ritmo y atardecer sobre Vitacura.'
      },
      {
        hora: 'Semana 2',
        titulo: 'Nivel 2: Cerro Manquehuito (1.638m)',
        descripcion: 'Desafío matutino y aprendizaje de técnica de montaña.'
      },
      {
        hora: 'Semana 3',
        titulo: 'Nivel 3: Alto del Naranjo (1.890m)',
        descripcion: 'Ascenso prolongado, gestión de hidratación y vistas al Cajón del Arrayán.'
      },
      {
        hora: 'Semana 4',
        titulo: 'Nivel 4: Cerro Pochoco (1.804m)',
        descripcion: 'Terreno técnico, equilibrio en roca y dosificación muscular.'
      },
      {
        hora: 'Semana 5',
        titulo: 'Nivel 5: Cerro Manquehue Integral (1.635m)',
        descripcion: 'La cumbre reina de la ciudad por su ruta más estética y desafiante.'
      },
      {
        hora: 'Semana 6',
        titulo: 'Nivel 6: Cerro Provincia (2.750m) - Graduación',
        descripcion: 'Expedición de día completo a la alta montaña y celebración de graduación del pasaporte.'
      }
    ],
    incluye: [
      '6 salidas guiadas por Gaz (Guía profesional certificado WFR)',
      'Pasaporte físico oficial "Desbloqueando Santiago" para timbrar cada cumbre',
      'Plan semanal de preparación física complementaria para hacer en casa',
      'Equipamiento de montaña para las salidas',
      'Talleres prácticos en terreno: orientación, armado de mochila, seguridad WFR y no deje rastro',
      'Snacks y ración de marcha en cada salida',
      'Registro fotográfico profesional de cada jornada',
      'Seguro de accidentes durante todas las salidas del programa'
    ],
    noIncluye: [
      'Calzado técnico personal',
      'Traslado personal hasta los puntos de encuentro (fácilmente coordinable en carpool)'
    ],
    equipoRequerido: [
      'Zapatillas de trail running o botas de trekking con buen agarre',
      'Mochila cómoda de 20-25 litros',
      'Botella de agua o camelbak de 2 litros',
      'Ropa deportiva cómoda y chaqueta cortaviento liviana',
      'Gafas de sol y protector solar'
    ],
    precioReferencial: '$180.000 CLP programa completo 6 semanas (Cupos limitados)',
    precioCLP: 180000,
    precioText: '$180.000 CLP',
    precioUSD: 'US$ 195',
    precioBajada: 'Programa completo 6 semanas · 6 cumbres + pasaporte físico + talleres en terreno',
    fechasDisponibles: [
      {
        id: 'ds-oct31',
        fecha: 'Inicio Cohorte Primavera: Sábado 31 Octubre 2026',
        hora: '08:00 AM (Semanal)',
        cuposDisponibles: 4,
        cuposTotales: 10,
        estado: 'Últimos 4 cupos'
      },
      {
        id: 'ds-nov28',
        fecha: 'Inicio Cohorte Verano: Sábado 28 Noviembre 2026',
        hora: '08:00 AM (Semanal)',
        cuposDisponibles: 8,
        cuposTotales: 10,
        estado: 'Inscripciones abiertas'
      }
    ],
    whatsappMessage: 'Hola Gaz! Quiero postular a la próxima cohorte del programa Desbloqueando Santiago (6 semanas).'
  }
};
