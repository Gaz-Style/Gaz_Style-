export interface PeakRoute {
  id: string;
  variant_name: string;
  slug: string;
  trailhead_name: string;
  distance_km: number;
  elevation_gain_m: number;
  avg_duration_up_hours: number;
  avg_duration_down_hours: number;
  technical_difficulty: 'facil_familiar' | 'moderada' | 'exigente' | 'alta_montana';
  physical_exertion: '1/5' | '2/5' | '3/5' | '4/5' | '5/5';
  trail_surface: string;
  water_available: boolean;
  shade_percentage: string;
  family_friendly: boolean;
  pet_friendly: boolean;
  best_time_of_day: string;
  description: string;
  highlights: string[];
  required_equipment: string[];
  elevation_profile: { km: number; alt: number; label?: string }[];
  is_guided_by_santiago_hiking: boolean;
  commercial_price_clp: number;
}

export interface PeakTrailhead {
  id: string;
  name: string;
  slug: string;
  address_description: string;
  latitude: number;
  longitude: number;
  google_maps_link: string;
  parking_type: 'calle_publica' | 'estacionamiento_privado_pago' | 'sin_estacionamiento' | 'parque_oficial';
  parking_fee_clp: number;
  parking_security_tip: string;
  public_transit_info: string;
  operating_hours: string;
  entry_fee_required: boolean;
  entry_fee_clp: number;
  routes: PeakRoute[];
}

export interface Peak {
  id: string;
  slug: string;
  name: string;
  altitude_msnm: number;
  prominence_m: number;
  massif: string;
  comunas: string[];
  latitude: number;
  longitude: number;
  summary: string;
  panoramic_summary: string;
  cover_image_url: string;
  gallery_urls: string[];
  is_popular_sunset: boolean;
  featured: boolean;
  trailheads: PeakTrailhead[];
}

export const PEAKS_DIRECTORY: Peak[] = [
  {
    id: 'peak-manquehuito',
    slug: 'cerro-manquehuito',
    name: 'Cerro Manquehuito',
    altitude_msnm: 1767,
    prominence_m: 210,
    massif: 'Cordón Manquehue',
    comunas: ['Vitacura', 'Lo Barnechea', 'Huechuraba'],
    latitude: -33.3639,
    longitude: -70.5702,
    summary: 'La cumbre más accesible y popular del sector oriente para iniciarse en el trekking y disfrutar de atardeceres mágicos con la famosa cruz cumbrera.',
    panoramic_summary: 'Vista panorámica privilegiada de la cuenca de Santiago hacia el sur, el imponente Cerro Manquehue hacia el poniente y la precordillera hacia Farellones.',
    cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    is_popular_sunset: true,
    featured: true,
    trailheads: [
      {
        id: 'th-manquehuito-via-roja',
        name: 'Acceso Vía Roja (Lo Curro)',
        slug: 'via-roja',
        address_description: 'Final de calle Vía Roja, Lo Curro, Vitacura.',
        latitude: -33.3685,
        longitude: -70.5772,
        google_maps_link: 'https://maps.google.com/?q=-33.3685,-70.5772',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Estacionar en la curva final de Vía Roja. No dejar bolsos ni objetos de valor visibles en el interior.',
        public_transit_info: 'Micro C14 desde Metro Manquehue (L1) hasta rotonda Lo Curro, luego caminar o Uber hasta el final de Vía Roja.',
        operating_hours: 'Acceso libre y público 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-manquehuito-normal',
            variant_name: 'Ruta Clásica por el Portezuelo',
            slug: 'normal-via-roja',
            trailhead_name: 'Acceso Vía Roja',
            distance_km: 3.4,
            elevation_gain_m: 410,
            avg_duration_up_hours: 1.25,
            avg_duration_down_hours: 0.75,
            technical_difficulty: 'facil_familiar',
            physical_exertion: '2/5',
            trail_surface: 'Tierra compacta con piedras sueltas en el tramo final',
            water_available: false,
            shade_percentage: 'Baja (15%)',
            family_friendly: true,
            pet_friendly: true,
            best_time_of_day: 'Atardecer (Sunset)',
            description: 'El sendero clásico y más transitado. Sube gradualmente desde Vía Roja hasta el portezuelo que divide el Manquehue del Manquehuito, y luego gira al oriente por un filo cómodo hasta la cruz.',
            highlights: ['Ideal para primerizos', 'Apto para ir con perros', 'Atardeceres dorados espectaculares', 'Bajada nocturna fácil con frontal'],
            required_equipment: ['Zapatillas con buen agarre (no zapatillas lisas)', '1.5 litros de agua por persona', 'Cortaviento ligero para la cumbre', 'Linterna frontal si subes después de las 17:00'],
            elevation_profile: [
              { km: 0.0, alt: 1357, label: 'Inicio Vía Roja' },
              { km: 0.9, alt: 1490, label: 'Bosque Esclerófilo' },
              { km: 1.8, alt: 1610, label: 'Portezuelo Manquehue' },
              { km: 2.6, alt: 1690, label: 'Filo Cumbrero' },
              { km: 3.4, alt: 1767, label: 'Cumbre & Cruz' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 25000
          }
        ]
      },
      {
        id: 'th-manquehuito-los-trapenses',
        name: 'Acceso El Tranque (Los Trapenses)',
        slug: 'los-trapenses',
        address_description: 'Avenida El Tranque con Camino El Huinganal, Lo Barnechea.',
        latitude: -33.3521,
        longitude: -70.5594,
        google_maps_link: 'https://maps.google.com/?q=-33.3521,-70.5594',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Estacionar en calle El Tranque en zonas residenciales señalizadas.',
        public_transit_info: 'Micro C10 o C17 hasta El Tranque.',
        operating_hours: 'Acceso libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-manquehuito-el-tranque',
            variant_name: 'Ruta El Tranque (Cara Nororiente)',
            slug: 'el-tranque',
            trailhead_name: 'Acceso El Tranque',
            distance_km: 4.2,
            elevation_gain_m: 480,
            avg_duration_up_hours: 1.5,
            avg_duration_down_hours: 1.0,
            technical_difficulty: 'moderada',
            physical_exertion: '3/5',
            trail_surface: 'Sendero de tierra con mayor pendiente inicial y vegetación nativa',
            water_available: false,
            shade_percentage: 'Media (25%)',
            family_friendly: true,
            pet_friendly: true,
            best_time_of_day: 'Mañana o Atardecer',
            description: 'Alternativa mucho más tranquila y con menos gente que Vía Roja. Asciende desde Lo Barnechea por laderas con más vegetación y conecta directamente con el filo cumbrero.',
            highlights: ['Menos concurrido que Vía Roja', 'Vistas directas a la cordillera nevada', 'Excelente avistamiento de aves y flora'],
            required_equipment: ['Zapatillas de trail running o trekking', 'Bastones de trekking recomendados', '2 litros de agua', 'Protección solar'],
            elevation_profile: [
              { km: 0.0, alt: 1287, label: 'Inicio El Tranque' },
              { km: 1.2, alt: 1420, label: 'Quebrada Los Trapenses' },
              { km: 2.8, alt: 1630, label: 'Arista Nororiente' },
              { km: 4.2, alt: 1767, label: 'Cumbre Manquehuito' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 25000
          }
        ]
      }
    ]
  },
  {
    id: 'peak-manquehue',
    slug: 'cerro-manquehue',
    name: 'Cerro Manquehue',
    altitude_msnm: 2042,
    prominence_m: 540,
    massif: 'Cordón Manquehue',
    comunas: ['Vitacura', 'Lo Barnechea', 'Huechuraba'],
    latitude: -33.3647,
    longitude: -70.5894,
    summary: 'El guardián rocoso y emblemático de Santiago. La mayor cumbre del valle urbano con su característica forma cónica y un exigente acarreo final.',
    panoramic_summary: 'Una de las mejores vistas 360° de la capital: toda la ciudad a tus pies, el valle de Chicureo al norte y los colosos cordilleranos (Plomo, Pintor) al oriente.',
    cover_image_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    is_popular_sunset: true,
    featured: true,
    trailheads: [
      {
        id: 'th-manquehue-via-roja',
        name: 'Acceso Vía Roja (Lo Curro)',
        slug: 'via-roja',
        address_description: 'Final de calle Vía Roja, Vitacura.',
        latitude: -33.3685,
        longitude: -70.5772,
        google_maps_link: 'https://maps.google.com/?q=-33.3685,-70.5772',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Sector con patrullaje de seguridad municipal Vitacura.',
        public_transit_info: 'Micro C14 desde Metro Manquehue.',
        operating_hours: 'Acceso libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-manquehue-normal',
            variant_name: 'Ruta Normal por el Portezuelo',
            slug: 'normal-via-roja',
            trailhead_name: 'Acceso Vía Roja',
            distance_km: 4.8,
            elevation_gain_m: 680,
            avg_duration_up_hours: 2.25,
            avg_duration_down_hours: 1.5,
            technical_difficulty: 'moderada',
            physical_exertion: '3/5',
            trail_surface: 'Pendiente pronunciada con acarreo de piedras y trepe simple en roca',
            water_available: false,
            shade_percentage: 'Baja (10%)',
            family_friendly: false,
            pet_friendly: false,
            best_time_of_day: 'Mañana temprano o Atardecer',
            description: 'La ruta reina del Manquehue. Tras llegar al portezuelo, encara la empinada arista este con sectores de tierra suelta y pequeñas pasadas de roca donde se usan las manos antes de la meseta cumbrera.',
            highlights: ['Desafío deportivo clásico', 'Excelente preparación para alta montaña', 'Puesta de sol cinematográfica sobre el mar de smog/nubes'],
            required_equipment: ['Calzado de montaña con buen dibujo', '2L de agua mínimo', 'Guantes de trekking opcionales para la roca', 'Frontal potente para descenso nocturno'],
            elevation_profile: [
              { km: 0.0, alt: 1357, label: 'Inicio Vía Roja' },
              { km: 1.4, alt: 1610, label: 'Portezuelo' },
              { km: 2.6, alt: 1820, label: 'El Acarreo' },
              { km: 3.8, alt: 1960, label: 'Paso de Roca' },
              { km: 4.8, alt: 2042, label: 'Cumbre Manquehue' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 35000
          }
        ]
      },
      {
        id: 'th-manquehue-agua-del-palo',
        name: 'Acceso Agua del Palo (Santa María de Manquehue)',
        slug: 'agua-del-palo',
        address_description: 'Calle Bosques de Montemar con Agua del Palo, Vitacura.',
        latitude: -33.3768,
        longitude: -70.5961,
        google_maps_link: 'https://maps.google.com/?q=-33.3768,-70.5961',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Barrio residencial tranquilo con cámaras de seguridad.',
        public_transit_info: 'C03 o C07 hasta Avenida Santa María.',
        operating_hours: 'Acceso libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-manquehue-agua-del-palo',
            variant_name: 'Ruta Sur por Agua del Palo',
            slug: 'agua-del-palo',
            trailhead_name: 'Acceso Agua del Palo',
            distance_km: 5.4,
            elevation_gain_m: 750,
            avg_duration_up_hours: 2.75,
            avg_duration_down_hours: 1.75,
            technical_difficulty: 'exigente',
            physical_exertion: '4/5',
            trail_surface: 'Fuerte desnivel continuo con rocas y acarreos',
            water_available: false,
            shade_percentage: 'Baja (10%)',
            family_friendly: false,
            pet_friendly: false,
            best_time_of_day: 'Mañana',
            description: 'Una de las variantes más empinadas y directas. Sube por la cara sur expuesta a la ciudad, exigiendo mayor resistencia física y concentración en el descenso.',
            highlights: ['Menos concurrido que Vía Roja', 'Gran entrenamiento de desnivel', 'Vistas verticales sobre Vitacura'],
            required_equipment: ['Botas o zapatillas técnicas de montaña', 'Bastones de trekking indispensables', '2.5L de agua', 'Cortaviento'],
            elevation_profile: [
              { km: 0.0, alt: 1290, label: 'Inicio Agua del Palo' },
              { km: 1.8, alt: 1540, label: 'Arista Sur' },
              { km: 3.5, alt: 1810, label: 'Placas Rocosas' },
              { km: 5.4, alt: 2042, label: 'Cumbre Manquehue' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 35000
          }
        ]
      }
    ]
  },
  {
    id: 'peak-carbon',
    slug: 'cerro-carbon',
    name: 'Cerro Carbón',
    altitude_msnm: 1365,
    prominence_m: 120,
    massif: 'Cordón Manquehue',
    comunas: ['Huechuraba', 'Vitacura'],
    latitude: -33.3772,
    longitude: -70.6152,
    summary: 'El mirador urbano por excelencia para entrenar rápido por la tarde. Cuenta con estaciones de descanso señalizadas y miradores panorámicos de Santiago poniente.',
    panoramic_summary: 'Vista abierta a la Costanera Norte, el Parque Metropolitano (San Cristóbal), el distrito financiero Sanhattan y la puesta de sol.',
    cover_image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [],
    is_popular_sunset: true,
    featured: true,
    trailheads: [
      {
        id: 'th-carbon-la-piramide',
        name: 'Acceso La Pirámide (Saint George)',
        slug: 'la-piramide',
        address_description: 'Costado del Colegio Saint George, Avenida La Pirámide, Vitacura.',
        latitude: -33.3854,
        longitude: -70.6121,
        google_maps_link: 'https://maps.google.com/?q=-33.3854,-70.6121',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Estacionar en la calle lateral habilitada para deportistas.',
        public_transit_info: 'Micros que transitan por Américo Vespucio Norte / La Pirámide.',
        operating_hours: 'Acceso libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-carbon-normal',
            variant_name: 'Sendero Principal La Pirámide',
            slug: 'normal-la-piramide',
            trailhead_name: 'Acceso La Pirámide',
            distance_km: 4.0,
            elevation_gain_m: 430,
            avg_duration_up_hours: 1.25,
            avg_duration_down_hours: 0.8,
            technical_difficulty: 'facil_familiar',
            physical_exertion: '2/5',
            trail_surface: 'Sendero amplio y bien marcado con miradores de madera',
            water_available: false,
            shade_percentage: 'Media (25%)',
            family_friendly: true,
            pet_friendly: true,
            best_time_of_day: 'Atardecer (Sunset)',
            description: 'El sendero más amigable del cordón Manquehue. Conecta miradores escalonados (Mirador La Pirámide, Litre, Espino) hasta el monolito cumbrero con vistas directas al atardecer.',
            highlights: ['Ruta muy segura y concurrida', 'Excelente para trail running vespertino', 'Miradores de madera para descansar'],
            required_equipment: ['Zapatillas deportivas con agarre', '1.5L de agua', 'Linterna frontal si bajas después del ocaso'],
            elevation_profile: [
              { km: 0.0, alt: 935, label: 'Inicio La Pirámide' },
              { km: 1.1, alt: 1070, label: 'Mirador El Litre' },
              { km: 2.3, alt: 1220, label: 'Mirador El Espino' },
              { km: 4.0, alt: 1365, label: 'Cumbre Cerro Carbón' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 20000
          }
        ]
      }
    ]
  },
  {
    id: 'peak-pochoco',
    slug: 'cerro-pochoco',
    name: 'Cerro Pochoco',
    altitude_msnm: 1804,
    prominence_m: 350,
    massif: 'Precordillera Central (Arrayán)',
    comunas: ['Lo Barnechea'],
    latitude: -33.3524,
    longitude: -70.4721,
    summary: 'El clásico "gimnasio" natural de los montañistas de Santiago. Famoso por su pendiente ininterrumpida y su terreno resbaloso de tierra suelta.',
    panoramic_summary: 'Vista frontal a la imponente Sierra de Ramón (Provincia, San Ramón), el Cerro Plomo a lo lejos y el cañón del río Mapocho.',
    cover_image_url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [],
    is_popular_sunset: false,
    featured: true,
    trailheads: [
      {
        id: 'th-pochoco-achaya',
        name: 'Acceso Observatorio Achaya (El Arrayán)',
        slug: 'observatorio-achaya',
        address_description: 'Camino El Alto, final de calle El Arrayán, Lo Barnechea.',
        latitude: -33.3592,
        longitude: -70.4795,
        google_maps_link: 'https://maps.google.com/?q=-33.3592,-70.4795',
        parking_type: 'calle_publica',
        parking_fee_clp: 0,
        parking_security_tip: 'Estacionar en la berma exterior antes del portón del Observatorio.',
        public_transit_info: 'Micro C01 o C01c hasta Plaza San Enrique, luego colectivo El Arrayán.',
        operating_hours: 'Acceso libre 24/7',
        entry_fee_required: false,
        entry_fee_clp: 0,
        routes: [
          {
            id: 'route-pochoco-normal',
            variant_name: 'Ruta Normal del Observatorio',
            slug: 'normal-observatorio',
            trailhead_name: 'Acceso Observatorio Achaya',
            distance_km: 4.6,
            elevation_gain_m: 800,
            avg_duration_up_hours: 2.5,
            avg_duration_down_hours: 1.5,
            technical_difficulty: 'exigente',
            physical_exertion: '4/5',
            trail_surface: 'Tierra extremadamente suelta (polvo resbaloso) y rocas pulidas',
            water_available: false,
            shade_percentage: 'Muy baja (5%)',
            family_friendly: false,
            pet_friendly: false,
            best_time_of_day: 'Mañana temprano (evitar calor)',
            description: 'Ruta de fuerte exigencia física con pendiente empinada continua desde el minuto uno. No da tregua hasta la cumbre, pero premia con una panorámica cordillerana inolvidable.',
            highlights: ['Entrenamiento de alta exigencia física', 'No apto para novatos sin bastones', 'Ambiente montañero puro'],
            required_equipment: ['Bastones de trekking OBLIGATORIOS para la bajada', 'Zapatillas de montaña con suela gruesa Vibram', '2.5L de agua', 'Snacks energéticos'],
            elevation_profile: [
              { km: 0.0, alt: 1004, label: 'Observatorio Achaya' },
              { km: 1.3, alt: 1280, label: 'Primera Torreta' },
              { km: 2.9, alt: 1540, label: 'Acarreo de Piedras' },
              { km: 4.6, alt: 1804, label: 'Cumbre Pochoco' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 35000
          }
        ]
      }
    ]
  },
  {
    id: 'peak-provincia',
    slug: 'cerro-provincia',
    name: 'Cerro Provincia',
    altitude_msnm: 2750,
    prominence_m: 980,
    massif: 'Sierra de Ramón',
    comunas: ['Las Condes', 'Lo Barnechea', 'La Reina'],
    latitude: -33.4358,
    longitude: -70.4578,
    summary: 'El rey de la precordillera santiaguina. Una cumbre de verdad con casi 2.000 metros de desnivel acumulado, refugio cumbrero y vistas a la alta cordillera.',
    panoramic_summary: 'Vistas colosales del Cerro El Plomo, La Paloma, Altar, el Glaciar Iver y la ciudad entera a tus pies.',
    cover_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    gallery_urls: [],
    is_popular_sunset: true,
    featured: true,
    trailheads: [
      {
        id: 'th-provincia-puente-nilhue',
        name: 'Acceso Puente Ñilhue (Camino a Farellones)',
        slug: 'puente-nilhue',
        address_description: 'Km 6 Camino a Farellones (G-21), Lo Barnechea.',
        latitude: -33.3792,
        longitude: -70.4782,
        google_maps_link: 'https://maps.google.com/?q=-33.3792,-70.4782',
        parking_type: 'parque_oficial',
        parking_fee_clp: 3450,
        parking_security_tip: 'Estacionamiento custodiado dentro de la administración de Parque Cordillera.',
        public_transit_info: 'Colectivo a Farellones desde Plaza San Enrique o vehículo particular.',
        operating_hours: 'Registro obligatorio de 08:00 a 18:00 hrs',
        entry_fee_required: true,
        entry_fee_clp: 3450,
        routes: [
          {
            id: 'route-provincia-nilhue',
            variant_name: 'Ruta Clásica por el Puente Ñilhue',
            slug: 'puente-nilhue-clasica',
            trailhead_name: 'Acceso Puente Ñilhue',
            distance_km: 16.0,
            elevation_gain_m: 1850,
            avg_duration_up_hours: 5.5,
            avg_duration_down_hours: 3.5,
            technical_difficulty: 'alta_montana',
            physical_exertion: '5/5',
            trail_surface: 'Sendero de montaña largo, acarreos de altura y filo cumbrero expuesto al viento',
            water_available: false,
            shade_percentage: 'Nula (0%)',
            family_friendly: false,
            pet_friendly: false,
            best_time_of_day: 'Madrugada (05:00 AM) o con vivac en cumbre',
            description: 'Una expedición de un día completo. Exige excelente condición física y aclimatación. Pasa por el Vallecito y el filo cumbrero hasta el famoso domo/refugio de la cumbre.',
            highlights: ['Cumbre icónica de casi 3.000m', 'Refugio domo en cumbre', 'Experiencia de alta montaña por el día'],
            required_equipment: ['3 a 4 litros de agua', 'Ropa de abrigo técnica (viento helado en cumbre)', 'Bastones de trekking', 'Botiquín y linterna frontal con baterías de repuesto'],
            elevation_profile: [
              { km: 0.0, alt: 900, label: 'Puente Ñilhue' },
              { km: 4.2, alt: 1450, label: 'Vallecito' },
              { km: 9.5, alt: 2150, label: 'El Peñón' },
              { km: 13.0, alt: 2550, label: 'Filo Cumbrero' },
              { km: 16.0, alt: 2750, label: 'Domo & Cumbre Provincia' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 55000
          }
        ]
      },
      {
        id: 'th-provincia-san-carlos',
        name: 'Acceso San Carlos de Apoquindo',
        slug: 'san-carlos-de-apoquindo',
        address_description: 'Avenida Las Flores 13000, Las Condes (Estadio San Carlos).',
        latitude: -33.3985,
        longitude: -70.4952,
        google_maps_link: 'https://maps.google.com/?q=-33.3985,-70.4952',
        parking_type: 'parque_oficial',
        parking_fee_clp: 3450,
        parking_security_tip: 'Estacionamiento oficial del Parque Cordillera.',
        public_transit_info: 'Micro C02 o C02c hasta San Carlos de Apoquindo.',
        operating_hours: '08:00 a 18:00 hrs',
        entry_fee_required: true,
        entry_fee_clp: 3450,
        routes: [
          {
            id: 'route-provincia-naranjo',
            variant_name: 'Ruta Alto del Naranjo y Filo Norte',
            slug: 'via-alto-del-naranjo',
            trailhead_name: 'Acceso San Carlos de Apoquindo',
            distance_km: 18.5,
            elevation_gain_m: 1780,
            avg_duration_up_hours: 6.0,
            avg_duration_down_hours: 4.0,
            technical_difficulty: 'alta_montana',
            physical_exertion: '5/5',
            trail_surface: 'Sendero amplio hasta el Alto del Naranjo, luego filo montañoso rocoso',
            water_available: false,
            shade_percentage: 'Baja (10%)',
            family_friendly: false,
            pet_friendly: false,
            best_time_of_day: 'Madrugada',
            description: 'Sube primero al famoso árbol del Alto del Naranjo (1.890m) y desde allí encara el majestuoso filo norte hasta la cumbre del Provincia.',
            highlights: ['Visita el legendario Quillay del Alto del Naranjo', 'Vistas continuas de toda la cordillera', 'Retorno desafiante'],
            required_equipment: ['Mochila técnica de montaña', '3.5 litros de agua', 'Bastones de trekking', 'Cortaviento y capa térmica'],
            elevation_profile: [
              { km: 0.0, alt: 970, label: 'Acceso San Carlos' },
              { km: 5.5, alt: 1420, label: 'Monolito de Piedra' },
              { km: 9.2, alt: 1890, label: 'Árbol Alto del Naranjo' },
              { km: 14.5, alt: 2420, label: 'Cuchilla Norte' },
              { km: 18.5, alt: 2750, label: 'Cumbre Provincia' }
            ],
            is_guided_by_santiago_hiking: true,
            commercial_price_clp: 55000
          }
        ]
      }
    ]
  }
];

export function getAllPeaks(): Peak[] {
  return PEAKS_DIRECTORY;
}

export function getPeakBySlug(slug: string): Peak | undefined {
  return PEAKS_DIRECTORY.find(p => p.slug === slug);
}

export function getAllRoutes(): { peak: Peak; trailhead: PeakTrailhead; route: PeakRoute }[] {
  const result: { peak: Peak; trailhead: PeakTrailhead; route: PeakRoute }[] = [];
  for (const peak of PEAKS_DIRECTORY) {
    for (const trailhead of peak.trailheads) {
      for (const route of trailhead.routes) {
        result.push({ peak, trailhead, route });
      }
    }
  }
  return result;
}
