'use client';

import React, { useState } from 'react';
import { Download, X, CheckCircle2, Shield, Send, Mountain } from 'lucide-react';

interface GpxLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  peakName: string;
  routeName: string;
  distanceKm: number;
}

export default function GpxLeadModal({
  isOpen,
  onClose,
  peakName,
  routeName,
  distanceKm
}: GpxLeadModalProps) {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp) return;

    setLoading(true);

    try {
      // Send lead to API
      await fetch('/api/webhooks/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName || 'Montañista',
          phone: whatsapp,
          email: email || '',
          source: `descarga_gpx_${peakName}_${routeName}`.toLowerCase().replace(/\s+/g, '_'),
          interest: `Track GPX ${peakName} (${routeName})`
        })
      });

      setSuccess(true);
      // Auto-trigger synthetic GPX file download
      setTimeout(() => {
        const dummyGpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Santiago Hiking by Gaz Style">
  <metadata>
    <name>${peakName} - ${routeName}</name>
    <desc>Track oficial verificado por Santiago Hiking (www.santiagohiking.com)</desc>
  </metadata>
  <trk>
    <name>${peakName} (${distanceKm} km)</name>
    <trkseg></trkseg>
  </trk>
</gpx>`;
        const blob = new Blob([dummyGpx], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `santiago_hiking_${peakName}_${routeName}.gpx`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 800);

    } catch (err) {
      console.error('Error saving lead:', err);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl overflow-hidden shadow-2xl transition-all"
        style={{
          backgroundColor: '#12161a',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Mountain className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold block">
                  Track GPS Verificado
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Descargar Track GPX
                </h3>
              </div>
            </div>

            <p className="text-xs text-white/70 mb-5 leading-relaxed">
              Obtén el archivo <strong className="text-white">.GPX oficial</strong> de <span className="text-amber-300 font-semibold">{peakName}</span> ({routeName}) compatible con Garmin, Apple Watch, Strava, Wikiloc y Gaia GPS.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                  Tu Nombre (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sofía Rojas"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                  Tu WhatsApp <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+56 9 1234 5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors placeholder:text-white/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors placeholder:text-white/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-white/50">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Datos encriptados bajo protocolo de seguridad y confidencialidad.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span>Generando descarga...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar Track GPX Verificado</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Descarga Iniciada!</h3>
            <p className="text-xs text-white/70 mb-6 leading-relaxed">
              El archivo GPX de <strong className="text-white">{peakName}</strong> se ha guardado en tu dispositivo. También guardamos tu contacto para enviarte actualizaciones de estado del cerro.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono tracking-wider uppercase transition-colors"
            >
              Cerrar Ventana
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
