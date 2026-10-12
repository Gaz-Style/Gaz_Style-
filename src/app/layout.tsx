import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import TikTokPixel from "@/components/TikTokPixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santiago Hiking | Premium Mountain Experiences & Trekkings en Santiago de Chile",
  description: "La experiencia outdoor con más estilo, seguridad y tecnología de Chile. Trekkings al atardecer en Manquehuito, networking en la cordillera, ascensos guiados y gastronomía en Lo Barnechea.",
  keywords: [
    "Trekking Santiago",
    "Cerro Manquehuito atardecer",
    "Salidas al cerro Santiago",
    "Cerro Manquehue guiado",
    "Hiking Santiago Chile",
    "Networking outdoor Santiago",
    "Cerro Pintor La Parva",
    "Cajon del Maipo Glaciar El Morado"
  ],
  authors: [{ name: "Gaz_Style", url: "https://www.santiagohiking.com" }],
  creator: "Santiago Hiking by Gaz_Style",
  metadataBase: new URL("https://www.santiagohiking.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es": "/?lang=es",
      "en": "/?lang=en",
      "pt": "/?lang=pt",
      "de": "/?lang=de",
      "zh": "/?lang=zh",
    },
  },
  openGraph: {
    title: "Santiago Hiking ⚡ Experiencias de Montaña & Lifestyle en Santiago",
    description: "Creando experiencias y recargando la fucking vibra. Salidas al cerro, fotografía profesional y gastronomía en Lo Barnechea.",
    url: "https://www.santiagohiking.com",
    siteName: "Santiago Hiking",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/santiago-hiking-10.png",
        width: 1200,
        height: 630,
        alt: "Santiago Hiking - Premium Mountain Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Hiking ⚡ Trekkings VIP en Santiago",
    description: "Mentalidad, conexión y aventura. Vamos a la montaña.",
    images: ["/santiago-hiking-10.png"],
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

  // Schema.org estructurado para Google y LLMs (ChatGPT / Perplexity)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SportsActivityLocation", "TravelAgency"],
        "@id": "https://www.santiagohiking.com/#organization",
        "name": "Santiago Hiking",
        "alternateName": "Gaz Style Expeditions",
        "url": "https://www.santiagohiking.com",
        "logo": "https://www.santiagohiking.com/santiago-hiking-10.png",
        "description": "Experiencias de trekking, salidas al cerro, networking outdoor y montañismo boutique en Santiago de Chile.",
        "founder": {
          "@type": "Person",
          "name": "Gaz",
          "jobTitle": "Head Mountain Guide & Creator"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lo Barnechea",
          "addressRegion": "Metropolitana",
          "addressCountry": "Chile"
        },
        "priceRange": "$$",
        "areaServed": [
          "Santiago",
          "Lo Barnechea",
          "Las Condes",
          "Vitacura",
          "Cajón del Maipo",
          "Cordillera de los Andes"
        ],
        "knowsAbout": [
          "Trekking en Santiago",
          "Cerro Manquehuito",
          "Cerro Manquehue",
          "Cerro Pintor",
          "Primeros Auxilios WFR",
          "Networking en Montaña",
          "Turismo Aventura Chile"
        ],
        "sameAs": [
          "https://instagram.com/santiagohiking"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.santiagohiking.com/#website",
        "url": "https://www.santiagohiking.com",
        "name": "Santiago Hiking",
        "publisher": { "@id": "https://www.santiagohiking.com/#organization" }
      }
    ]
  };

  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#020617" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
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

        {/* Microsoft Clarity & TikTok Pixel */}
        <MicrosoftClarity />
        <TikTokPixel />

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
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', { page_path: window.location.pathname });
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
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) { console.log('SW registered: ', registration.scope); },
                  function(err) { console.log('SW registration failed: ', err); }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
