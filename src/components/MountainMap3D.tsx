'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { AtlasEntity } from '@/data/atlasDirectory';
import carbonTrailData from '@/data/carbon_clean_trail.json';
import 'leaflet/dist/leaflet.css';

interface MountainMap3DProps {
  entity: AtlasEntity;
  activeVariantIndex?: number;
  onSelectVariant?: (index: number) => void;
}

// Coordenadas verificadas de los hitos principales
const CARBON_WAYPOINTS = [
  { name: 'Acceso La Pirámide (Saint George)', lat: -33.3831, lng: -70.6012, type: 'start' },
  { name: 'Mirador La Pirámide', lat: -33.3822, lng: -70.6012, type: 'poi' },
  { name: 'Bosque Santiago', lat: -33.3816, lng: -70.6007, type: 'poi' },
  { name: 'Mirador El Litre (Sanhattan)', lat: -33.3805, lng: -70.5996, type: 'poi' },
  { name: 'Pique de Carbón', lat: -33.3781, lng: -70.5976, type: 'poi' },
  { name: 'Cumbre Cerro Carbón (1.365m)', lat: -33.3768, lng: -70.5964, type: 'summit' }
];

export default function MountainMap3D({
  entity,
  activeVariantIndex = 0,
  onSelectVariant
}: MountainMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'satelite' | 'topo'>('satelite');

  useEffect(() => {
    let isMounted = true;

    // Carga dinámica de Leaflet solo en el cliente
    import('leaflet').then((L) => {
      if (!isMounted || !containerRef.current) return;

      // Si ya existe instancia previa, destruirla
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 1. Obtener puntos de la ruta ([lat, lng] para Leaflet)
      const rawPoints: [number, number][] = Array.isArray(carbonTrailData) 
        ? (carbonTrailData as any).default || carbonTrailData 
        : [];
      
      const latLngs: [number, number][] = rawPoints.map(([lng, lat]) => [lat, lng]);

      // 2. Inicializar mapa Leaflet centrado en la ruta
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
      });

      mapInstanceRef.current = map;

      // 3. Capas de mapa
      const esriSatellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );

      const openTopo = L.tileLayer(
        'https://tile.opentopomap.org/{z}/{x}/{y}.png',
        { maxZoom: 17 }
      );

      layerGroupRef.current = { esriSatellite, openTopo };

      if (mapType === 'satelite') {
        esriSatellite.addTo(map);
      } else {
        openTopo.addTo(map);
      }

      // 4. Dibujar la traza del sendero (Línea roja / naranja brillante estilo Strava)
      if (latLngs.length > 0) {
        // Sombra negra para contraste extremo contra satélite
        L.polyline(latLngs, {
          color: '#000000',
          weight: 7,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(map);

        // Línea principal Strava Roja/Naranja
        L.polyline(latLngs, {
          color: '#FF2A00',
          weight: 4.5,
          opacity: 1,
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(map);

        // Núcleo brillante
        L.polyline(latLngs, {
          color: '#FFE600',
          weight: 1.5,
          opacity: 0.95,
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(map);

        // Ajustar vista automáticamente a todo el sendero
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }

      // 5. Marcadores tipo píldora HTML interactivos
      const createPillIcon = (label: string, bgClass: string, isPulse = false) => {
        return L.divIcon({
          className: 'custom-pill-marker',
          html: `
            <div style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: ${bgClass}; color: white; font-family: monospace; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); white-space: nowrap; cursor: pointer;">
              ${isPulse ? '<span style="width: 7px; height: 7px; border-radius: 50%; background: #4ade80;"></span>' : ''}
              <span>${label}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [30, 25]
        });
      };

      // Marcador Inicio
      const startPoint = CARBON_WAYPOINTS[0];
      L.marker([startPoint.lat, startPoint.lng], {
        icon: createPillIcon('🟢 INICIO', '#059669', true)
      })
      .bindPopup(`<b>${startPoint.name}</b><br>Punto de partida del sendero`)
      .addTo(map);

      // Marcador Mirador El Litre
      const litrePoint = CARBON_WAYPOINTS[3];
      L.marker([litrePoint.lat, litrePoint.lng], {
        icon: createPillIcon('📷 EL LITRE', '#7c3aed')
      })
      .bindPopup(`<b>${litrePoint.name}</b><br>Mirador panorámico a Sanhattan`)
      .addTo(map);

      // Marcador Cumbre
      const summitPoint = CARBON_WAYPOINTS[CARBON_WAYPOINTS.length - 1];
      L.marker([summitPoint.lat, summitPoint.lng], {
        icon: createPillIcon(`🚩 CUMBRE (${entity.altitude_msnm}M)`, '#dc2626')
      })
      .bindPopup(`<b>${summitPoint.name}</b><br>Vistas 360° a Santiago y Manquehue`)
      .addTo(map);

      // Reajuste de tamaño después del render
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [entity.slug]);

  // Manejo de cambio de capa Satélite / Topo
  const handleToggleLayer = (type: 'satelite' | 'topo') => {
    setMapType(type);
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const { esriSatellite, openTopo } = layerGroupRef.current;
    if (type === 'satelite') {
      mapInstanceRef.current.removeLayer(openTopo);
      mapInstanceRef.current.addLayer(esriSatellite);
    } else {
      mapInstanceRef.current.removeLayer(esriSatellite);
      mapInstanceRef.current.addLayer(openTopo);
    }
  };

  // Botón re-centrar
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const rawPoints: [number, number][] = Array.isArray(carbonTrailData) 
      ? (carbonTrailData as any).default || carbonTrailData 
      : [];
    if (rawPoints.length === 0) return;
    
    import('leaflet').then((L) => {
      const latLngs: [number, number][] = rawPoints.map(([lng, lat]) => [lat, lng]);
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    });
  };

  return (
    <div 
      className={`relative rounded-3xl overflow-hidden border border-white/15 bg-stone-950 transition-all duration-300 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'w-full'
      }`}
    >
      {/* ── BARRA SUPERIOR ── */}
      <div className="p-3 sm:p-4 flex items-center justify-between gap-2 bg-stone-900/90 border-b border-white/10 backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-white font-bold truncate">
            {entity.name} · {entity.altitude_msnm}M · RUTA INTERACTIVA
          </span>
        </div>

        {/* Controles de Capa y Pantalla Completa */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10">
            <button
              onClick={() => handleToggleLayer('satelite')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all ${
                mapType === 'satelite'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Satélite
            </button>
            <button
              onClick={() => handleToggleLayer('topo')}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all ${
                mapType === 'topo'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Topo
            </button>
          </div>

          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 200);
            }}
            className="p-1.5 rounded-xl bg-black/60 border border-white/10 text-white/70 hover:text-white transition-colors"
            title={isFullscreen ? 'Salir' : 'Pantalla Completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── CONTENEDOR DEL MAPA LEAFLET ── */}
      <div 
        ref={containerRef} 
        className={`w-full ${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-[380px] sm:h-[480px]'} bg-stone-950 relative z-0`}
      />

      {/* ── BOTONES DE INTERACCIÓN FLOTANTES (+ / - / RESET) ── */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-1.5">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-95"
          title="Acercar (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-95"
          title="Alejar (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-400 border border-white/15 backdrop-blur-md shadow-xl transition-all active:scale-95"
          title="Centrar ruta"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
