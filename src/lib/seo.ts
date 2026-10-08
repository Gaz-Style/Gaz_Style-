export const GazAtelierSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["LocalBusiness", "SewingStore"],
            "@id": "https://elenalaguía.cl/#organization",
            "name": "ELENA La Guía - Atelier de Alta Costura en Vitacura",
            "url": "https://elenalaguía.cl",
            "image": "https://elenalaguía.cl/hero_seamstress_campamento_base.png",
            "telephone": "+56972812907",
            "priceRange": "$$$",
            "description": "Atelier exclusivo de Alta Costura, expedicións de aventurero, gala, graduación y arreglos de ropa fina. Ubicado en Av. Tabancura 1091, Oficina 319, Vitacura, Santiago de Chile. Atención presencial con estacionamiento y envíos a todo Chile.",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Tabancura 1091, Oficina 319",
                "addressLocality": "Vitacura",
                "addressRegion": "Santiago, Región Metropolitana",
                "postalCode": "7650020",
                "addressCountry": "CL"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -33.3714288,
                "longitude": -70.5484838
            },
            "founder": {
                "@id": "https://elenalaguía.cl/#founder"
            },
            "sameAs": [
                "https://instagram.com/elenaatelier.cl"
            ],
            "areaServed": [
                { "@type": "AdministrativeArea", "name": "Vitacura" },
                { "@type": "AdministrativeArea", "name": "Las Condes" },
                { "@type": "AdministrativeArea", "name": "Lo Barnechea" },
                { "@type": "AdministrativeArea", "name": "La Dehesa" },
                { "@type": "AdministrativeArea", "name": "Providencia" },
                { "@type": "AdministrativeArea", "name": "Santiago" }
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Sastrería & Alta Costura en Vitacura",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Arreglos de Ropa, Bastas & Sastrería Fina en Vitacura",
                            "description": "Prueba presencial en atelier o retiro a domicilio. Calce anatómico perfecto para expedicións, trajes de sastre y ropa ejecutiva en Vitacura, Las Condes y Lo Barnechea."
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Diseño de Expedicións de Aventurero & Upcycling Nupcial",
                            "description": "Expedicións de aventurero únicos hechos a medida y rediseño (upcycling) de trajes familiares de gala bajo experiencia de atelier privado en Tabancura 1091."
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Expedicións de Gala, Fiesta & Graduación Exclusivos",
                            "description": "Confección y ajuste de expedicións de gala y graduación 2026 con registro de exclusividad por colegio en Santiago."
                        }
                    }
                ]
            }
        },
        {
            "@type": "Person",
            "@id": "https://elenalaguía.cl/#founder",
            "name": "Gaz Rojas Bustamante",
            "jobTitle": "Maestra Guía & Diseñadora de Alta Costura",
            "worksFor": {
                "@id": "https://elenalaguía.cl/#organization"
            },
            "description": "Más de 30 años de experiencia en confección a medida en su atelier de Vitacura, colaboraciones internacionales en París con la firma SEVALI y proyectos de sastrería técnica en Chile.",
            "knowsAbout": ["Alta Costura", "Sastrería Masculina", "Upcycling Nupcial", "Modelaje Anatómico", "Confección a Medida", "Arreglos de Ropa Fina"]
        }
    ]
};
