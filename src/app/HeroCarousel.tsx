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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.currentTime = 0;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Safari iOS Low Power Mode bloqueó el autoplay
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_VIDEOS.length);
  }, []);

  useEffect(() => {
    playVideo(current);
  }, [current, playVideo]);

  // Desbloqueo suave para iOS en caso de modo de bajo consumo: al primer toque o scroll intenta reproducir
  useEffect(() => {
    const unlockPlay = () => {
      const activeVideo = videoRefs.current[current];
      if (activeVideo && activeVideo.paused) {
        activeVideo.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener('touchstart', unlockPlay, { once: true, passive: true });
    window.addEventListener('scroll', unlockPlay, { once: true, passive: true });
    return () => {
      window.removeEventListener('touchstart', unlockPlay);
      window.removeEventListener('scroll', unlockPlay);
    };
  }, [current]);

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-stone-950 pointer-events-none">
      {/* Fondo de respaldo real de alta montaña (fotografía auténtica de la cordillera) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: "url('/images/andes_cordillera_hero.jpg')" }}
      />

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
            {...({ 'webkit-playsinline': 'true' } as Record<string, string>)}
            preload={preloadStrategy}
            onPlaying={() => {
              if (idx === current) setIsPlaying(true);
            }}
            onEnded={handleNext}
            onError={() => {
              // Si un clip falla o no es compatible, salta fluidamente al siguiente
              if (idx === current) handleNext();
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
              isCurrent && isPlaying ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <source src={vid.src} type="video/mp4" />
          </video>
        );
      })}

      {/* Overlay oscuro homogéneo de 40% para contraste y legibilidad óptima */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-black/40" />

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
