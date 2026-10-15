'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const HERO_VIDEOS = [
  { id: 'manquehue', src: '/contenido/hiking-manquehue.mp4', label: 'Cerro Manquehue' },
  { id: 'img-6160', src: '/contenido/img_6160.mp4', label: 'Ruta & Naturaleza' },
  { id: 'img-6705', src: '/contenido/img_6705.mp4', label: 'Expedición Cordillera' },
  { id: 'img-8505', src: '/contenido/img_8505.mp4', label: 'Cumbre & Aventura' },
  { id: 'img-8696', src: '/contenido/img_8696.mp4', label: 'Senderos Andinos' },
  { id: 'img-8698', src: '/contenido/img_8698.mp4', label: 'Alta Montaña' },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_VIDEOS.length);
  }, []);

  useEffect(() => {
    playVideo(current);
  }, [current, playVideo]);

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-stone-950 pointer-events-none">
      {/* Carrusel de Videos con Crossfade Cinematográfico */}
      {HERO_VIDEOS.map((vid, idx) => {
        const isCurrent = idx === current;
        const isNext = idx === (current + 1) % HERO_VIDEOS.length;
        const preloadStrategy = isCurrent ? 'metadata' : isNext ? 'none' : 'none';

        return (
          <video
            key={vid.id}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            autoPlay={idx === 0}
            loop={false}
            muted
            playsInline
            preload={preloadStrategy}
            onEnded={handleNext}
            onError={() => {
              // Si un clip falla o no es compatible, salta fluidamente al siguiente
              if (idx === current) handleNext();
            }}
            poster="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80"
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <source src={vid.src} type="video/mp4" />
          </video>
        );
      })}

      {/* Overlay sutil y luminoso: mantiene la luz natural de los videos sin oscurecer */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/35 via-transparent to-black/45" />

      {/* Indicadores Minimalistas de Clips (Píldoras de cristal para interactuar o ver avance) */}
      <div className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center gap-2 pointer-events-auto">
        {HERO_VIDEOS.map((vid, idx) => (
          <button
            key={vid.id}
            type="button"
            onClick={() => setCurrent(idx)}
            title={vid.label}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              idx === current
                ? 'w-8 bg-[#ffda19] shadow-[0_0_8px_#ffda19]'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
