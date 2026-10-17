import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPeakBySlugFromDb, getAllPeaksFromDb } from '@/lib/atlasService';
import { getMountainWeather } from '@/lib/weather';
import CerroDetailClient from './CerroDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const peaks = await getAllPeaksFromDb();
  return peaks.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sParams = await searchParams;
  const lang = sParams?.lang || 'es';
  const peak = await getPeakBySlugFromDb(slug);

  if (!peak) {
    return {
      title: 'Página no encontrada | Santiago Hiking',
      description: 'La cumbre o ruta solicitada no se encuentra disponible.'
    };
  }

  const isEnglish = lang === 'en';
  const title = isEnglish
    ? `${peak.name} Hike (${peak.altitude_msnm}m) · Trail Guide, Elevation & GPX | Santiago Hiking`
    : `${peak.name} (${peak.altitude_msnm}m) · Guía Técnica, Cómo Llegar Waze & GPX | Santiago Hiking`;

  const description = isEnglish
    ? `Official trail guide for ${peak.name} (${peak.altitude_msnm}m) in ${peak.massif}, ${peak.comunas.join(', ')}. Summit weather, elevation gain, trailhead parking and guided treks.`
    : `Guía técnica oficial del ${peak.name} (${peak.altitude_msnm}m) en ${peak.massif}, ${peak.comunas.join(', ')}. Clima en cumbre, altimetría, estacionamiento seguro Waze y expediciones guiadas.`;

  const keywords = peak.search_keywords || [
    peak.name,
    `${peak.name} trekking`,
    `${peak.name} hike`,
    `subir ${peak.name}`,
    `${peak.name} santiago`,
    'trekking santiago chile'
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://santiagohiking.com/${peak.slug}`,
      languages: {
        'es': `https://santiagohiking.com/${peak.slug}?lang=es`,
        'en': `https://santiagohiking.com/${peak.slug}?lang=en`,
        'pt': `https://santiagohiking.com/${peak.slug}?lang=pt`,
        'fr': `https://santiagohiking.com/${peak.slug}?lang=fr`,
        'de': `https://santiagohiking.com/${peak.slug}?lang=de`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://santiagohiking.com/${peak.slug}`,
      siteName: 'Santiago Hiking',
      images: [
        {
          url: peak.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: `${peak.name} - Santiago Hiking`
        }
      ],
      locale: lang === 'es' ? 'es_CL' : 'en_US',
      type: 'website'
    },
    other: {
      'geo.region': 'CL-RM',
      'geo.placename': `${peak.comunas[0] || 'Santiago'}, Chile`,
      'geo.position': `${peak.latitude};${peak.longitude}`,
      'ICBM': `${peak.latitude}, ${peak.longitude}`
    }
  };
}

export default async function DirectPeakPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;
  const lang = sParams?.lang || 'es';

  const peak = await getPeakBySlugFromDb(slug);
  if (!peak) {
    notFound();
  }

  // Telemetría climática en vivo en cumbre (Open-Meteo)
  const weather = await getMountainWeather(peak.latitude, peak.longitude, peak.altitude_msnm);

  // Schema.org JSON-LD (Mountain & TouristTrip)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Mountain',
        '@id': `https://santiagohiking.com/${peak.slug}#mountain`,
        name: peak.name,
        elevation: `${peak.altitude_msnm} m`,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: peak.latitude,
          longitude: peak.longitude
        },
        containedInPlace: {
          '@type': 'Place',
          name: `${peak.massif}, ${peak.comunas.join(' & ')}, Santiago, Región Metropolitana, Chile`
        },
        description: peak.summary,
        image: peak.cover_image_url
      },
      {
        '@type': 'TouristTrip',
        '@id': `https://santiagohiking.com/${peak.slug}#trip`,
        name: `Expedición y Trekking ${peak.name}`,
        description: peak.summary,
        touristType: ['Hikers', 'Trail Runners', 'Mountaineers'],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'CLP',
          lowPrice: '26000',
          highPrice: '95000',
          offerCount: '5'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CerroDetailClient peak={peak} weather={weather} currentLang={lang} />
    </>
  );
}
