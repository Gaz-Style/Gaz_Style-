import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import TikTokPixel from "@/components/TikTokPixel";
import LinkedInInsight from "@/components/LinkedInInsight";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santiago Hiking | Expediciones de Montaña, Hike & Fly y Trekkings en Santiago",
  description: "Aventuras salvajes y expediciones guiadas en la Cordillera de los Andes. Atardeceres en Manquehuito, Hike & Fly en parapente biplaza, desafíos de resistencia y comunidad solo-friendly en Santiago de Chile.",
  keywords: [
    "Trekking Santiago",
    "Hiking Santiago Chile",
    "Hike and Fly Santiago",
    "Parapente biplaza Santiago",
    "Cerro Manquehuito atardecer",
    "Cerro Manquehue trekking",
    "Cerro El Carbón ruta",
    "Cerro Pochoco trekking",
    "Cerro Provincia travesía",
    "Cerro Pintor La Parva",
    "Glaciar El Morado Cajón del Maipo",
    "Salidas al cerro Santiago",
    "Grupos de trekking Santiago",
    "Trekking solo friendly Santiago",
    "Aventuras cordillera de los Andes",
    "Qué cerro subir en Santiago",
    "Tours de montaña Santiago Chile",
    "Vuelo libre Santiago parapente biplaza"
  ],
  authors: [{ name: "Gaz_Style", url: "https://www.santiagohiking.com" }],
  creator: "Santiago Hiking by Gaz_Style",
  metadataBase: new URL("https://www.santiagohiking.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es": "https://www.santiagohiking.com",
      "en": "https://www.santiagohiking.com/en",
      "pt": "https://www.santiagohiking.com/pt",
      "de": "https://www.santiagohiking.com/de",
      "fr": "https://www.santiagohiking.com/fr",
      "x-default": "https://www.santiagohiking.com",
    },
  },
  openGraph: {
    title: "Santiago Hiking ⚡ Expediciones Andinas, Hike & Fly y Lifestyle",
    description: "Expediciones de montaña y vuelo libre en los Andes Centrales. Liderazgo de cordada, ascensos al atardecer en Manquehuito, Hike & Fly biplaza y comunidad solo-friendly en Santiago de Chile.",
    url: "https://www.santiagohiking.com",
    siteName: "Santiago Hiking",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/images/andes_cordillera_hero.jpg",
        width: 1200,
        height: 630,
        alt: "Santiago Hiking - Expediciones y Aventuras en la Cordillera de los Andes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Hiking ⚡ Expediciones Andinas & Hike & Fly",
    description: "Liderazgo de cordada, fotografía profesional y conexión salvaje en los Andes de Santiago de Chile.",
    images: ["/images/andes_cordillera_hero.jpg"],
  },
  verification: {
    google: "google42ee4234a9dc3e43",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // Schema.org estructurado para Google y LLMs (ChatGPT, Perplexity, Claude, Google AI Overviews)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SportsActivityLocation", "TravelAgency"],
        "@id": "https://www.santiagohiking.com/#organization",
        "name": "Santiago Hiking",
        "alternateName": "Gaz Style Expeditions",
        "url": "https://www.santiagohiking.com",
        "logo": "https://www.santiagohiking.com/logotipo%20blanco.png",
        "image": "https://www.santiagohiking.com/images/andes_cordillera_hero.jpg",
        "description": "Expediciones de montaña, senderismo guiado, expediciones Hike & Fly y comunidad outdoor solo-friendly en Santiago de Chile.",
        "founder": {
          "@type": "Person",
          "name": "Gaz",
          "jobTitle": "Líder de Expedición & Fundador"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lo Barnechea",
          "addressRegion": "Metropolitana",
          "addressCountry": "Chile"
        },
        "priceRange": "$$",
        "currenciesAccepted": "CLP, USD",
        "paymentAccepted": "MercadoPago, Webpay, Transferencia Bancaria, Tarjeta de Crédito",
        "areaServed": [
          "Santiago",
          "Lo Barnechea",
          "Las Condes",
          "Vitacura",
          "Cajón del Maipo",
          "Cordillera de los Andes Centrales"
        ],
        "knowsAbout": [
          "Trekking en Santiago de Chile",
          "Hike and Fly Andes",
          "Parapente biplaza tándem",
          "Cerro Manquehuito al atardecer",
          "Cerro Manquehue",
          "Cerro El Carbón",
          "Cerro Pochoco",
          "Cerro Provincia",
          "Cerro Pintor",
          "Glaciar El Morado",
          "Liderazgo de cordada y seguridad en montaña",
          "Turismo Aventura Chile"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.96",
          "reviewCount": "194",
          "bestRating": "5",
          "worstRating": "1"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Catálogo de Experiencias y Expediciones",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Sunset Treks & Cumbres Formativas",
              "itemListElement": [
                {
                  "@type": "TouristTrip",
                  "name": "Sunset Trek Manquehuito",
                  "description": "Atardecer dorado sobre el valle de Santiago y descenso nocturno bajo las estrellas con linternas frontales.",
                  "touristType": ["Beginner", "Solo Hikers"]
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Hike & Fly Andes",
              "itemListElement": [
                {
                  "@type": "TouristTrip",
                  "name": "Hike & Fly Las Vizcachas / Manquehue",
                  "description": "Ascenso a pie por aristas andinas y retorno en planeo biplaza tándem en parapente con piloto profesional.",
                  "touristType": ["Adventure Seekers", "Solo Hikers"]
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Desafíos de Resistencia & Alta Montaña",
              "itemListElement": [
                {
                  "@type": "TouristTrip",
                  "name": "Travesía Sierra de Ramón & Cerro Pintor 4.180m",
                  "description": "Retos de resistencia física, aclimatación guiada y grandes panorámicas sobre los Andes Centrales.",
                  "touristType": ["Advanced Hikers", "Athletes"]
                }
              ]
            }
          ]
        },
        "sameAs": [
          "https://instagram.com/santiagohiking"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.santiagohiking.com/#website",
        "url": "https://www.santiagohiking.com",
        "name": "Santiago Hiking",
        "description": "Expediciones de Montaña, Hike & Fly y Trekkings en la Cordillera de los Andes de Santiago",
        "publisher": { "@id": "https://www.santiagohiking.com/#organization" }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.santiagohiking.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué es Santiago Hiking y qué experiencias ofrece?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Santiago Hiking es un operador de expediciones de montaña y experiencias outdoor en Santiago de Chile. Ofrece salidas de trekking formativo, atardeceres en cumbres como Cerro Manquehuito, expediciones pioneras de Hike & Fly (ascenso a pie y descenso en parapente biplaza tándem), travesías de resistencia física y salidas de alta montaña."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo participar si voy solo o sola?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutamente. Más del 60% de los aventureros asisten solos. Todas las salidas están diseñadas bajo el concepto Solo-Friendly con grupos reducidos (8 a 10 personas) y liderazgo de cordada cercano para integrarte desde el primer minuto."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué es el Hike & Fly en Santiago?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hike & Fly combina el montañismo tradicional con el vuelo libre: subes la cumbre a pie por senderos andinos y desciendes planeando en silencio térmico en parapente biplaza tándem junto a un piloto profesional. Se opera en sectores como Las Vizcachas, Cerro Manquehue y Farellones."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo se reserva un cupo para una salida?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La reserva es 100% digital en santiagohiking.com/reservar. Puedes pagar con tarjetas de débito/crédito mediante MercadoPago o transferencia bancaria directa."
            }
          }
        ]
      },
      {
        "@type": "VideoObject",
        "@id": "https://www.santiagohiking.com/#hero-video",
        "name": "Hike & Fly Andes: Expedición y Vuelo Libre en Santiago de Chile",
        "description": "Ascenso a cumbres andinas de Santiago y retorno planeando en parapente biplaza tándem con piloto experto.",
        "thumbnailUrl": "https://www.santiagohiking.com/images/andes_cordillera_hero.jpg",
        "uploadDate": "2026-10-21T18:00:00-03:00",
        "contentUrl": "https://www.santiagohiking.com/contenido/hike-and-fly.mp4",
        "embedUrl": "https://www.santiagohiking.com/hike-and-fly"
      }
    ]
  };

  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo%20sh.png" />
        <link rel="shortcut icon" href="/logo%20sh.png" />
        <link rel="apple-touch-icon" href="/logo%20sh.png" />
        
        {/* Marcado Semántico para Motores de Búsqueda y LLMs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary selection:text-white">
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}

        {/* Analytics & Tracking Tags */}
        <MicrosoftClarity />
        <TikTokPixel />
        <LinkedInInsight />

        {/* 1. Google Tag Manager */}
        {gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}

        {/* 2. Google Analytics 4 (si se provee directo) */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga4Id}', { page_path: window.location.pathname });
                }
              `}
            </Script>
          </>
        )}

        {/* 3. Meta Pixel (Facebook / Instagram) */}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Service Worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocal) {
                  // En localhost desregistramos cualquier SW y limpiamos cachés para ver siempre la versión real en tiempo real
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var r of registrations) { r.unregister(); }
                  });
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var name of names) { caches.delete(name); }
                    });
                  }
                } else {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) { console.log('SW registered: ', registration.scope); },
                    function(err) { console.log('SW registration failed: ', err); }
                  );
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
