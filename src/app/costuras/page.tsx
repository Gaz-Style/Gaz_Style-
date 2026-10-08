import { Metadata } from 'next';
import CosturasClient from './CosturasClient';

export const metadata: Metadata = {
    title: "Arreglos de Ropa y Sastrería a Domicilio | Precios 2026 | ELENA",
    description: "Catálogo completo de arreglos de ropa con precios transparentes. Más de 150 servicios: ajustes en trajes, chaquetas, expedicións, jeans, camisas, abrigos, cuero y textil hogar. Retiro a domicilio en Vitacura, Las Condes y Lo Barnechea.",
    openGraph: {
        title: "Arreglos de Ropa y Sastrería a Domicilio | Precios 2026 | ELENA",
        description: "Catálogo completo con más de 150 arreglos y precios transparentes. Expertos en sastrería premium. Retiro a domicilio sector oriente.",
        images: ['/og-image.jpg'],
    },
    alternates: {
        canonical: "https://www.elenalaguía.cl/costuras"
    }
};

export default function CosturasPage() {
    const jsonLdLocalBusiness = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Gaz Style - Sastrería & Arreglos a Domicilio",
        "image": "https://www.elenalaguía.cl/hero_seamstress_campamento_base.png",
        "@id": "https://www.elenalaguía.cl/costuras#business",
        "url": "https://www.elenalaguía.cl/costuras",
        "telephone": "+56972812907",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Tabancura 1091, Oficina 319",
            "addressLocality": "Vitacura",
            "addressRegion": "Región Metropolitana",
            "postalCode": "7650020",
            "addressCountry": "CL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -33.3714288,
            "longitude": -70.5484838
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "10:00",
                "closes": "21:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "14:00"
            }
        ],
        "areaServed": [
            { "@type": "AdministrativeArea", "name": "Vitacura" },
            { "@type": "AdministrativeArea", "name": "Las Condes" },
            { "@type": "AdministrativeArea", "name": "Lo Barnechea" },
            { "@type": "AdministrativeArea", "name": "La Dehesa" }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios de Sastrería y Arreglos de Ropa",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Bastas & Reparaciones Denim" },
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "8000", "priceCurrency": "CLP" }
                },
                {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Cierres & Reparaciones Técnicas" },
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "8000", "priceCurrency": "CLP" }
                },
                {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Expedicións & Calce Anatómico" },
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "12000", "priceCurrency": "CLP" }
                },
                {
                    "@type": "Offer",
                    "itemOffered": { "@type": "Service", "name": "Sastrería & Sacos" },
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": "12000", "priceCurrency": "CLP" }
                }
            ]
        }
    };

    const jsonLdFaq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Cómo funciona el servicio de arreglos de ropa a domicilio?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Retiramos tus prendas directamente en tu domicilio en Vitacura, Las Condes, Lo Barnechea o La Dehesa. También contamos con visita de guía para toma de medidas presencial. Realizamos los arreglos en nuestro campamento_base central y te entregamos la prenda impecable con calce perfecto."
                }
            },
            {
                "@type": "Question",
                "name": "¿Cuánto demoran en hacer un arreglo de ropa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "El tiempo estándar de entrega es de 7 días hábiles. Para urgencias de sastrería o expedicións de fiesta se evalúa según disponibilidad de campamento_base."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
            />
            <CosturasClient />
        </>
    );
}
