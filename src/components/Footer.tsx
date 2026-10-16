'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer 
      className="pt-16 pb-12 font-mono text-xs relative z-20 mt-auto" 
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.10)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Columna Marca */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logotipo blanco.png"
                alt="Santiago Hiking"
                width={340}
                height={80}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white/50 text-xs font-sans font-light leading-relaxed">
              Expediciones en los Andes chilenos, seguridad en montaña y cumbres sobre el valle de Santiago. Guiado por Gaz.
            </p>
            <p className="text-[11px] text-white/30 font-mono">
              CORDILLERA DE LOS ANDES · SANTIAGO DE CHILE <br />
              LAT -33.35° S · LON -70.51° W <br />
              <span className="text-amber-400/80 font-bold">PRESTADOR TURÍSTICO REGISTRADO SERNATUR</span> · CERTIFICACIÓN WFR / SOS
            </p>
          </div>

          {/* Columna Cumbres & Rutas */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Cumbres & Rutas</p>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/cumbres/cerro-manquehuito" className="hover:text-amber-400 transition-colors">Cerro Manquehuito</Link></li>
              <li><Link href="/cumbres/cerro-manquehue" className="hover:text-amber-400 transition-colors">Cerro Manquehue</Link></li>
              <li><Link href="/cumbres/cerro-carbon" className="hover:text-amber-400 transition-colors">Cerro Carbón</Link></li>
              <li><Link href="/cumbres/cerro-pochoco" className="hover:text-amber-400 transition-colors">Cerro Pochoco</Link></li>
              <li><Link href="/cumbres/cerro-provincia" className="hover:text-amber-400 transition-colors">Cerro Provincia</Link></li>
              <li><Link href="/cumbres" className="text-amber-400 font-bold hover:underline pt-1 inline-block">Ver Explorador Completo →</Link></li>
            </ul>
          </div>

          {/* Columna Expediciones & Desafíos */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Expediciones</p>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/desafios/desafio-5am" className="hover:text-amber-400 transition-colors">Desafío 5:00 AM</Link></li>
              <li><Link href="/desafios/triple-corona" className="hover:text-amber-400 transition-colors">Triple Corona Santiago</Link></li>
              <li><Link href="/desafios/sierra-de-ramon" className="hover:text-amber-400 transition-colors">Sierra de Ramón (3.250m)</Link></li>
              <li><Link href="/desafios/desbloqueando-santiago" className="hover:text-amber-400 transition-colors">Desbloqueando Santiago</Link></li>
              <li><Link href="/reservar" className="hover:text-amber-400 transition-colors">Calendario de Salidas</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Protocolo WFR & Seguridad</Link></li>
            </ul>
          </div>

          {/* Columna Contacto */}
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Contacto Directo</p>
            <ul className="space-y-2 text-xs text-white/70">
              <li>WhatsApp Oficial: <a href="https://wa.me/56957958467" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-semibold">+56 9 5795 8467</a></li>
              <li>Instagram: <a href="https://instagram.com/santiagohiking" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-semibold">@santiagohiking</a></li>
              <li>Email: <a href="mailto:gazstylechile@gmail.com" className="text-amber-400 hover:underline font-semibold">gazstylechile@gmail.com</a></li>
              <li>Asistente IA: Activo 24/7 en WhatsApp</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/35">
          <p>&copy; 2026 SANTIAGO HIKING. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-stone-300 transition-colors">FAQ & Montaña</Link>
            <Link href="/reservar" className="hover:text-stone-300 transition-colors">Checkout</Link>
            <Link href="/admin" className="hover:text-stone-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
