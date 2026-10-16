import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Nosotros | Santiago Hiking by Gaz_Style',
  description: 'Conoce a Santiago Hiking by Gaz_Style. Liderado por Mario Cruz, ofrecemos expediciones boutique, guías WFR, cartografía técnica y conexión pura con la Cordillera de los Andes.',
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />

      <header className="relative pt-32 pb-20 px-6 border-b border-stone-800/80 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Identidad & Espíritu de Montaña
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            Sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Santiago Hiking</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Redefiniendo el senderismo y montañismo en la Región Metropolitana con estándares internacionales de seguridad, rigor cartográfico y servicio boutique.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Nacidos al pie de la Cordillera de los Andes
            </h2>
            <p className="text-stone-300 font-light leading-relaxed">
              Santiago Hiking nace de una convicción clara: Santiago tiene una de las geografías cordilleranas más imponentes del planeta en su patio trasero, pero el acceso a la montaña a menudo carece de información técnica confiable o de un acompañamiento profesional riguroso.
            </p>
            <p className="text-stone-400 font-light leading-relaxed">
              Diseñamos experiencias que combinan cartografía satelital precisa, fotografía profesional de autor y una operación en terreno bajo estrictas normas de primeros auxilios en áreas remotas (WFR).
            </p>
          </div>
          <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl relative">
            <div className="text-amber-400 text-4xl font-serif mb-4">"</div>
            <p className="text-stone-200 text-lg italic leading-relaxed mb-6 font-light">
              La montaña no se conquista; se respeta, se estudia y se transita con humildad, preparación y el equipo adecuado.
            </p>
            <div>
              <p className="text-white font-bold text-base">Mario Cruz</p>
              <p className="text-xs uppercase font-mono tracking-wider text-amber-400">Fundador & Head Guide • Santiago Hiking by Gaz_Style</p>
            </div>
          </div>
        </div>

        {/* Pilares */}
        <div className="pt-8">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-8 text-center">Nuestros 4 Pilares Fundamentales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-900/50 border border-stone-800/80 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">01</div>
              <h4 className="text-base font-bold text-white mb-2">Seguridad WFR</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-light">Protocolos Wilderness First Responder y botiquines de trauma en cada salida grupal o privada.</p>
            </div>
            <div className="bg-stone-900/50 border border-stone-800/80 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">02</div>
              <h4 className="text-base font-bold text-white mb-2">Cartografía Satelital</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-light">GPX verificados en terreno, waypoints críticos de agua y descargas técnicas para la comunidad.</p>
            </div>
            <div className="bg-stone-900/50 border border-stone-800/80 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">03</div>
              <h4 className="text-base font-bold text-white mb-2">Grupos Reducidos</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-light">Ritmo humano, trato personalizado y cero masividad para resguardar la flora y fauna nativa.</p>
            </div>
            <div className="bg-stone-900/50 border border-stone-800/80 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">04</div>
              <h4 className="text-base font-bold text-white mb-2">Fotografía Pro</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-light">Captura fotográfica de alta resolución incluida para revivir cada cumbre y atardecer cordillerano.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-8 md:p-12 rounded-3xl text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-black text-white">¿Listo para subir con nosotros?</h3>
          <p className="text-stone-300 max-w-xl mx-auto text-sm md:text-base font-light">
            Explora las cumbres de Santiago o coordina una expedición privada con Mario Cruz y el equipo técnico.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/cumbres"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Explorar Cumbres & Rutas
            </Link>
            <a
              href="https://wa.me/56957958467?text=Hola%20Santiago%20Hiking,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20expediciones"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Hablar con Mario Cruz por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
