'use client';

import { useState, useEffect } from 'react';

const heroImages = [
    // Botas con barro (raw, realista)
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2800&auto=format&fit=crop", 
    // Carrera épica / cámara baja
    "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=2800&auto=format&fit=crop",
    // Detalle de zapatos en terreno crudo
    "https://images.unsplash.com/photo-1518774843924-4f3640b3c66f?q=80&w=2800&auto=format&fit=crop",
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-stone-950 w-full h-full">
            {heroImages.map((src, idx) => (
                <img
                    key={src}
                    src={src}
                    alt="Aventura en la cordillera"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out scale-105 ${
                        idx === current ? 'opacity-80' : 'opacity-0'
                    }`}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950" />
        </div>
    );
}
