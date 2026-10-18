export const SantiagoHikingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['SportsActivityLocation', 'TravelAgency'],
      '@id': 'https://www.santiagohiking.com/#organization',
      'name': 'Santiago Hiking by Gaz',
      'url': 'https://www.santiagohiking.com',
      'logo': 'https://www.santiagohiking.com/logotipo%20blanco.png',
      'image': 'https://www.santiagohiking.com/logotipo%20blanco.png',
      'telephone': '+56957958467',
      'priceRange': '$$',
      'description': 'Operador outdoor y de montaña líder en Santiago de Chile. Especialistas en senderismo técnico, trekking guiado con certificación WFR, expediciones privadas 1 a 1 y comunidad outdoor en la Cordillera de los Andes.',
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
              'name': 'Trekking Guiado Grupal con Protocolos WFR',
              'description': 'Ascensos grupales seguros con liderazgo de cordada WFR, radios VHF, botiquín de trauma y bajada gastronómica en Lo Barnechea.',
            },
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'TouristTrip',
              'name': 'Expediciones Privadas 1 a 1 y Alta Montaña',
              'description': 'Guiado exclusivo y personalizado para ejecutivos, turistas y atletas en cumbres de más de 3.000m en los Andes.',
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
      'description': 'Líder de expediciones en la Cordillera de los Andes, con entrenamiento en primeros auxilios en áreas silvestres (WFR), comprometido con la conexión mental y la seguridad en la montaña.',
      'knowsAbout': ['Montañismo', 'Trekking Técnico', 'Primeros Auxilios WFR', 'Cordillera de los Andes', 'Seguridad en Montaña'],
    },
  ],
};
