'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode[];
  peekWidth?: number; // px visibles de la tarjeta siguiente
  gap?: number;
}

export default function SwipeCarousel({ children, peekWidth = 24, gap = 12 }: Props) {
  const [current, setCurrent] = useState(0);
  const total = children.length;

  // ── Drag / Swipe ─────────────────────────────────────────────────────────
  const startX   = useRef(0);
  const deltaX   = useRef(0);
  const dragging = useRef(false);
  const [live, setLive] = useState(0); // offset en vivo mientras arrastra

  const onDragStart = useCallback((clientX: number) => {
    startX.current = clientX;
    deltaX.current = 0;
    dragging.current = true;
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    if (!dragging.current) return;
    deltaX.current = clientX - startX.current;
    setLive(deltaX.current);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const threshold = 50;
    if (deltaX.current < -threshold && current < total - 1) setCurrent(c => c + 1);
    else if (deltaX.current > threshold && current > 0) setCurrent(c => c - 1);
    setLive(0);
  }, [current, total]);

  // Touch
  const onTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => onDragMove(e.touches[0].clientX);
  const onTouchEnd   = () => onDragEnd();

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => onDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => onDragMove(e.clientX);
  const onMouseUp   = () => onDragEnd();
  const onMouseLeave = () => { if (dragging.current) onDragEnd(); };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && current < total - 1) setCurrent(c => c + 1);
      if (e.key === 'ArrowLeft'  && current > 0)        setCurrent(c => c - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, total]);

  // ── Cálculo de transformada ───────────────────────────────────────────────
  // Cada slide ocupa 100% - peek - gap. El track se mueve según el índice actual
  const slideWidth  = `calc(100% - ${peekWidth}px)`;
  const trackOffset = `calc(-${current} * (100% - ${peekWidth}px + ${gap}px) + ${live}px)`;

  return (
    <div className="relative select-none">
      {/* Track */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
      >
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${trackOffset})`,
            transition: dragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              style={{
                minWidth: slideWidth,
                width: slideWidth,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'stretch',
                opacity: i === current ? 1 : 0.45,
                transition: 'opacity 0.35s ease',
                pointerEvents: i === current ? 'auto' : 'none',
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Flechas desktop */}
      {current > 0 && (
        <button
          onClick={() => setCurrent(c => c - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden sm:flex"
          style={{
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={() => setCurrent(c => c + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden sm:flex"
          style={{
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width:  i === current ? '20px' : '6px',
              height: '6px',
              backgroundColor: i === current ? '#f59e0b' : 'rgba(255,255,255,0.25)',
            }}
            aria-label={`Ir a tarjeta ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
