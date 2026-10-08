"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Mountain, Coffee, ShieldCheck, MapPin, Clock, Camera, 
  CarFront, Check, ChevronDown, Ticket, HeartPulse, Compass, Home, Map as MapIcon, Calendar
} from "lucide-react";

export default function ExperienciaMontanaPage() {
  const [selectedRoute, setSelectedRoute] = useState("sunset");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rut: "",
    experience: "principiante"
  });

  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2803&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
          
          .gaz-premium-body {
            background-color: #050505;
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

            <a href="#reservar" className="hidden md:inline-flex bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
              Reservar Aventura
            </a>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          {/* Background Image Carousel / Overlay */}
          <div className="absolute inset-0 z-0 bg-stone-950">
            {heroImages.map((src, idx) => (
              <img 
                key={src}
                src={src} 
                alt="Aventura en la cordillera" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out scale-105 ${
                  idx === currentImage ? 'opacity-80' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium tracking-widest uppercase text-amber-400">Turismo de Montaña Premium</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-editorial font-bold text-white leading-tight mb-6">
              La montaña, <br />
              <span className="italic font-light text-slate-300">vivida con </span>
              <span className="gold-gradient-text">estilo.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Aventura, desconexión y vitalidad en la montaña. 
              Un liderazgo enérgico que te empuja a salir de la rutina, combinando lo salvaje de la naturaleza con una mentalidad de excelencia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#rutas" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105">
                Explorar Rutas
              </a>
              <a href="#filosofia" className="w-full sm:w-auto glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all">
                Nuestra Filosofía
              </a>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION: LA FILOSOFÍA GAZ_STYLE */}
        <section id="filosofia" className="py-24 bg-stone-950 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white mb-6">Aventura y Desconexión Real.</h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-light">
                No vendemos tours, compartimos un estilo de vida. Creemos en el magnetismo orgánico: si nuestra vitalidad y mentalidad de superación te inspiran, sentirás la necesidad genuina de vivirlo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Prop 1 */}
              <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <HeartPulse className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Liderazgo Inspirador</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Un guiado enérgico, directo y motivador. No solo caminamos, te impulsamos a salir de tu zona de confort fomentando una mentalidad de excelencia y superación personal.
                </p>
              </div>

              {/* Prop 2 */}
              <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">El Toque "Style"</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  El contraste perfecto entre lo salvaje de la naturaleza y el cuidado minucioso de los detalles. Desde la calidad del trato hasta los pequeños elementos de la experiencia.
                </p>
              </div>

              {/* Prop 3 */}
              <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <Mountain className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Aventura Segura</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  La montaña es el escenario para desconectar de la rutina. Entregamos un desafío físico real pero respaldado con certificación WFR, para que la aventura fluya con total seguridad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CATALOGO DE RUTAS */}
        <section id="rutas" className="py-24 bg-stone-900 relative z-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">El Catálogo</span>
                <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white">Micro-aventuras a tu medida.</h2>
              </div>
              <p className="text-slate-400 mt-4 md:mt-0 max-w-sm text-sm font-light">
                Selecciona la experiencia que mejor se adapte a tu nivel y tiempo disponible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* RUTA 1 */}
              <div className="group relative rounded-3xl overflow-hidden glass-panel flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" 
                    alt="Sunset Trek" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">After Office</span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-white mb-2">Sunset Treks</h3>
                    <p className="text-sm text-slate-400 mb-6 font-light">Ascenso al Manquehuito o Pochoco para ver el atardecer cayendo sobre Santiago. Ideal para liberar el estrés laboral.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-xs text-slate-300"><Clock className="w-4 h-4 mr-3 text-amber-500" /> 3-4 horas totales</li>
                      <li className="flex items-center text-xs text-slate-300"><HeartPulse className="w-4 h-4 mr-3 text-amber-500" /> Nivel: Principiante / Medio</li>
                      <li className="flex items-center text-xs text-slate-300"><Compass className="w-4 h-4 mr-3 text-amber-500" /> Ración de marcha local al atardecer</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Desde</span>
                      <span className="text-lg font-bold text-white">$25.000</span>
                    </div>
                    <button onClick={() => { setSelectedRoute("sunset"); document.getElementById('reservar')?.scrollIntoView({behavior: "smooth"})}} className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                      Reservar &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* RUTA 2 */}
              <div className="group relative rounded-3xl overflow-hidden glass-panel border-amber-500/30 flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg z-20">
                  La Más Solicitada
                </div>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?auto=format&fit=crop&w=800&q=80" 
                    alt="Full Day Escapade" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">Fin de Semana</span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-white mb-2">Full Day Escapades</h3>
                    <p className="text-sm text-slate-400 mb-6 font-light">Exploración profunda en Cajón del Maipo (Ej: Mirador de Cóndores). Foco en wellness, respiración y educación ambiental.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-xs text-slate-300"><Clock className="w-4 h-4 mr-3 text-amber-500" /> 6-8 horas totales</li>
                      <li className="flex items-center text-xs text-slate-300"><HeartPulse className="w-4 h-4 mr-3 text-amber-500" /> Nivel: Medio</li>
                      <li className="flex items-center text-xs text-slate-300"><Ticket className="w-4 h-4 mr-3 text-amber-500" /> Cierre gastronómico local</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Desde</span>
                      <span className="text-lg font-bold text-white">$45.000</span>
                    </div>
                    <button onClick={() => { setSelectedRoute("fullday"); document.getElementById('reservar')?.scrollIntoView({behavior: "smooth"})}} className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                      Reservar &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* RUTA 3 */}
              <div className="group relative rounded-3xl overflow-hidden glass-panel flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1546850259-219597a701fa?auto=format&fit=crop&w=800&q=80" 
                    alt="Private VIP Hikes" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">Exclusivo</span>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-white mb-2">Private VIP Hikes</h3>
                    <p className="text-sm text-slate-400 mb-6 font-light">Diseñado para grupos cerrados, turistas internacionales o dinámicas corporativas (Team Building) de alto estándar.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center text-xs text-slate-300"><Clock className="w-4 h-4 mr-3 text-amber-500" /> Horario a convenir</li>
                      <li className="flex items-center text-xs text-slate-300"><MapPin className="w-4 h-4 mr-3 text-amber-500" /> Ruta personalizada</li>
                      <li className="flex items-center text-xs text-slate-300"><Compass className="w-4 h-4 mr-3 text-amber-500" /> Ritmo y enfoque exclusivo para tu grupo</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">A cotizar</span>
                      <span className="text-lg font-bold text-white">Custom</span>
                    </div>
                    <button onClick={() => { setSelectedRoute("vip"); document.getElementById('reservar')?.scrollIntoView({behavior: "smooth"})}} className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                      Cotizar &rarr;
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* RESERVATION / CHECKOUT SECTION */}
        <section id="reservar" className="py-24 bg-stone-950 relative z-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="glass-panel rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="text-center mb-12">
                <h2 className="font-editorial text-4xl font-bold text-white mb-4">Asegura tu lugar en la montaña.</h2>
                <p className="text-slate-400 text-sm font-light">Completa tu perfil para que podamos personalizar la experiencia. Transacción segura 100% digital.</p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Route */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Experiencia Seleccionada</label>
                    <div className="relative">
                      <select 
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                      >
                        <option value="sunset">Sunset Treks (After Office) - $25.000 CLP</option>
                        <option value="fullday">Full Day Escapades (Fin de Semana) - $45.000 CLP</option>
                        <option value="vip">Private VIP Hikes (A Cotizar)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Laura Silva"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">RUT (Seguro Obligatorio)</label>
                    <input
                      type="text"
                      name="rut"
                      required
                      value={formData.rut}
                      onChange={handleInputChange}
                      placeholder="12.345.678-9"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="laura@ejemplo.cl"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+56 9 1234 5678"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  
                  {/* Perfilamiento */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Nivel de Experiencia Física</label>
                    <div className="relative">
                      <select 
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                      >
                        <option value="principiante">Primera vez / Principiante (Quiero ir a mi ritmo)</option>
                        <option value="medio">Medio (Hago deporte ocasionalmente)</option>
                        <option value="avanzado">Avanzado (Subo cerros regularmente)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 italic">* Utilizamos este dato para perfilar los grupos y asegurar que nadie se sienta presionado.</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest text-sm py-5 rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    Proceder al Pago Seguro
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Transacción encriptada. Próximamente integración directa con Webpay/Stripe.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 bg-[#050505] border-t border-white/5 text-center relative z-20">
          <div className="flex justify-center mb-6">
             <span className="font-editorial font-bold text-xl text-white">
                GAZ<span className="text-amber-500 italic">_Style</span>
              </span>
          </div>
          <p className="text-slate-500 text-xs font-light mb-2">La experiencia outdoor enfocada en la desconexión real, seguridad y bienestar.</p>
          <p className="text-slate-600 text-[10px] tracking-widest uppercase">
            &copy; 2026 Gaz_Style Turismo Spa.
          </p>
        </footer>

        {/* MOCKUP MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="glass-panel border-amber-500/50 p-10 rounded-3xl max-w-md w-full text-center relative">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-editorial text-3xl font-bold text-white mb-2">Reserva Iniciada</h3>
              <p className="text-sm text-slate-300 font-light mb-8">
                Hola {formData.name.split(' ')[0] || 'Aventurero'}, hemos registrado tus datos. En la versión final, esto te redigirá a Webpay/Stripe para completar el pago de tu {selectedRoute === 'sunset' ? 'Sunset Trek' : selectedRoute === 'fullday' ? 'Full Day' : 'VIP Hike'}.
              </p>
              <button onClick={closeModal} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                Cerrar Prueba
              </button>
            </div>
          </div>
        )}

        {/* APP BOTTOM NAVIGATION (MOBILE ONLY) */}
        <nav className="fixed bottom-0 left-0 right-0 w-full glass-panel border-t border-white/10 z-50 md:hidden bg-stone-950/95 pb-safe">
          <div className="flex justify-around items-center h-16 px-4">
            <a href="#" className="flex flex-col items-center justify-center w-full text-amber-500">
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
            </a>
            <a href="#rutas" className="flex flex-col items-center justify-center w-full text-slate-400 hover:text-amber-500 transition-colors">
              <MapIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Rutas</span>
            </a>
            <a href="#reservar" className="flex flex-col items-center justify-center w-full text-slate-400 hover:text-amber-500 transition-colors">
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Reservar</span>
            </a>
          </div>
        </nav>

      </div>
    </>
  );
}
