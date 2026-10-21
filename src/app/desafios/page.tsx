import Link from 'next/link';
import { challengesData, ChallengeDetail } from './data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Desafíos Cordillera Santiago | Santiago Hiking by Gaz_Style',
  description: 'Programas y retos de alta montaña, travesías extremas y circuitos exclusivos en la Región Metropolitana. Certificación WFR y expediciones boutique.',
};

export default function DesafiosHubPage() {
  const challenges: ChallengeDetail[] = Object.values(challengesData);

  return (
    <main className="relative min-h-screen text-white font-sans selection:bg-amber-500/30 bg-stone-950 flex flex-col">
      <Navbar />

      <header className="relative pt-32 pb-20 px-6 border-b border-stone-800/80 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.28em] font-bold block mb-3">
            ENTRENAMIENTO & RESISTENCIA
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 uppercase">
            DESAFÍO EXTREMO
          </h1>
          <p className="text-sm md:text-base text-stone-300 max-w-2xl mx-auto font-light font-mono leading-relaxed">
            Formatos de exigencia real para forjar carácter, resistencia física y templanza en la montaña. Cumbres al alba con frontales, circuitos multicumbre y travesías de alta intensidad.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((desafio) => (
            <div
              key={desafio.slug}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
            >
              <div className="h-48 relative overflow-hidden bg-stone-800">
                <img
                  src={desafio.coverImage}
                  alt={desafio.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-stone-950/80 backdrop-blur-md border border-stone-700/60 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {desafio.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-1 bg-stone-900/80 rounded-md text-stone-300 border border-stone-700">
                  {desafio.metrics.desnivel}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-500 font-mono text-xs font-bold">#{desafio.number}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                      {desafio.title}
                    </h3>
                  </div>
                  <p className="text-[11px] uppercase font-mono tracking-widest text-amber-500/90 mb-2">
                    {desafio.tagline}
                  </p>
                  <p className="text-xs text-stone-400 line-clamp-3 mb-4 font-light leading-relaxed">
                    {desafio.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] block uppercase font-mono text-stone-400">Dificultad</span>
                    <span className="text-xs font-bold text-stone-200">{desafio.metrics.dificultad}</span>
                  </div>
                  <Link
                    href={`/desafios/${desafio.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 shrink-0"
                  >
                    <span>Ver Ficha</span>
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
