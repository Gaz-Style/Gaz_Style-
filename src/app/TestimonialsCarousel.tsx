'use client';
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Camila Valenzuela",
    initials: "CV",
    origin: "Santiago, Chile",
    route: "Sunset Treks (Manquehuito)",
    color: "from-amber-500/20 to-orange-500/30 text-amber-300 border-amber-500/30",
    text: "Fui sola y me sentí segura en todo momento. La vista del atardecer con el grupo sobre la cordillera fue surrealista. Gaz arma un ambiente muy pro, seguro y con una vibra increíble.",
    tag: "Aventurera Verificada"
  },
  {
    name: "Sarah Jenkins",
    initials: "SJ",
    origin: "London, UK",
    route: "Sunset Treks (Andes Sunset)",
    color: "from-sky-500/20 to-blue-500/30 text-sky-300 border-sky-500/30",
    text: "Absolutely stunning experience! The logistics were flawless, Gaz speaks great English and watching the sunset over Santiago with headlamps for the descent was unforgettable.",
    tag: "Verified Traveler"
  },
  {
    name: "Diego Morales",
    initials: "DM",
    origin: "Las Condes, Chile",
    route: "WildTrek (Cardio & Desconexión)",
    color: "from-emerald-500/20 to-teal-500/30 text-emerald-300 border-emerald-500/30",
    text: "Me encantó que el ritmo de subida fue adaptado para todos pero con intensidad real para botar el estrés de la oficina. Las fotos que nos sacó quedaron brutales para redes.",
    tag: "Aventurero Verificado"
  },
  {
    name: "Michael Thompson",
    initials: "MT",
    origin: "Austin, TX (USA)",
    route: "WildTrek (Mountain Fitness)",
    color: "from-purple-500/20 to-indigo-500/30 text-purple-300 border-purple-500/30",
    text: "Top-tier guiding. Certified WFR guide with serious mountain knowledge, satellite gear and trauma kit. Highly recommend for any expats or travelers visiting Santiago.",
    tag: "Verified Traveler"
  },
  {
    name: "Valentina Rivas",
    initials: "VR",
    origin: "Vitacura, Chile",
    route: "Networking Manquehuito",
    color: "from-rose-500/20 to-amber-500/30 text-rose-300 border-rose-500/30",
    text: "Excelente formato para conectar con otros emprendedores mientras subes el cerro. Cero poses, tremenda conversación y la bajada gastronómica en Lo Barnechea cerró la jornada perfecto.",
    tag: "Comunidad Verificada"
  }
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Rotates every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Mobile Auto-Fading Carousel */}
      <div className="md:hidden relative min-h-[300px] mb-8 overflow-hidden rounded-2xl" style={{backgroundColor:'rgba(0, 0, 0, 0.35)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255, 255, 255, 0.10)'}}>
        {testimonials.map((t, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-amber-400 flex gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {t.tag}
                </span>
              </div>
              <p className="text-white/75 font-light text-sm italic leading-relaxed mb-4">"{t.text}"</p>
            </div>
            
            <div className="flex items-center gap-3 pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 bg-gradient-to-br ${t.color} border`}>
                {t.initials}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{t.name}</p>
                <p className="text-white/45 text-xs">{t.origin} · <span className="text-amber-400 font-medium">{t.route}</span></p>
              </div>
            </div>
          </div>
        ))}
        {/* Paginators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {testimonials.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-400 w-6' : 'bg-white/20 w-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map((t, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl relative flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 group"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-amber-400 flex gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {t.tag}
                </span>
              </div>
              <Quote className="w-6 h-6 text-white/15 mb-2" />
              <p className="text-white/70 font-light text-sm italic mb-6 leading-relaxed">{t.text}</p>
            </div>

            <div className="flex items-center gap-3 pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs uppercase bg-gradient-to-br ${t.color} border shrink-0 group-hover:scale-105 transition-transform`}>
                {t.initials}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{t.name}</p>
                <p className="text-white/40 text-xs">{t.origin}</p>
                <p className="text-amber-400 text-[10px] uppercase tracking-wider font-semibold mt-0.5">{t.route}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de Confianza y Verificación */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-bold">Reseñas 100% Verificadas de Participantes Reales</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/80">★ 4.9 / 5.0 Google Reviews</span>
          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-emerald-300">✓ Registro Sernatur Turismo Aventura</span>
          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-amber-300">🛡️ Guías Certificados WFR</span>
        </div>
      </div>
    </>
  );
}
