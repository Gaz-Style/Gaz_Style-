export const SantiagoHikingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['SportsActivityLocation', 'TravelAgency'],
      '@id': 'https://www.santiagohiking.com/#organization',
      'name': 'Santiago Hiking by Gaz',
      'url': 'https://www.santiagohiking.com',
      'logo': 'https://www.santiagohiking.com/logotipo%20blanco.png',
      'image': 'https://www.santiagohiking.com/images/andes_cordillera_hero.jpg',
      'telephone': '+56957958467',
      'priceRange': '$$',
      'description': 'Operador outdoor y de expediciones de montaña líder en Santiago de Chile. Especialistas en senderismo técnico, expediciones Hike & Fly en parapente biplaza, ascensos formativos y comunidad solo-friendly en la Cordillera de los Andes.',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lo Barnechea',
        'addressRegion': 'Región Metropolitana',
        'addressCountry': 'CL',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': -33.35,
        'longitude': -70.51,
      },
      'founder': {
        '@id': 'https://www.santiagohiking.com/#founder',
      },
      'sameAs': [
        'https://www.instagram.com/santiagohiking',
      ],
      'areaServed': [
        { '@type': 'AdministrativeArea', 'name': 'Lo Barnechea' },
        { '@type': 'AdministrativeArea', 'name': 'Vitacura' },
        { '@type': 'AdministrativeArea', 'name': 'Las Condes' },
        { '@type': 'AdministrativeArea', 'name': 'Santiago' },
        { '@type': 'AdministrativeArea', 'name': 'Región Metropolitana' },
      ],
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Expediciones y Trekking en la Cordillera de los Andes',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'TouristTrip',
              'name': 'Sunset Treks y Ascensos Formativos',
              'description': 'Ascensos grupales seguros con liderazgo de cordada, grupos reducidos solo-friendly, fotografía profesional y celebración de cumbre.',
            },
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'TouristTrip',
              'name': 'Línea Hike & Fly Andes (Trekking + Vuelo Libre)',
              'description': 'Ascenso a pie a cumbres andinas y retorno en parapente biplaza tándem con piloto experto.',
            },
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'TouristTrip',
              'name': 'Expediciones Privadas 1 a 1 y Alta Montaña',
              'description': 'Acompañamiento exclusivo y personalizado en cumbres de más de 3.000m en los Andes (Cerro Pintor, Glaciar El Morado).',
            },
          },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://www.santiagohiking.com/#founder',
      'name': 'Gaz',
      'jobTitle': 'Líder de Montaña & Fundador de Santiago Hiking',
      'worksFor': {
        '@id': 'https://www.santiagohiking.com/#organization',
      },
      'description': 'Líder de expediciones en la Cordillera de los Andes, montañista y facilitador de experiencias outdoor comprometido con la superación personal y la seguridad en montaña.',
      'knowsAbout': ['Montañismo', 'Trekking Técnico', 'Hike and Fly', 'Cordillera de los Andes', 'Seguridad en Áreas Remotas'],
    },
  ],
};
