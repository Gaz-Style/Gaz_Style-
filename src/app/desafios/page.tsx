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
    <main className="bg-stone-950 topographic-pattern topographic-contours min-h-screen text-stone-100 font-sans selection:bg-amber-500/30 flex flex-col">
      <Navbar />

      <header className="relative pt-32 pb-20 px-6 border-b border-stone-800/80 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Formatos de Gran Desafío
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            Desafíos Cordillera <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Santiago</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Hitos diseñados para superar tus límites con soporte técnico de alta montaña, guías certificados WFR, seguridad satelital y logística integral.
          </p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((desafio) => (
            <div
              key={desafio.slug}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
            >
              <div className="h-56 relative overflow-hidden bg-stone-800">
                <img
                  src={desafio.coverImage}
                  alt={desafio.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-stone-950/80 backdrop-blur-md border border-stone-700/60 rounded-full text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {desafio.badge}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 bg-stone-900/80 rounded-md text-stone-300 border border-stone-700">
                  {desafio.metrics.distancia} • {desafio.metrics.desnivel}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-500 font-mono text-xs font-bold">#{desafio.number}</span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {desafio.title}
                    </h3>
                  </div>
                  <p className="text-xs uppercase font-mono tracking-widest text-amber-500/90 mb-3">
                    {desafio.tagline}
                  </p>
                  <p className="text-sm text-stone-400 line-clamp-3 mb-6 font-light leading-relaxed">
                    {desafio.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] block uppercase font-mono text-stone-400">Dificultad</span>
                    <span className="text-sm font-bold text-stone-200">{desafio.metrics.dificultad}</span>
                  </div>
                  <Link
                    href={`/desafios/${desafio.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40"
                  >
                    Ver Ficha Técnica
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
