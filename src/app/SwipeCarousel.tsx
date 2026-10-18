'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode[];
  peekWidth?: number; // px visibles de la tarjeta siguiente
  gap?: number;
}

export default function SwipeCarousel({ children, peekWidth = 24, gap = 12 }: Props) {
  const total = children.length;

  // Si hay 1 o 0 tarjetas, render directo sin loop
  if (total <= 1) {
    return (
      <div className="relative select-none">
        <div className="overflow-hidden">
          <div className="flex" style={{ gap: `${gap}px` }}>
            <div style={{ width: '100%' }}>{children[0] || null}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Array extendido con clones en extremos para loop infinito continuo ────
  // [Clon Último, Tarjeta 1, Tarjeta 2, ..., Tarjeta N, Clon Primero]
  const extendedSlides = [
    { key: 'clone-last', node: children[total - 1] },
    ...children.map((c, i) => ({ key: `slide-${i}`, node: c })),
    { key: 'clone-first', node: children[0] },
  ];

  // currentIndex arranca en 1 (que corresponde a children[0])
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // ── Drag / Swipe con Bloqueo de Eje Direccional (Axis Locking) ──────────────
  const startX = useRef(0);
  const startY = useRef(0);
  const deltaX = useRef(0);
  const isLocked = useRef<'x' | 'y' | null>(null);
  const dragging = useRef(false);
  const [live, setLive] = useState(0);

  // Re-activar transiciones tras salto invisible de teletransporte
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Teletransporte invisible sin animación al llegar a los clones
  const handleTransitionEnd = useCallback(() => {
    if (currentIndex === 0) {
      // Estábamos en el clon de la última -> saltar a la última real
      setIsTransitioning(false);
      setCurrentIndex(total);
    } else if (currentIndex === total + 1) {
      // Estábamos en el clon de la primera -> saltar a la primera real
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  }, [currentIndex, total]);

  const onDragEnd = useCallback(() => {
    if (!dragging.current && isLocked.current !== 'x') {
      isLocked.current = null;
      return;
    }
    dragging.current = false;
    const threshold = 35; // Umbral ágil y cómodo
    if (deltaX.current < -threshold) {
      setIsTransitioning(true);
      setCurrentIndex(c => c + 1);
    } else if (deltaX.current > threshold) {
      setIsTransitioning(true);
      setCurrentIndex(c => c - 1);
    }
    setLive(0);
    deltaX.current = 0;
    isLocked.current = null;
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    deltaX.current = 0;
    isLocked.current = null;
    dragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Bloqueo de eje direccional tras los primeros 6px de movimiento
    if (!isLocked.current) {
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      if (absX > 6 || absY > 6) {
        if (absX >= absY) {
          isLocked.current = 'x'; // Swipe horizontal: capturar gesto
        } else {
          isLocked.current = 'y'; // Scroll vertical: soltar carrusel
          dragging.current = false;
          setLive(0);
          return;
        }
      } else {
        return;
      }
    }

    if (isLocked.current === 'x') {
      deltaX.current = diffX;
      setLive(diffX);
    }
  };

  const onTouchEnd = () => onDragEnd();

  // Mouse (Desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    deltaX.current = 0;
    isLocked.current = 'x';
    dragging.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || isLocked.current !== 'x') return;
    deltaX.current = e.clientX - startX.current;
    setLive(deltaX.current);
  };

  const onMouseUp = () => onDragEnd();
  const onMouseLeave = () => { if (dragging.current) onDragEnd(); };

  // Teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsTransitioning(true);
        setCurrentIndex(c => c + 1);
      }
      if (e.key === 'ArrowLeft') {
        setIsTransitioning(true);
        setCurrentIndex(c => c - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Medición de contenedor ágil para cálculo exacto ───────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Cálculo de ancho y offset del track (Instantáneo con fallback en CSS) ─────
  const slideWidthStyle = containerWidth > 0 
    ? `${Math.max(280, containerWidth - peekWidth)}px` 
    : `calc(100% - ${peekWidth}px)`;
  
  const step = containerWidth > 0 ? (containerWidth - peekWidth + gap) : 340;
  const trackOffsetPx = -(currentIndex * step) + live;
  const trackTransform = `translateX(${trackOffsetPx}px)`;

  // Índice real activo para los puntitos (Dots)
  const activeDot = (currentIndex - 1 + total) % total;

  return (
    <div className="relative select-none">
      {/* Track */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTransitionEnd={handleTransitionEnd}
        style={{
          cursor: dragging.current ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          WebkitTouchCallout: 'none',
        }}
      >
        <div
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            gap: `${gap}px`,
            transform: trackTransform,
            transition: (dragging.current || !isTransitioning) 
              ? 'none' 
              : 'transform 0.38s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }}
        >
          {extendedSlides.map((slide, i) => {
            const isCurrent = i === currentIndex;
            return (
              <div
                key={slide.key}
                style={{
                  minWidth: slideWidthStyle,
                  width: slideWidthStyle,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'stretch',
                  opacity: isCurrent ? 1 : 0.85,
                  transition: 'opacity 0.25s ease',
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                {slide.node}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flechas circulares con loop infinito activo (estilo MBA) */}
      <button
        type="button"
        onClick={() => {
          setIsTransitioning(true);
          setCurrentIndex(c => c - 1);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg active:scale-95"
        style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.20)',
        }}
        aria-label="Anterior"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>

      <button
        type="button"
        onClick={() => {
          setIsTransitioning(true);
          setCurrentIndex(c => c + 1);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg active:scale-95"
        style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.20)',
        }}
        aria-label="Siguiente"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dots (Sincronizados en tiempo real con activeDot) */}
      <div className="flex justify-center gap-1.5 mt-4">
        {children.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(i + 1);
            }}
            className="transition-all duration-300 rounded-full cursor-pointer"
            style={{
              width: i === activeDot ? '22px' : '6px',
              height: '6px',
              backgroundColor: i === activeDot ? '#f59e0b' : 'rgba(255,255,255,0.25)',
            }}
            aria-label={`Ir a tarjeta ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
