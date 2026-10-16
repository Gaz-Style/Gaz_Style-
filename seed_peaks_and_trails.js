const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync('.env.local', 'utf8');
const envConfig = {};
envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v.length > 0) {
            envConfig[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
    }
});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function runSeed() {
  console.log('--- INICIANDO SEEDING DE CUMBRES, ACCESOS Y VARIANTES ---');

  // Datos de los primeros 5 cerros icónicos
  const peaksData = [
    {
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
          routes: [
            {
              variant_name: 'Ruta Clásica por el Portezuelo',
              slug: 'normal-via-roja',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 25000
            }
          ]
        },
        {
          name: 'Acceso El Tranque (Los Trapenses)',
          slug: 'los-trapenses',
          address_description: 'Avenida El Tranque / Camino El Huinganal, Lo Barnechea.',
          latitude: -33.3521,
          longitude: -70.5594,
          google_maps_link: 'https://maps.google.com/?q=-33.3521,-70.5594',
          parking_type: 'calle_publica',
          parking_fee_clp: 0,
          parking_security_tip: 'Estacionar en calle El Tranque en zonas residenciales señalizadas.',
          public_transit_info: 'Micro C10 o C17 hasta El Tranque.',
          operating_hours: 'Acceso libre 24/7',
          entry_fee_required: false,
          routes: [
            {
              variant_name: 'Ruta El Tranque (Cara Nororiente)',
              slug: 'el-tranque',
              distance_km: 4.2,
              elevation_gain_m: 480,
              avg_duration_up_hours: 1.5,
              avg_duration_down_hours: 1.0,
              technical_difficulty: 'moderada',
              physical_exertion: '3/5',
              trail_surface: 'Sendero de tierra con mayor pendiente inicial y vegetación esclerófila',
              water_available: false,
              shade_percentage: 'Media (25%)',
              family_friendly: true,
              pet_friendly: true,
              best_time_of_day: 'Mañana o Atardecer',
              description: 'Alternativa mucho más tranquila y con menos gente que Vía Roja. Asciende desde Lo Barnechea por laderas con más vegetación y conecta directamente con el filo cumbrero.',
              highlights: ['Menos concurrido que Vía Roja', 'Vistas directas a la cordillera nevada', 'Excelente avistamiento de aves'],
              required_equipment: ['Zapatillas de trail running o trekking', 'Bastones de trekking recomendados', '2 litros de agua', 'Protección solar'],
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 25000
            }
          ]
        }
      ]
    },
    {
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
          routes: [
            {
              variant_name: 'Ruta Normal por el Portezuelo',
              slug: 'normal-via-roja',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 35000
            }
          ]
        },
        {
          name: 'Acceso Agua del Palo (Santa María de Manquehue)',
          slug: 'agua-del-palo',
          address_description: 'Calle Bosques de Montemar con Agua del Palo, Vitacura.',
          latitude: -33.3768,
          longitude: -70.5961,
          google_maps_link: 'https://maps.google.com/?q=-33.3768,-70.5961',
          parking_type: 'calle_publica',
          parking_fee_clp: 0,
          parking_security_tip: 'Barrio residencial tranquilo.',
          public_transit_info: 'C03 o C07 hasta Avenida Santa María.',
          operating_hours: 'Acceso libre 24/7',
          entry_fee_required: false,
          routes: [
            {
              variant_name: 'Ruta Sur por Agua del Palo',
              slug: 'agua-del-palo',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 35000
            }
          ]
        }
      ]
    },
    {
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
          routes: [
            {
              variant_name: 'Sendero Principal La Pirámide',
              slug: 'normal-la-piramide',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 20000
            }
          ]
        }
      ]
    },
    {
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
          routes: [
            {
              variant_name: 'Ruta Normal del Observatorio',
              slug: 'normal-observatorio',
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
              required_equipment: ['Bastones de trekking OBLIGATORIOS para la bajada', 'Zapatillas de montaña de caña media o alta', '2.5L de agua', 'Snacks energéticos'],
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 35000
            }
          ]
        }
      ]
    },
    {
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
              variant_name: 'Ruta Clásica por el Puente Ñilhue',
              slug: 'puente-nilhue-clasica',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 55000
            }
          ]
        },
        {
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
              variant_name: 'Ruta Alto del Naranjo y Filo Norte',
              slug: 'via-alto-del-naranjo',
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
              is_guided_by_santiago_hiking: true,
              commercial_price_clp: 55000
            }
          ]
        }
      ]
    }
  ];

  // Ejecutamos la inserción en Supabase
  for (const peak of peaksData) {
    const { trailheads, ...peakFields } = peak;

    console.log(`\nInsertando cumbre: ${peakFields.name}...`);
    const { data: upsertedPeak, error: peakErr } = await supabase
      .from('peaks')
      .upsert(peakFields, { onConflict: 'slug' })
      .select()
      .single();

    if (peakErr) {
      console.error(`Error insertando cumbre ${peakFields.name}:`, peakErr.message);
      continue;
    }

    const peakId = upsertedPeak.id;

    for (const th of trailheads) {
      const { routes, ...trailheadFields } = th;
      trailheadFields.peak_id = peakId;

      console.log(`  -> Insertando acceso: ${trailheadFields.name}...`);
      const { data: upsertedTh, error: thErr } = await supabase
        .from('trailheads')
        .upsert(trailheadFields, { onConflict: 'peak_id,slug' })
        .select()
        .single();

      if (thErr) {
        console.error(`Error insertando acceso ${trailheadFields.name}:`, thErr.message);
        continue;
      }

      const trailheadId = upsertedTh.id;

      for (const route of routes) {
        route.peak_id = peakId;
        route.trailhead_id = trailheadId;

        console.log(`     -> Insertando variante: ${route.variant_name}...`);
        const { error: routeErr } = await supabase
          .from('routes')
          .upsert(route, { onConflict: 'peak_id,slug' });

        if (routeErr) {
          console.error(`Error insertando ruta ${route.variant_name}:`, routeErr.message);
        }
      }
    }
  }

  console.log('\n--- ¡SEEDING COMPLETADO EXITOSAMENTE! ---');
}

runSeed().catch(console.error);
