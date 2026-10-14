import React from 'react';
import { CloudSun, Wind, Sunrise, Sunset, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MountainWeather } from '@/lib/weather';

interface MountainWeatherWidgetProps {
  weather: MountainWeather;
  locationName?: string;
  elevationText?: string;
}

export default function MountainWeatherWidget({
  weather,
  locationName = 'Cumbre & Arista',
  elevationText,
}: MountainWeatherWidgetProps) {
  return (
    <div 
      className="rounded-2xl p-6 backdrop-blur-xl transition-all"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.04)', 
        border: '1px solid rgba(255, 255, 255, 0.09)' 
      }}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block">
              Ventana Climática en Vivo
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">
              {locationName} {elevationText && <span className="text-white/40 font-mono text-xs">({elevationText})</span>}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold"
             style={{ 
               backgroundColor: weather.isFavorable ? 'rgba(52, 211, 153, 0.12)' : 'rgba(245, 158, 11, 0.15)',
               border: `1px solid ${weather.isFavorable ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
               color: weather.isFavorable ? '#34d399' : '#fbbf24'
             }}>
          {weather.isFavorable ? <ShieldCheck className="w-3 h-3 shrink-0" /> : <AlertTriangle className="w-3 h-3 shrink-0" />}
          <span>{weather.isFavorable ? 'Óptimo' : 'Atención'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Temperatura */}
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-0.5">Temp. Cumbre</p>
          <p className="text-xl font-black font-mono text-white">{weather.temperature}°C</p>
          <p className="text-[10px] font-mono text-white/40">Sens. {weather.apparentTemperature}°C</p>
        </div>

        {/* Viento */}
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-0.5 flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-amber-400/80" /> Viento
          </p>
          <p className="text-xl font-black font-mono text-white">{weather.windSpeed} <span className="text-xs text-white/50">km/h</span></p>
          <p className="text-[10px] font-mono text-white/40">Ráfagas {weather.windGusts}</p>
        </div>

        {/* Amanecer */}
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-0.5 flex items-center justify-center gap-1">
            <Sunrise className="w-3 h-3 text-amber-400" /> Alba
          </p>
          <p className="text-lg font-black font-mono text-amber-300">{weather.sunrise}</p>
          <p className="text-[10px] font-mono text-white/40">Hora mágica</p>
        </div>

        {/* Puesta de Sol */}
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-0.5 flex items-center justify-center gap-1">
            <Sunset className="w-3 h-3 text-rose-400" /> Ocaso
          </p>
          <p className="text-lg font-black font-mono text-white">{weather.sunset}</p>
          <p className="text-[10px] font-mono text-white/40">UV Máx {weather.uvIndex}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/45 pt-2 border-t border-white/5">
        <span>{weather.statusText}</span>
        <span className="text-[9px] uppercase tracking-wider text-white/30">Open-Meteo High-Resolution</span>
      </div>
    </div>
  );
}
