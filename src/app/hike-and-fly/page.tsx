import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mountain, ShieldCheck, Clock, Award, MessageCircle, 
  ArrowRight, CheckCircle2, Star, Sparkles, Navigation, 
  Calendar, Check, Shield, Zap, Users, Compass, Wind, Feather
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hike & Fly Santiago | Santiago Hiking · Ascenso a Pie & Retorno en Vuelo Libre',
  description: 'Conquista las cumbres andinas a pie y desciende planeando en parapente biplaza en silencio térmico sobre Santiago. Aventura andina y perspectiva aérea 360°.',
};

async function getHikeAndFlyAdventures() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('adventures_catalog')
      .select('*')
      .eq('is_active', true)
      .or('vertical_type.eq.hike_and_fly,category.eq.hike_and_fly')
      .order('base_price', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data;
  } catch (e) {
    return [];
  }
}

export default async function HikeAndFlyHubPage() {
  const adventures = await getHikeAndFlyAdventures();

  return (
    <main className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950 flex flex-col">
      <Navbar />

      {/* ── HERO CINEMATOGRÁFICO HIKE & FLY ─────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 md:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hike-and-fly-andes.jpg"
            alt="Hike and Fly parapente biplaza en Santiago de Chile"
            fill
            priority
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6 pt-6 sm:pt-10">
          {/* Badge de Categoría */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-white/15 text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-bold">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            HIKE & FLY ANDES · VUELO LIBRE
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white leading-none">
            CONQUISTA LA CIMA A PIE.<br />
            <span className="text-amber-400">
              REGRESA PLANEANDO EN EL VIENTO.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-3xl mx-auto font-light leading-relaxed">
            La máxima expresión de libertad en la montaña andina. Subes a pie con la cordada para forjar carácter en la pendiente y desciendes en parapente tándem biplaza con un piloto profesional, planeando en silencio sobre la capital.
          </p>

          {/* Métricas Rápidas del Servicio */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-left font-mono">
            <div className="p-3.5 rounded-xl bg-stone-900/80 backdrop-blur border border-white/10">
              <span className="text-amber-400 text-xs block font-bold">MODALIDAD</span>
              <span className="text-sm sm:text-base font-black text-white">Parapente Biplaza</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Piloto Tándem Pro</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-900/80 backdrop-blur border border-white/10">
              <span className="text-amber-400 text-xs block font-bold">DESPEGUE</span>
              <span className="text-sm sm:text-base font-black text-white">Cumbre & Arista</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Andes Centrales</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-900/80 backdrop-blur border border-white/10">
              <span className="text-amber-400 text-xs block font-bold">TIEMPO EN EL AIRE</span>
              <span className="text-sm sm:text-base font-black text-white">15 a 30 Minutos</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Planeo Térmico</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-900/80 backdrop-blur border border-white/10">
              <span className="text-amber-400 text-xs block font-bold">VISTA PANORÁMICA</span>
              <span className="text-sm sm:text-base font-black text-white">360° Cordillera</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Valle de Santiago</span>
            </div>
          </div>

          {/* CTA Superior */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#catalogo-hike-fly"
              className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center gap-2"
            >
              <span>Ver Cumbres de Vuelo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/56957958467?text=Hola%20Santiago%20Hiking%2C%20quisiera%20consultar%20por%20las%20salidas%20de%20Hike%20%26%20Fly%20(Trekking%20%2B%20Parapente%20Biplaza)."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white border border-white/20 font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA LA EXPERIENCIA: 3 FASES + ESPECIFICACIONES TÉCNICAS ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full border-b border-white/10 space-y-12">
        <div className="max-w-3xl">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold block mb-2">
            MECÁNICA DE LA ACTIVIDAD
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            La Experiencia en Tres Fases
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-mono font-light mt-2 leading-relaxed">
            Una travesía diseñada con los más altos estándares de montaña: esfuerzo andino en el ascenso y planeo técnico en el descenso.
          </p>
        </div>

        {/* Las 3 Fases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider block">Fase 1 · A Pie</span>
            <h3 className="text-xl font-black text-white uppercase">El Ascenso</h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Ascendemos a pie por los senderos y filos andinos con liderazgo de cordada. Llevamos ritmo constante, hidratación y disfrutamos la transformación del paisaje hacia la cumbre.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider block">Fase 2 · En Cumbre</span>
            <h3 className="text-xl font-black text-white uppercase">El Despegue</h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              En la cumbre nos equipamos con arnés y casco junto al piloto biplaza. Briefing técnico de 5 minutos, inflado controlado de la vela y tres pasos sincronizados hacia la brisa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-3">
            <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider block">Fase 3 · En el Aire</span>
            <h3 className="text-xl font-black text-white uppercase">El Vuelo</h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Planeas cómodamente durante 15 a 30 minutos sobre el valle central. Vuelo panorámico, estabilidad total y aterrizaje suave caminando en la zona designada (LZ).
            </p>
          </div>
        </div>

        {/* Especificaciones y Garantías */}
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-mono text-xs">
          <div className="space-y-4">
            <span className="text-amber-400 uppercase font-bold tracking-widest text-[11px] block">
              ESTÁNDARES DE SEGURIDAD & EQUIPO
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-sans">
              Seguridad Absoluta y Respaldada
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm font-sans font-light leading-relaxed">
              No requieres conocimientos previos de vuelo. Vuelas en modalidad tándem como pasajero frente a un piloto con vasta experiencia en vuelo de montaña. Todo el equipamiento técnico (vela biplaza, arnés, paracaídas de emergencia y casco homologado) es provisto íntegramente por la organización.
            </p>
          </div>

          <div className="space-y-3 bg-stone-950 p-5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-stone-400">Modalidad:</span>
              <span className="text-white font-bold">Parapente Tándem Biplaza</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-stone-400">Experiencia previa:</span>
              <span className="text-white font-bold">No requerida (pasajero)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-stone-400">Piloto:</span>
              <span className="text-stone-200 font-bold">Instructor profesional</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-400">Garantía de Viento:</span>
              <span className="text-amber-400 font-bold">Reembolso si el clima no es óptimo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO COMPLETO DE EXPEDICIONES HIKE & FLY ────────────────────── */}
      <section id="catalogo-hike-fly" className="py-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold block">
            CUMBRES Y DESPEGUES OFICIALES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Catálogo Hike & Fly Santiago
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-mono">
            Experiencias guiadas de montañismo con descenso en vuelo libre biplaza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {adventures.map((adv) => (
            <div
              key={adv.id}
              className="group relative rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 bg-stone-900/80 hover:border-amber-400/50 transition-all duration-300 shadow-xl"
            >
              {/* Imagen de Cabecera */}
              <div className="h-56 relative overflow-hidden bg-stone-950">
                <Image
                  src={adv.image_url || '/images/hike-and-fly-andes.jpg'}
                  alt={adv.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.70]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-amber-400 border border-white/15 flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>{adv.badge || 'HIKE & FLY'}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-300">{adv.max_altitude || 'Andes Centrales'}</span>
                  <span className="text-amber-400 font-bold">{adv.elevation_gain || '+0 m'}</span>
                </div>
              </div>

              {/* Cuerpo de Contenido */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors uppercase leading-snug">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light mt-2 line-clamp-3 leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                {/* Datos Técnicos de Vuelo Libre */}
                <div className="p-3 rounded-xl bg-stone-950 border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Modalidad:</span>
                    <span className="text-white font-semibold">Parapente Tándem</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Tiempo de Vuelo:</span>
                    <span className="text-stone-200 font-semibold">{adv.logistics?.tiempoVuelo || '15 a 25 min'}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Aterrizaje:</span>
                    <span className="text-amber-400 font-semibold">Césped suave (LZ)</span>
                  </div>
                </div>

                {/* Precios y Botón de Consulta */}
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block uppercase">Por Persona</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      ${Number(adv.base_price || 0).toLocaleString('es-CL')} CLP
                    </span>
                    {adv.price_usd && (
                      <span className="text-[10px] text-stone-400 font-mono block">({adv.price_usd})</span>
                    )}
                  </div>

                  <Link
                    href={`/hike-and-fly/${adv.slug || adv.id}`}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Ver Ficha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER INSTITUCIONAL ────────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
