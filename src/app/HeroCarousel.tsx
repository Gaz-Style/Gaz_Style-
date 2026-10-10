'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2803&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=2800&q=80",
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
                <Image
                    key={src}
                    src={src}
                    alt="Aventura en la cordillera"
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className={`object-cover transition-opacity duration-[2000ms] ease-in-out scale-105 ${
                        idx === current ? 'opacity-80' : 'opacity-0'
                    }`}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950" />
        </div>
    );
}
