'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Props {
  fallbackUrl?: string;
}

export default function SwipeBackHandler({ fallbackUrl = '/#rutas' }: Props) {
  const router = useRouter();
  const [dragX, setDragX] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const axisLocked = useRef<'x' | 'y' | null>(null);

  const THRESHOLD = 85; // Distancia en px para activar el retorno

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Ignorar toques multitouch
      if (e.touches.length > 1) return;

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      isDragging.current = true;
      axisLocked.current = null;
      setDragX(0);
      setIsReady(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      // Bloqueo de eje direccional en los primeros 10px
      if (axisLocked.current === null) {
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
            axisLocked.current = 'x';
          } else {
            axisLocked.current = 'y';
            isDragging.current = false;
            setDragX(0);
            return;
          }
        } else {
          return;
        }
      }

      // Si el movimiento es vertical, dejar que el navegador scrollee naturalmente
      if (axisLocked.current === 'y') return;

      // Movimiento horizontal hacia la derecha (swipe back)
      if (axisLocked.current === 'x' && dx > 0) {
        // Resistencia elástica a medida que se estira
        const clamped = Math.min(dx * 0.75, 140);
        setDragX(clamped);
        setIsReady(clamped >= THRESHOLD * 0.75);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current || axisLocked.current !== 'x') {
        isDragging.current = false;
        axisLocked.current = null;
        setDragX(0);
        setIsReady(false);
        return;
      }

      if (isReady || dragX >= THRESHOLD * 0.75) {
        // Disparar navegación hacia atrás
        setDragX(0);
        setIsReady(false);
        isDragging.current = false;
        axisLocked.current = null;

        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      } else {
        // Animación de regreso al borde
        setDragX(0);
        setIsReady(false);
        isDragging.current = false;
        axisLocked.current = null;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [router, fallbackUrl, isReady, dragX]);

  if (dragX <= 6) return null;

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${Math.max(0, dragX - 35)}px, -50%, 0)`,
      }}
    >
      <div 
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-r-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-150 ${
          isReady 
            ? 'bg-amber-400 text-stone-950 scale-105 border border-amber-300' 
            : 'bg-stone-900/90 text-white/90 border border-white/20'
        }`}
      >
        <ArrowLeft className={`w-4 h-4 transition-transform ${isReady ? 'scale-110 text-stone-950 -translate-x-0.5' : 'text-amber-400'}`} />
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
          {isReady ? 'Soltar para volver' : 'Desliza para volver'}
        </span>
      </div>
    </div>
  );
}
