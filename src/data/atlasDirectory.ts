export interface AtlasWaypoint {
  photo_url?: string;
  photo_caption?: string;
  video_url?: string;
  technical_notes?: string;
  exposure_rating?: string;
  id: string;
  name: string;
  order: number;
  altitude_m: number;
  km_milestone: number;
  type: 'cumbre' | 'crux_tecnico' | 'refugio_vivac' | 'fuente_agua' | 'mirador_clave' | 'punto_escape';
  danger_level: 'baja' | 'moderada' | 'alta' | 'extrema';
  is_main_attraction?: boolean;
  description: string;
  badge_label?: string;
}

export interface AtlasRouteVariant {
  id: string;
  slug: string;
  name: string;
  trail_type: 'cumbre_directa' | 'variante_tecnica' | 'travesia_cordon' | 'circuito_cerrado';
  trailhead_start_id: string;
  trailhead_end_id: string;
  distance_km: number;
  elevation_gain_m: number;
  elevation_loss_m: number;
  max_altitude_m: number;
  avg_duration_up_hours: number;
  avg_duration_down_hours: number;
  technical_difficulty: 'facil_iniciacion' | 'moderada_trekker' | 'exigente_montana' | 'alta_montana_tecnica';
  physical_exertion: '1/5' | '2/5' | '3/5' | '4/5' | '5/5';
  trail_surface: string;
  water_sources_available: boolean;
  water_sources_detail: string;
  shade_percentage: string;
  escape_routes_info: string;
  description: string;
  crux_highlights: string[];
  gpx_download_slug: string;
  elevation_profile: { km: number; alt: number; label?: string }[];
  waypoints: AtlasWaypoint[];
  glow_color: string;
  commercial_experience?: {
    title: string;
    tagline: string;
    base_price_clp: number;
    price_usd: string;
    pricing_tiers: { pax: string; price_clp: number; label: string }[];
    upcoming_departures: {
      id: string;
      fecha: string;
      hora: string;
      cuposDisponibles: number;
      cuposTotales: number;
      estado: string;
    }[];
  };
}

export interface AtlasTrailhead {
  id: string;
  slug: string;
  name: string;
  address_description: string;
  comuna: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
  parking_type: 'calle_publica' | 'estacionamiento_privado_pago' | 'parque_oficial' | 'sin_estacionamiento';
  parking_fee_clp: number;
  parking_security_tip: string;
  public_transit_info: string;
  operating_hours: string;
  entry_fee_required: boolean;
  entry_fee_clp: number;
}

export interface AtlasEntity {
  id: string;
  slug: string;
  name: string;
  entity_type: 'cumbre' | 'travesia';
  altitude_msnm: number;
  prominence_m: number;
  massif: string;
  comunas: string[];
  latitude: number;
  longitude: number;
  summary: string;
  panoramic_summary: string;
  history_and_cosmovision: string;
  geology_and_nature: string;
  mountaineering_tradition: string;
  cover_image_url: string;
  gallery_urls: string[];
  trailheads: AtlasTrailhead[];
  variants: AtlasRouteVariant[];
}

export const ATLAS_ENTITIES: Record<string, AtlasEntity> = {
  'cerro-carbon': {
    id: 'atlas-cerro-carbon',
    slug: 'cerro-carbon',
    name: 'Cerro Carbón',
    entity_type: 'cumbre',
    altitude_msnm: 1365,
    prominence_m: 140,
    massif: 'Cordón Manquehue & San Cristóbal',
    comunas: ['Vitacura', 'Huechuraba'],
    latitude: -33.3768,
    longitude: -70.5964,
    summary: 'El gran balcón de la precordillera nororiente de Santiago. Conquista una arista de vistas panorámicas 360° sobre el Parque Metropolitano, el valle de Huechuraba y la imponente pared sur del Cerro Manquehue.',
    panoramic_summary: 'Vista abierta a los rascacielos de Sanhattan, el Cerro San Cristóbal, el Cerro Manquehue y los glaciares del Plomo en días despejados.',
    history_and_cosmovision: 'Su nombre proviene de la histórica tala de leña y producción de carbón vegetal durante el siglo XIX para abastecer a la naciente ciudad de Santiago.',
    geology_and_nature: 'Cresta de roca volcánica del cretácico superior. Hábitat del bosque esclerófilo con abundancia de litres, quillayes, espinos y avistamientos de lechuzas y aguiluchos.',
    mountaineering_tradition: 'La clásica escuela de entrenamiento para excursionistas y corredores de montaña de la capital por su cercanía urbana y fuerte pendiente final.',
    cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80'
    ],
    trailheads: [
      {
        id: 'th-piramide',
        slug: 'la-piramide',
        name: 'Acceso Oficial La Pirámide (Saint George)',
        address_description: 'Entrada por Parque Metropolitano sector La Pirámide / Bosque Santiago, Vitacura.',
        comuna: 'Vitacura',
        latitude: -33.3831,
        longitude: -70.6012,
        google_maps_url: 'https://maps.google.com/?q=-33.3831,-70.6012',
        parking_type: 'parque_oficial',
        parking_fee_clp: 0,
        parking_security_tip: 'Estacionamiento oficial Parquemet con control diurno. No dejar objetos de valor visibles en el interior.',
        public_transit_info: 'Micros RED C14 y 502 por Av. Américo Vespucio / La Pirámide a 400 metros de la entrada.',
        operating_hours: '08:30 a 18:30 hrs (Acceso peatonal libre fuera de horario)',
        entry_fee_required: false,
        entry_fee_clp: 0
      }
    ],
    variants: [
      {
        id: 'var-carbon-normal',
        slug: 'ruta-normal-la-piramide',
        name: 'Ruta Normal por La Pirámide',
        trail_type: 'cumbre_directa',
        trailhead_start_id: 'th-piramide',
        trailhead_end_id: 'th-piramide',
        distance_km: 5.2,
        elevation_gain_m: 480,
        elevation_loss_m: 480,
        max_altitude_m: 1365,
        avg_duration_up_hours: 1.8,
        avg_duration_down_hours: 1.1,
        technical_difficulty: 'moderada_trekker',
        physical_exertion: '2/5',
        trail_surface: 'Sendero de tierra compactada con zanjas de erosión y tramo final de arista rocosa firme.',
        water_sources_available: false,
        water_sources_detail: 'Sin vertientes activas en todo el cerro. Cargar mínimo 1.5 a 2 litros de agua desde abajo.',
        shade_percentage: 'Media baja (20%) en la quebrada inicial; expuesta al sol en la arista.',
        escape_routes_info: 'En caso de emergencia, descender por el mismo sendero principal hacia La Pirámide.',
        description: 'La ruta clásica y más frecuentada del Cerro Carbón. Inicia en el bosque esclerófilo de La Pirámide, supera un primer mirador sobre la autopista y remonta la cresta oriente con pendientes moderadas hasta la explanada de la cumbre.',
        crux_highlights: [
          'Mirador La Pirámide (Km 1.2 · Cota 1.100m)',
          'El Pique de Carbón Histórico (Km 2.1)',
          'Arista Cimera Panorámica 360°'
        ],
        gpx_download_slug: 'cerro-carbon-ruta-normal-gpx',
        glow_color: '#f59e0b',
        elevation_profile: [
          { km: 0.0, alt: 885, label: 'Inicio La Pirámide' },
          { km: 1.1, alt: 1040, label: 'Mirador del Valle' },
          { km: 1.8, alt: 1190, label: 'Filo Poniente' },
          { km: 2.6, alt: 1365, label: 'Cumbre Cerro Carbón' },
          { km: 3.8, alt: 1110 },
          { km: 5.2, alt: 885, label: 'Fin La Pirámide' }
        ],
        waypoints: [
          {
            id: 'wp-cb-1',
            name: 'Portón La Pirámide',
            order: 1,
            altitude_m: 885,
            km_milestone: 0.0,
            type: 'punto_escape',
            danger_level: 'baja',
            badge_label: 'ACCESO OFICIAL',
            photo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Entrada oficial por Bosque Santiago en La Pirámide.',
            description: 'Punto de control e inicio con baños públicos y estacionamiento.',
            technical_notes: 'Control diurno y registro de visitantes.',
            exposure_rating: 'E0 (Sendero señalizado)'
          },
          {
            id: 'wp-cb-2',
            name: 'Mirador El Litre',
            order: 2,
            altitude_m: 1120,
            km_milestone: 1.3,
            type: 'mirador_clave',
            danger_level: 'baja',
            badge_label: 'PRIMER MIRADOR',
            photo_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Mirador de descanso con vista directa a la torre Titanium y Costanera Center.',
            description: 'Primera ventana panorámica a Sanhattan y la cuenca de Santiago.',
            technical_notes: 'Sombra de litres nativos. Zona recomendada para regular pulsaciones.',
            exposure_rating: 'E0 (Mirador con baranda)'
          },
          {
            id: 'wp-cb-3',
            name: 'Cumbre Cerro Carbón',
            order: 3,
            altitude_m: 1365,
            km_milestone: 2.6,
            type: 'cumbre',
            danger_level: 'moderada',
            is_main_attraction: true,
            badge_label: 'CUMBRE 1.365M',
            photo_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Plataforma cumbrera con vista de 360 grados al Cerro Manquehue y valle central.',
            video_url: '/contenido/hiking-manquehue.mp4',
            description: 'Explanada cumbrera con vista privilegiada a la cara sur del Manquehue.',
            technical_notes: 'Viento fuerte en la tarde. Llevar cortavientos para la cumbre.',
            exposure_rating: 'E1 (Cumbre amplia)'
          }
        ],
        commercial_experience: {
          title: 'Trekking Sunset & Atardecer Cerro Carbón',
          tagline: 'Sube con la luz dorada de la tarde y contempla el encendido de Santiago desde la arista.',
          base_price_clp: 28000,
          price_usd: 'US$ 30',
          pricing_tiers: [
            { pax: '1 Persona (Privado)', price_clp: 85000, label: 'Servicio 100% exclusivo' },
            { pax: '2 Personas (Dúo)', price_clp: 45000, label: '$45.000 por persona' },
            { pax: '3+ Personas (Grupo)', price_clp: 28000, label: '$28.000 por persona' }
          ],
          upcoming_departures: [
            { id: 'dep-cb-1', fecha: 'Viernes 24 de Octubre', hora: '17:30 hrs', cuposDisponibles: 2, cuposTotales: 8, estado: 'Últimos 2 cupos' },
            { id: 'dep-cb-2', fecha: 'Sábado 25 de Octubre', hora: '17:30 hrs', cuposDisponibles: 4, cuposTotales: 8, estado: 'Cupos abiertos' },
            { id: 'dep-cb-3', fecha: 'Viernes 31 de Octubre', hora: '17:30 hrs', cuposDisponibles: 6, cuposTotales: 8, estado: 'Cupos abiertos' }
          ]
        }
      }
    ]
  },

  'sierra-de-ramon': {
    id: 'atlas-sierra-de-ramon',
    slug: 'sierra-de-ramon',
    name: 'Travesía Integral Sierra de Ramón',
    entity_type: 'travesia',
    altitude_msnm: 3253,
    prominence_m: 1240,
    massif: 'Sierra de Ramón & Precordillera Oriente',
    comunas: ['Lo Barnechea', 'Las Condes', 'La Reina', 'Peñalolén', 'La Florida'],
    latitude: -33.4833,
    longitude: -70.4667,
    summary: 'La travesía de arista más legendaria de la cuenca de Santiago. Un filo aéreo de 24 kilómetros que encadena 7 hitos cumbreros y cruza el temido Filo de la Muerte a más de 3.100 metros de altitud.',
    panoramic_summary: 'Perspectiva aérea de toda la ciudad de Santiago a un lado, y los gigantes andinos (El Plomo, Tupungato, Marmolejo y glaciares centrales) al otro lado.',
    history_and_cosmovision: 'Ruta ceremonial y de observación astronómica incaica. Histórico cordón de arrieros andinos y escenario de las mayores gestas del montañismo capitalino.',
    geology_and_nature: 'Cresta precordillerana formada por rocas sedimentarias y volcánicas fuertemente plegadas. Hábitat de cóndores andinos, vizcachas de altura y vegetación altoandina adaptada al hielo.',
    mountaineering_tradition: 'La prueba definitiva de resistencia y temple psicológico en la Región Metropolitana. Su crux máximo en el Filo de la Muerte exige nervios de acero.',
    cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    trailheads: [
      {
        id: 'th-nilhue',
        slug: 'puente-nilhue',
        name: 'Acceso Norte: Puente Ñilhue (Lo Barnechea)',
        address_description: 'Camino a Farellones km 5, sector curva de Puente Ñilhue, Lo Barnechea.',
        comuna: 'Lo Barnechea',
        latitude: -33.3644,
        longitude: -70.4789,
        google_maps_url: 'https://maps.google.com/?q=-33.3644,-70.4789',
        parking_type: 'parque_oficial',
        parking_fee_clp: 3000,
        parking_security_tip: 'Estacionamiento con control de guardaparques diurno de la Asociación Parques Cordillera.',
        public_transit_info: 'Micro C01 hasta plaza San Enrique, luego taxi o colectivo hacia Farellones km 5.',
        operating_hours: '07:00 a 19:00 hrs (Registro obligatorio con guardaparques)',
        entry_fee_required: true,
        entry_fee_clp: 3000
      },
      {
        id: 'th-panul',
        slug: 'el-panul-la-florida',
        name: 'Salida Sur: Bosque Panul / Rojas Magallanes (La Florida)',
        address_description: 'Final de Av. Rojas Magallanes, sector precordillera El Panul, La Florida.',
        comuna: 'La Florida',
        latitude: -33.5512,
        longitude: -70.5218,
        google_maps_url: 'https://maps.google.com/?q=-33.5512,-70.5218',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Punto de término de la travesía. Se recomienda salir en Uber o taxi hacia Metro Rojas Magallanes (L4).',
        public_transit_info: 'Colectivos y micro E03/E07 bajan directo a estación de Metro Rojas Magallanes (Línea 4).',
        operating_hours: 'Acceso público libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0
      }
    ],
    variants: [
      {
        id: 'var-sierra-ramon-integral',
        slug: 'travesia-integral-7-hitos',
        name: 'Travesía Integral de Arista: Los 7 Hitos & Filo de la Muerte',
        trail_type: 'travesia_cordon',
        trailhead_start_id: 'th-nilhue',
        trailhead_end_id: 'th-panul',
        distance_km: 24.2,
        elevation_gain_m: 2280,
        elevation_loss_m: 2350,
        max_altitude_m: 3253,
        avg_duration_up_hours: 8.5,
        avg_duration_down_hours: 5.5,
        technical_difficulty: 'alta_montana_tecnica',
        physical_exertion: '5/5',
        trail_surface: 'Aristas afiladas, pasos de gateo en roca grado II, canchales de acarreo suelto y descensos técnicos muy pronunciados.',
        water_sources_available: false,
        water_sources_detail: 'CRÍTICO: No existe agua en toda la línea de cumbre. Es obligatorio cargar 4 a 5 litros de agua por persona desde el inicio.',
        shade_percentage: 'Cero (0%). Completamente expuesta a vientos cordilleranos intensos y radiación UV extrema.',
        escape_routes_info: 'Vías de escape de emergencia: 1) Descenso desde el Refugio Provincia hacia San Carlos de Apoquindo. 2) Bajada por la Arista de La Reina hacia Parque Mahuida antes de entrar al Filo de la Muerte. Una vez en el Filo de la Muerte, no hay escape.',
        description: 'La máxima aventura de resistencia de Santiago. Inicia en Puente Ñilhue, sube al Cerro Provincia, recorre toda la cresta hasta el techo del San Ramón (3.253m), cruza el abismal Filo de la Muerte hacia Punta de Damas, y corona Tarapacá y Las Minillas para descender finalmente a La Florida.',
        crux_highlights: [
          'Hito 1: Cerro Provincia (2.750m) & Refugio Domo',
          'Hito 2: Morro del Tambor (2.890m)',
          'Hito 3: Cerro San Ramón (3.253m - Cota Máxima)',
          'Hito 4: 🔥 EL FILO DE LA MUERTE (Crux Aéreo Expuesto entre San Ramón y Damas)',
          'Hito 5: Punta de Damas (3.149m)',
          'Hito 6: Morro Tarapacá (2.920m)',
          'Hito 7: Morro Las Minillas (2.467m) con bajada a El Panul'
        ],
        gpx_download_slug: 'travesia-integral-sierra-de-ramon-7-hitos-gpx',
        glow_color: '#f59e0b',
        elevation_profile: [
          { km: 0.0, alt: 1020, label: 'Inicio Puente Ñilhue' },
          { km: 4.5, alt: 1890, label: 'Alto del Naranjo (Descanso)' },
          { km: 7.2, alt: 2750, label: '1. Cerro Provincia' },
          { km: 11.5, alt: 2890, label: '2. Morro del Tambor' },
          { km: 15.8, alt: 3253, label: '3. Cerro San Ramón' },
          { km: 17.2, alt: 3120, label: '4. 🔥 FILO DE LA MUERTE' },
          { km: 18.2, alt: 3149, label: '5. Punta de Damas' },
          { km: 20.4, alt: 2920, label: '6. Morro Tarapacá' },
          { km: 22.8, alt: 2467, label: '7. Morro Las Minillas' },
          { km: 24.2, alt: 980, label: 'Fin El Panul (La Florida)' }
        ],
        waypoints: [
          {
            id: 'wp-sr-0',
            name: '0. Inicio: Puente Ñilhue',
            order: 0,
            altitude_m: 1020,
            km_milestone: 0.0,
            type: 'punto_escape',
            danger_level: 'baja',
            badge_label: 'CONTROL & PARTIDA',
            photo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Entrada oficial por Camino a Farellones km 5 con control de guardaparques.',
            description: 'Punto de partida con registro obligatorio. Último punto con agua potable y señal celular.',
            technical_notes: 'Cargar 5 litros de agua mínimos por persona antes de comenzar la marcha.',
            exposure_rating: 'E0 (Sendero señalizado)'
          },
          {
            id: 'wp-sr-tree',
            name: 'Aproximación: Alto del Naranjo',
            order: 0.5,
            altitude_m: 1890,
            km_milestone: 4.5,
            type: 'mirador_clave',
            danger_level: 'baja',
            badge_label: 'PUNTO DE DESCANSO',
            photo_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'El legendario árbol solitario de Alto del Naranjo con vista al glaciar El Plomo.',
            description: 'Meseta de descanso bajo el quillay legendario. Cruce clave de hidratación antes del ataque a la arista.',
            technical_notes: 'Punto de no retorno térmico: si el viento supera 50 km/h aquí, abortar cumbre.',
            exposure_rating: 'E1 (Sin exposición)'
          },
          {
            id: 'wp-sr-1',
            name: '1. Cerro Provincia',
            order: 1,
            altitude_m: 2750,
            km_milestone: 7.2,
            type: 'cumbre',
            danger_level: 'moderada',
            badge_label: 'HITO 1 · REFUGIO DOMO',
            photo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Emblemático domo geodésico de madera en la cumbre del Provincia frente a Santiago.',
            video_url: '/contenido/img_8505.mp4',
            description: 'Primera cumbre mayor conquistada y sitio del emblemático Refugio Domo de montaña.',
            technical_notes: 'Refugio de emergencia con capacidad para 6 personas. Sin agua.',
            exposure_rating: 'E2 (Acarreo empinado)'
          },
          {
            id: 'wp-sr-2',
            name: '2. Morro del Tambor',
            order: 2,
            altitude_m: 2890,
            km_milestone: 11.5,
            type: 'cumbre',
            danger_level: 'moderada',
            badge_label: 'HITO 2 · ARISTA CENTRAL',
            photo_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Espolón rocoso de alta montaña que conecta Provincia con el macizo de San Ramón.',
            description: 'Prominencia ventosa que marca el ecuador de la travesía hacia el macizo mayor.',
            technical_notes: 'Vientos constantes del oeste. Mantenerse rigurosamente por el lomo de la cresta.',
            exposure_rating: 'E2 (Arista rocosa ventosa)'
          },
          {
            id: 'wp-sr-3',
            name: '3. Cerro San Ramón',
            order: 3,
            altitude_m: 3253,
            km_milestone: 15.8,
            type: 'cumbre',
            danger_level: 'alta',
            badge_label: 'HITO 3 · TECHO MÁXIMO (3.253M)',
            photo_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Cruz cumbrera del Cerro San Ramón a 3.253 metros sobre el nivel del mar.',
            video_url: '/contenido/img_6160.mp4',
            description: 'La máxima cota del cordón. Vista panorámica al Tupungato, Glaciar El Plomo y Santiago.',
            technical_notes: 'Zona de bajas temperaturas incluso en verano (-5°C con sensación de -12°C con viento).',
            exposure_rating: 'E3 (Alta montaña expuesta)'
          },
          {
            id: 'wp-sr-4',
            name: '4. 🔥 EL FILO DE LA MUERTE',
            order: 4,
            altitude_m: 3120,
            km_milestone: 17.2,
            type: 'crux_tecnico',
            danger_level: 'extrema',
            is_main_attraction: true,
            badge_label: 'HITO 4 · CRUX SUPREMO',
            photo_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Cuchilla de roca expuesta con precipicios de más de 800 metros verticales hacia ambos valles.',
            video_url: '/contenido/img_8505.mp4',
            description: 'La arista aérea más temida de la precordillera. Caídas verticales hacia Quebrada de Macul y el Cajón del Maipo. Nervios de acero obligatorios.',
            technical_notes: 'PASO CRÍTICO: Gateo en roca grado II con viento cruzado. Prohibido transitar con ráfagas > 40 km/h o presencia de hielo/nieve sin crampones.',
            exposure_rating: 'E4 (Caída vertical fatal - Sin margen de error)'
          },
          {
            id: 'wp-sr-5',
            name: '5. Punta de Damas',
            order: 5,
            altitude_m: 3149,
            km_milestone: 18.2,
            type: 'cumbre',
            danger_level: 'alta',
            badge_label: 'HITO 5 · BALCÓN SUR',
            photo_url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Punta rocosa solitaria y escarpada tras superar el Filo de la Muerte.',
            description: 'Gran hito rocoso posterior al Filo de la Muerte. Marca el inicio del cordón sur hacia La Florida.',
            technical_notes: 'Terreno muy descompuesto. Cuidado extremo con desprendimiento de rocas hacia cordadas inferiores.',
            exposure_rating: 'E3 (Acarreo suelto y pendiente)'
          },
          {
            id: 'wp-sr-6',
            name: '6. Morro Tarapacá',
            order: 6,
            altitude_m: 2920,
            km_milestone: 20.4,
            type: 'cumbre',
            danger_level: 'moderada',
            badge_label: 'HITO 6 · DESCOMPRESIÓN',
            photo_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Arista descendente con vistas directas a la zona suroriente de Santiago.',
            description: 'Último cordón de alta cota antes del brusco descenso final a los valles precordilleranos.',
            technical_notes: 'Señal celular intermitente (Entel/Wom). Buen punto para reporte de seguridad.',
            exposure_rating: 'E2 (Arista ancha)'
          },
          {
            id: 'wp-sr-7',
            name: '7. Morro Las Minillas',
            order: 7,
            altitude_m: 2467,
            km_milestone: 22.8,
            type: 'cumbre',
            danger_level: 'moderada',
            badge_label: 'HITO 7 · ÚLTIMA CUMBRE',
            photo_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Última cima del cordón antes de la vertical bajada por el filo de Rojas Magallanes.',
            description: 'Séptimo hito de la travesía. Desde aquí inicia el extenuante descenso de 1.500m hacia el Bosque Panul.',
            technical_notes: 'Bajada muy empinada sobre tierra suelta y piedras rodantes. Bastones de trekking indispensables.',
            exposure_rating: 'E2 (Descenso de acarreo pronunciado)'
          },
          {
            id: 'wp-sr-8',
            name: 'Terminus: Bosque Panul (La Florida)',
            order: 8,
            altitude_m: 980,
            km_milestone: 24.2,
            type: 'punto_escape',
            danger_level: 'baja',
            badge_label: 'META DE EXPEDICIÓN',
            photo_url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
            photo_caption: 'Llegada triunfal al bosque nativo esclerófilo de El Panul en La Florida.',
            description: 'Fin de la travesía integral. Salida a zona urbana con transporte público y colectivos.',
            technical_notes: 'Punto final. Celebración y cierre de logística con el equipo.',
            exposure_rating: 'E0 (Sendero urbano)'
          }
        ],
        commercial_experience: {
          title: 'Expedición Travesía Sierra de Ramón 2D / 1N (Filo de la Muerte)',
          tagline: 'Cruza la corona de los Andes centrales con campamento de altura y liderazgo de cordada.',
          base_price_clp: 165000,
          price_usd: 'US$ 175',
          pricing_tiers: [
            { pax: '1 Persona (Privado VIP)', price_clp: 380000, label: 'Guía de montaña exclusivo + porteo' },
            { pax: '2 Personas (Dúo)', price_clp: 220000, label: '$220.000 por persona' },
            { pax: '3 a 6 Personas (Grupo)', price_clp: 165000, label: '$165.000 por persona' }
          ],
          upcoming_departures: [
            { id: 'dep-sr-1', fecha: 'Sábado 15 y Domingo 16 de Noviembre', hora: '06:00 AM', cuposDisponibles: 3, cuposTotales: 6, estado: 'Últimos 3 cupos' },
            { id: 'dep-sr-2', fecha: 'Sábado 29 y Domingo 30 de Noviembre', hora: '06:00 AM', cuposDisponibles: 4, cuposTotales: 6, estado: 'Cupos abiertos' }
          ]
        }
      }
    ]
  }
};
