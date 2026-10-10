'use client';
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  { name: "Camila V.", route: "Sunset Treks", image: "https://randomuser.me/api/portraits/women/32.jpg", text: "Fui sola y me sentí segura en todo momento. La vista del atardecer con el grupo fue increíble. Gaz arma un ambiente muy pro." },
  { name: "Sarah J.", route: "Sunset Treks", image: "https://randomuser.me/api/portraits/women/68.jpg", text: "Absolutely stunning experience. The logistics were flawless, and watching the sunset over the Andes is something I'll never forget." },
  { name: "Diego M.", route: "WildTrek", image: "https://randomuser.me/api/portraits/men/45.jpg", text: "Me encantó que el ritmo de subida fue adaptado para todos. Las fotos que nos sacó quedaron brutales para Instagram." },
  { name: "Michael T.", route: "WildTrek", image: "https://randomuser.me/api/portraits/men/22.jpg", text: "Top-tier guiding. Gaz made sure the pace was perfect for everyone. Highly recommend for any expats or travelers visiting Santiago." },
  { name: "Valentina R.", route: "Networking Manquehuito", image: "https://randomuser.me/api/portraits/women/24.jpg", text: "Excelente forma de conocer gente nueva que le gusta el cerro. La logística 10/10, no me tuve que preocupar de nada." }
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4500); // Rotates every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Mobile Auto-Fading Carousel */}
      {/* Mobile Auto-Fading Carousel */}
      <div className="md:hidden relative h-[260px] mb-8 glass-panel rounded-3xl border border-white/5 overflow-hidden">
        {testimonials.map((t, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <div>
              <div className="text-amber-500 mb-4 flex gap-1">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-300 font-light text-sm italic line-clamp-4 leading-relaxed">"{t.text}"</p>
            </div>
            <div className="flex items-center gap-3 pb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-800 border border-white/10">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">{t.name}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{t.route}</p>
              </div>
            </div>
          </div>
        ))}
        {/* Paginators */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
            {testimonials.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-500 w-6' : 'bg-slate-700 w-1.5'}`} />
            ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:flex flex-wrap justify-center gap-6">
        {testimonials.map((t, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl relative flex flex-col border border-white/5 md:w-[calc(33.333%-16px)]">
                <div className="text-amber-500 mb-4 flex gap-1">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 font-light text-sm italic mb-6 leading-relaxed flex-grow">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-800 border border-white/10">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                      <p className="text-white text-sm font-bold">{t.name}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest">{t.route}</p>
                  </div>
                </div>
            </div>
        ))}
      </div>
    </>
  );
}
