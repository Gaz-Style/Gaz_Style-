'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Mountain, 
  Compass, 
  ShieldCheck, 
  Radio, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ArrowUpRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080a0c] border-t border-white/10 text-white/70 relative z-10 pt-16 pb-12 mt-auto">
      {/* Glow ambiental superior sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FILA SUPERIOR: MARCA, MANIFIESTO Y CONTACTO DIRECTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          
          {/* Logo y Manifiesto (5 columnas) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Mountain className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-black uppercase text-white tracking-wider leading-none">
                  Santiago<span className="text-amber-400">Hiking</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mt-1">
                  by Gaz_Style
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed max-w-md font-light">
              Operador boutique de senderismo, travesías andinas y expediciones guiadas en la Región Metropolitana. Conquistamos las cumbres antes de que despierte la ciudad con guías certificados WFR, comunicación satelital Garmin InReach, linternas Petzl y fotografía profesional de alta resolución.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-3 py-1 rounded-full bg-stone-900 border border-white/10 text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                Santiago de Chile · Andes Centrales
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                ★ Seguridad WFR Certificada
              </span>
            </div>
          </div>

          {/* Enlaces de Contacto y Operaciones (3 columnas) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
              Base de Operaciones
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a 
                  href="https://wa.me/56957958467" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp: +56 9 5795 8467</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/56984021940" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>CEO Mario Cruz: +56 9 8402 1940</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:gazstylechile@gmail.com" 
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <Mail className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>gazstylechile@gmail.com</span>
                </a>
              </li>
              <li className="pt-2 text-[11px] font-mono text-stone-400">
                Horario de salidas: 05:00 AM (Alba) · 17:30 PM (Sunset)
              </li>
            </ul>
          </div>

          {/* CTA de Reserva Rápida (4 columnas) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-stone-900/60 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Próximas Expediciones
              </span>
              <h5 className="text-sm font-bold text-white mb-2">
                ¿Listo para desconectar de la ciudad?
              </h5>
              <p className="text-xs text-stone-300/80 leading-relaxed mb-4">
                Grupos reducidos boutique (máximo 8 a 12 aventureros). Reserva tu cupo antes de que se agoten las plazas del fin de semana.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/reservar"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold font-mono text-xs uppercase tracking-wider text-center transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Reservar Salida
              </Link>
              <Link
                href="/cumbres"
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-mono text-xs font-semibold text-center border border-white/10 transition-colors"
              >
                Ver Cumbres
              </Link>
            </div>
          </div>

        </div>

        {/* FILA MEDIA: ENLACES TÉCNICOS Y SEO GEOGRÁFICO DE MONTAÑA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs">
          
          {/* Col 1: Cumbres & Accesos */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>Cumbres de Santiago</span>
            </h4>
            <ul className="space-y-2 text-stone-300/80 font-mono text-[11px]">
              <li><Link href="/cumbres/cerro-manquehuito" className="hover:text-amber-400 transition-colors">Cerro Manquehuito (1.767m)</Link></li>
              <li><Link href="/cumbres/cerro-manquehue" className="hover:text-amber-400 transition-colors">Cerro Manquehue (2.042m)</Link></li>
              <li><Link href="/cumbres/cerro-carbon" className="hover:text-amber-400 transition-colors">Cerro Carbón (1.365m)</Link></li>
              <li><Link href="/cumbres/cerro-pochoco" className="hover:text-amber-400 transition-colors">Cerro Pochoco (1.804m)</Link></li>
              <li><Link href="/cumbres/cerro-provincia" className="hover:text-amber-400 transition-colors">Cerro Provincia (2.750m)</Link></li>
              <li><Link href="/cumbres" className="text-amber-400/90 font-bold hover:underline flex items-center gap-1 pt-1">Ver Todas las Cumbres & Accesos →</Link></li>
            </ul>
          </div>

          {/* Col 2: Formatos de Salida */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Formatos de Expedición</span>
            </h4>
            <ul className="space-y-2 text-stone-300/80 font-mono text-[11px]">
              <li><Link href="/reservar" className="hover:text-amber-400 transition-colors">Salidas Grupales Sunset</Link></li>
              <li><Link href="/desafios" className="hover:text-amber-400 transition-colors">Los Grandes Desafíos Andinos</Link></li>
              <li><Link href="/rutas/desafio-alba-manquehuito" className="hover:text-amber-400 transition-colors">Desafío Alba 5:00 AM</Link></li>
              <li><Link href="/desafios" className="hover:text-amber-400 transition-colors">Expedition High Mountain</Link></li>
              <li><Link href="/reservar" className="hover:text-amber-400 transition-colors">Expediciones Privadas & Boutique</Link></li>
              <li><Link href="/reservar" className="hover:text-amber-400 transition-colors">Calendario & Próximas Salidas</Link></li>
            </ul>
          </div>

          {/* Col 3: Seguridad & Protocolos */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seguridad & Montaña</span>
            </h4>
            <ul className="space-y-2 text-stone-300/80 font-mono text-[11px]">
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Primeros Auxilios WFR Certificados</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Comunicación Satelital & Radio VHF</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Mochila Obligatoria & Equipo</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Filosofía No Deje Rastro (NDR)</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Centro de Ayuda & FAQ</Link></li>
              <li><Link href="/check-in" className="hover:text-amber-400 transition-colors">Ficha Médica & Check-in</Link></li>
            </ul>
          </div>

          {/* Col 4: Macizos de Santiago */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Macizos & Sectores</span>
            </h4>
            <ul className="space-y-2 text-stone-300/80 font-mono text-[11px]">
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Cordón Manquehue · Lo Curro</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Sierra de Ramón · Precordillera</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Farellones & El Plomo</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Cajón del Maipo & Yeso</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Valle de Yerba Loca</Link></li>
              <li><Link href="/cumbres" className="hover:text-amber-400 transition-colors">Parque Cordillera Central</Link></li>
            </ul>
          </div>

        </div>

        {/* 4 PILARES TÉCNICOS SANTIAGO HIKING (BADGES HORIZONTALES) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-white/10 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-[11px]">Guías WFR</p>
              <p className="text-[10px] text-stone-400">Primeros auxilios remotos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Radio className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-[11px]">Garmin InReach</p>
              <p className="text-[10px] text-stone-400">SOS & rastreo satelital</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Camera className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-[11px]">Fotografía Pro</p>
              <p className="text-[10px] text-stone-400">Incluida en la cumbre</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-[11px]">Equipamiento Petzl</p>
              <p className="text-[10px] text-stone-400">Frontales & bastones</p>
            </div>
          </div>
        </div>

        {/* BARRA DE COPYRIGHT Y ACCESOS PRIVADOS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-stone-400">
          <p className="text-center sm:text-left">
            &copy; {currentYear} Santiago Hiking by Gaz_Style. Todos los derechos reservados. Operador de Turismo Aventura registrado en Chile.
          </p>

          <div className="flex items-center gap-6 text-stone-400">
            <Link href="/check-in" className="hover:text-amber-400 transition-colors">
              Portal Aventureros
            </Link>
            <Link href="/faq" className="hover:text-amber-400 transition-colors">
              Seguridad & FAQ
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
