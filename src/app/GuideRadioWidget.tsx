'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function GuideRadioWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    '¡Hola Gaz! Te escribo desde la web de Santiago Hiking, me gustaría consultar por las próximas salidas y rutas.'
  );

  const isHoveredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isChatOpen) {
        setIsVisible(false);
      }
    }, 3000);
  };

  useEffect(() => {
    setMounted(true);

    // Al montar en la página, mostrar e iniciar temporizador de 3 segundos
    setIsVisible(true);
    resetTimer();

    const handleScroll = () => {
      // Si el chat está abierto o el mouse está encima, mantener siempre visible
      if (isChatOpen || isHoveredRef.current) return;

      // Al escrolear, emerge la pestaña
      setIsVisible(true);
      resetTimer();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isChatOpen]);

  if (!mounted) return null;

  // No mostrar en rutas administrativas o de control interno
  if (
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/portal-aventureros') || 
    pathname?.startsWith('/check-in')
  ) {
    return null;
  }

  const whatsappUrl = `https://wa.me/56957958467?text=${encodeURIComponent(customMessage)}`;

  return (
    <>
      {/* Fondo oscuro traslúcido en móviles cuando el chat está abierto */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 sm:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Tarjeta Simulación de Chat estilo WhatsApp */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 sm:w-88 max-w-sm bg-white rounded-2xl shadow-[-8px_16px_50px_rgba(0,0,0,0.5)] border border-neutral-200/90 overflow-hidden text-neutral-900"
          >
            {/* Header del Chat estilo WhatsApp Oficial */}
            <div className="bg-[#25D366] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm select-none">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-stone-900 border-2 border-white/80 flex items-center justify-center p-1 shadow-md shrink-0 overflow-hidden">
                  <img src="/logo sh.png" alt="Santiago Hiking" className="w-full h-full object-contain" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                    Santiago Hiking
                  </h4>
                  <p className="text-[11px] text-white/90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Guía Gaz · En línea en cordada
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Chat con burbuja simulada */}
            <div className="p-4 bg-[#ECE5DD]/70 text-xs space-y-3 max-h-[62vh] overflow-y-auto">
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[92%] border border-neutral-100 text-neutral-800 leading-relaxed space-y-1.5">
                <p className="font-semibold text-neutral-950">
                  ¡Hola aventurero! 🏔️ Soy Gaz.
                </p>
                <p>
                  ¿Tienes dudas sobre los niveles de dificultad, próximas salidas a la cordillera o expediciones de Hike & Fly?
                </p>
                <p className="text-neutral-600">
                  Conversemos directamente y coordinamos la mejor cordada para ti.
                </p>
                <div className="flex items-center justify-end gap-1 pt-1 text-[9px] text-neutral-400 font-mono">
                  <span>Ahora</span>
                  {/* Doble check azul WhatsApp */}
                  <svg viewBox="0 0 16 15" width="13" height="12" fill="none" className="text-sky-500">
                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.376.13.507-.023l6.248-8.083a.416.416 0 0 0-.063-.487z" fill="currentColor"/>
                    <path d="M11.51 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.166 9.879a.32.32 0 0 1-.484.033l-2.67-2.426a.418.418 0 0 0-.542.036l-.378.483a.418.418 0 0 0 .036.541l3.52 3.197c.143.14.376.13.507-.023l6.42-8.304a.416.416 0 0 0-.064-.487z" fill="currentColor"/>
                  </svg>
                </div>
              </div>

              {/* Botones de sugerencias rápidas */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-neutral-500 font-medium px-1">Consultas frecuentes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Próximas salidas 🏔️', msg: '¡Hola Gaz! Me gustaría consultar por las próximas salidas confirmadas a la cordillera.' },
                    { label: 'Hike & Fly 🪂', msg: '¡Hola Gaz! Quisiera información y requisitos para los vuelos Hike & Fly biplaza.' },
                    { label: 'Nivel y dificultad 🥾', msg: '¡Hola Gaz! Quisiera saber qué ruta me recomiendas según mi experiencia física actual.' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setCustomMessage(item.msg)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border shadow-xs transition-all cursor-pointer ${
                        customMessage === item.msg 
                          ? 'bg-[#25D366] text-white border-[#25D366] font-semibold' 
                          : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer con Botón a WhatsApp Oficial */}
            <div className="p-3 bg-white border-t border-neutral-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 sm:py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chatear por WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pestaña lateral derecha: "S.O.S" */}
      <aside 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transform transition-all ${
          isVisible 
            ? 'duration-350 ease-out translate-x-0 opacity-100 pointer-events-auto' 
            : 'duration-1000 ease-in-out translate-x-full opacity-0 pointer-events-none'
        }`}
        aria-label="S.O.S / Contactar Guía"
      >
        <button
          type="button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          onMouseEnter={() => {
            isHoveredRef.current = true;
            setIsVisible(true);
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            resetTimer();
          }}
          title="S.O.S - Contactar a Gaz por WhatsApp"
          className={`group flex flex-col items-center justify-center gap-3 sm:gap-3.5 py-7 px-1.5 sm:py-9 sm:px-2 min-h-[140px] sm:min-h-[160px] rounded-l-xl shadow-[-2px_0_15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-x-0.5 active:scale-95 cursor-pointer select-none border-t border-l border-b border-white/10 ${
            isChatOpen ? 'ring-1 ring-[#25D366]/60' : ''
          }`}
          style={{
            backgroundColor: isChatOpen ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRight: 'none',
          }}
        >
          {/* Texto Vertical S.O.S */}
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] font-extrabold text-white/95 group-hover:text-amber-300 transition-colors uppercase py-1">
            S.O.S
          </span>

          {/* Ícono Oficial de WhatsApp sin brillo ni luz */}
          <div className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] shrink-0" />
          </div>
        </button>
      </aside>
    </>
  );
}
