import React from "react";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import { ArrowLeft, Mountain, ShieldCheck, Clock, HeartPulse, Compass, Download, MessageCircle, Camera, Tent, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

async function getPublicData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const [{ data: routes }, { data: departures }] = await Promise.all([
    supabase.from('adventures_catalog').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('agenda_departures').select('*, adventures_catalog(title, base_price, max_pax)').in('status', ['scheduled', 'confirmed']).gte('start_date', new Date().toISOString().split('T')[0]).order('start_date', { ascending: true }).limit(6),
  ]);
  return { routes: routes || [], departures: departures || [] };
}

export default async function ExperienciaMontanaPage() {
  const { routes, departures } = await getPublicData();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
          
          .gaz-premium-body {
            background-color: transparent;
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
          }
          .font-editorial {
            font-family: 'Playfair Display', serif;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .gold-gradient-text {
            background: linear-gradient(to right, #f59e0b, #fbbf24, #fcd34d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `
      }} />

      <div className="gaz-premium-body min-h-screen flex flex-col antialiased selection:bg-amber-500/30 pb-16 md:pb-0">
        
        {/* HEADER */}
        <header className="fixed w-full top-0 z-50 glass-panel border-b-0 border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-amber-500" />
              <span className="font-editorial font-bold text-2xl tracking-wider text-white">
                GAZ<span className="text-amber-500 italic">_Style</span>
              </span>
            </div>

            <a href="#rutas" className="hidden md:inline-flex bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
              Ven al cerro
            </a>
          </div>
        </header>

        {/* HERO SECTION: MARCA PERSONAL */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <HeroCarousel />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium tracking-widest uppercase text-amber-400">Guía & Creador de Contenido</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-editorial font-bold text-white leading-tight mb-6">
              Soy Gaz y te ayudo a <br />
              <span className="italic font-light text-slate-300">descubrir la montaña a </span>
              <span className="gold-gradient-text">tu estilo.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              No soy una agencia de turismo tradicional. Soy tu compañero de ruta. Te muestro la realidad del trekking sin filtros: el barro, el cansancio y la comida en la cima.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#rutas" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105">
                Acompáñame a una ruta
              </a>
              <a href="#comunidad" className="w-full sm:w-auto glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all">
                Únete a la Tribu
              </a>
            </div>
          </div>
        </section>

        {/* LEAD MAGNET / FREEBIE */}
        <section className="py-16 bg-black/30 relative z-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-panel border-amber-500/20 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-10 h-10 text-amber-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Descarga gratis mi Checklist Definitiva 🎒</h3>
                <p className="text-slate-400 font-light text-sm md:text-base mb-6">
                  ¿No sabes qué meter en la mochila para ir al Cajón del Maipo por el día? He preparado un PDF con todo mi equipo esencial, paso a paso, para que nunca te falte (ni te sobre) nada.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="Tu mejor correo electrónico" className="bg-black/50 border border-slate-700 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-amber-500 flex-1" required />
                  <button type="button" className="bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-full transition-colors whitespace-nowrap">
                    Enviarme PDF
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* STORYTELLING / BLOG TEASER */}
        <section className="py-24 bg-black/30 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">El Blog / Vlog</span>
                <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white">La montaña sin filtros.</h2>
              </div>
              <p className="text-slate-400 mt-4 md:mt-0 max-w-sm text-sm font-light">
                Mis diarios de ruta, reviews de equipo y consejos para los que recién empiezan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fake Blog Post 1 */}
              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="aspect-video bg-stone-800 relative">
                  <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Blog 1" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">Principiantes</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">5 Cerros fáciles en Santiago si no tienes experiencia</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-2">Deja de mirar fotos en Instagram y sal de tu casa. Aquí tienes la lista de cerros que cualquiera puede subir.</p>
                </div>
              </div>

              {/* Fake Blog Post 2 */}
              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="aspect-video bg-stone-800 relative">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80" alt="Blog 2" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">Gear Review</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Mi equipo: ¿Qué zapatillas de trekking realmente recomiendo?</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-2">He destruido más de 10 pares en el último año. Estas son las únicas que me volvería a comprar a ojos cerrados.</p>
                </div>
              </div>

              {/* Fake Blog Post 3 */}
              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="aspect-video bg-stone-800 relative">
                  <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80" alt="Blog 3" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">Diario de Ruta</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Mi experiencia en el Cerro Pintor: Lo que salió mal.</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-2">No todo es éxito y fotos bonitas. Así fue como el clima nos jugó en contra y tuvimos que abortar la cumbre.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATALOGO DE RUTAS — "Ven conmigo al cerro" */}
        <section id="rutas" className="py-24 bg-black/80 backdrop-blur-lg relative z-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Expediciones 1 a 1</span>
                <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white">Ven conmigo al cerro.</h2>
              </div>
              <p className="text-slate-400 mt-4 md:mt-0 max-w-sm text-sm font-light">
                Yo armo la ruta, yo te guío y yo me aseguro de que volvamos sanos, salvos y con las mejores fotos.
              </p>
            </div>

            {routes.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
                <Tent className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
                <p className="text-slate-500">Próximamente abriré mis rutas privadas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {routes.map((route: any, i: number) => (
                  <div key={route.id} className={`group relative rounded-3xl overflow-hidden glass-panel flex flex-col ${i === 1 ? 'border-amber-500/30' : ''}`}>
                    {i === 1 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg z-20">
                        Mi Favorita
                      </div>
                    )}
                    <div className="aspect-[4/3] relative overflow-hidden bg-stone-800 flex items-center justify-center">
                      {route.image_url ? (
                        <img
                          src={route.image_url}
                          alt={route.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <Mountain className="w-16 h-16 text-amber-500/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                      <span className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">{route.category}</span>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                      <div>
                        <h3 className="font-editorial text-2xl font-bold text-white mb-2">{route.title}</h3>
                        <p className="text-sm text-slate-400 mb-6 font-light line-clamp-3">{route.description || 'Te acompaño paso a paso en esta aventura.'}</p>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center text-xs text-slate-300"><Clock className="w-4 h-4 mr-3 text-amber-500" /> {route.duration_text || `${route.duration_days} día${route.duration_days > 1 ? 's' : ''}`}</li>
                          <li className="flex items-center text-xs text-slate-300"><HeartPulse className="w-4 h-4 mr-3 text-amber-500" /> Nivel: {route.difficulty_level}</li>
                          <li className="flex items-center text-xs text-slate-300"><CheckCircle2 className="w-4 h-4 mr-3 text-amber-500" /> Máx. {route.max_pax} personas</li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Desde</span>
                          <span className="text-lg font-bold text-white">${Number(route.base_price).toLocaleString('es-CL')}</span>
                        </div>
                        <Link href={`/reservar?route=${route.id}`} className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
                          Reservar <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* COMUNIDAD Y PRÓXIMAS SALIDAS GRUPALES */}
        <section id="comunidad" className="py-24 bg-transparent relative z-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            
            <div className="glass-panel border-blue-500/20 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden mb-16">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="text-center relative z-10">
                <h2 className="font-editorial text-4xl font-bold text-white mb-4">Únete a la Tribu.</h2>
                <p className="text-slate-300 text-base font-light mb-8 max-w-xl mx-auto">
                  La montaña no se sube solo. Tenemos un grupo de WhatsApp gratuito donde organizamos salidas exprés, resolvemos dudas de equipo y compartimos fotos. ¡Todos son bienvenidos!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="#" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20">
                    <MessageCircle className="w-5 h-5" /> Entrar al WhatsApp
                  </a>
                  <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 glass-panel hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all">
                    <Camera className="w-5 h-5" /> Ver mi día a día
                  </a>
                </div>
              </div>
            </div>

            {/* AGENDA - SALIDAS GRUPALES */}
            <div className="text-center mb-12">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">Comunidad en Terreno</span>
              <h3 className="font-editorial text-3xl font-bold text-white mb-4">Próximas Salidas Grupales</h3>
            </div>

            {departures.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl mb-10">
                <p className="text-slate-500">No hay salidas grupales programadas por ahora. Entra al WhatsApp para enterarte antes que nadie.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {departures.map((dep: any) => {
                  const adv = dep.adventures_catalog;
                  const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                  return (
                    <div key={dep.id} className="glass-panel rounded-2xl p-6 flex items-center gap-5 hover:border-amber-500/30 transition-all">
                      <div className="text-center min-w-[56px]">
                        <p className="text-2xl font-black text-white">{new Date(dep.start_date).getDate()}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase">
                          {new Date(dep.start_date).toLocaleString('es-ES', { month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-white">{adv?.title || 'Expedición'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{spots} cupo{spots !== 1 ? 's' : ''} disponible{spots !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right flex flex-col justify-between items-end h-full">
                        <div>
                          <p className="font-black text-white">${Number(adv?.base_price).toLocaleString('es-CL')}</p>
                          <p className="text-[10px] text-slate-500 mb-2">por persona</p>
                        </div>
                        <Link href="/reservar" className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-white bg-amber-500/10 hover:bg-amber-500 px-3 py-1.5 rounded-md transition-colors">
                          Anotarme
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 bg-black/90 backdrop-blur-xl border-t border-white/5 text-center relative z-20">
          <div className="flex justify-center mb-6">
             <span className="font-editorial font-bold text-xl text-white">
                GAZ<span className="text-amber-500 italic">_Style</span>
              </span>
          </div>
          <p className="text-slate-500 text-xs font-light mb-2">Tu compañero de ruta. Creador de contenido y guía de montaña.</p>
          <p className="text-slate-600 text-[10px] tracking-widest uppercase">
            &copy; 2026 Gaz_Style. Todos los derechos reservados.
          </p>
        </footer>

      </div>
    </>
  );
}
