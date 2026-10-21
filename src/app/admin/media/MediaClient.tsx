'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Image as ImageIcon, 
  Zap, 
  Check, 
  RefreshCw, 
  AlertCircle,
  FileText,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';

interface UploadedMediaItem {
  id: string;
  url: string;
  fileName: string;
  format: string;
  width?: number;
  height?: number;
  originalSize: number;
  optimizedSize: number;
  savedPercent: string;
  timestamp: string;
}

export default function MediaClient() {
  const [items, setItems] = useState<UploadedMediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatKB = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const newItems: UploadedMediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      setUploadProgress({ current: i + 1, total: files.length });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.url) {
          newItems.unshift({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: data.url,
            fileName: data.fileName || file.name.replace(/\.[^/.]+$/, '') + '.webp',
            format: data.format || 'webp',
            width: data.width,
            height: data.height,
            originalSize: data.originalSize || file.size,
            optimizedSize: data.optimizedSize || file.size,
            savedPercent: data.savedPercent || '0%',
            timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          });
        } else {
          setErrorMsg(data.error || 'Ocurrió un error al procesar alguna de las imágenes.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error de red al procesar el archivo.');
      }
    }

    setItems((prev) => [...newItems, ...prev]);
    setIsUploading(false);
    setUploadProgress(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* ── ENCABEZADO ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              SISTEMA AUTOMÁTICO WEBP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Gestor & Optimizador WebP
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-mono mt-1 max-w-2xl">
            Sube cualquier imagen (JPG, PNG, HEIC, TIFF o WebP). El motor Sharp la redimensiona a escala web Full HD (máx. 1920px), elimina metadatos pesados y la convierte automáticamente a WebP de alta fidelidad.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Seleccionar Fotos</span>
          </button>
        </div>
      </div>

      {/* ── ZONA DE ARRASTRE (DRAG & DROP) ──────────────────────────────────── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]' 
            : 'border-white/15 bg-stone-900/40 hover:border-amber-400/60 hover:bg-stone-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files) {
              processFiles(e.target.files);
            }
          }}
        />

        {isUploading ? (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <p className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Procesando y convirtiendo a WebP...
              </p>
              {uploadProgress && (
                <p className="text-xs text-amber-400 font-mono mt-1">
                  Archivo {uploadProgress.current} de {uploadProgress.total}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <p className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Arrastra tus imágenes aquí o haz clic para explorar
              </p>
              <p className="text-xs text-stone-400 font-mono mt-1">
                Soporta archivos individuales o subida por lotes múltiples · Conversión WebP en tiempo real
              </p>
            </div>

            <div className="inline-flex items-center gap-4 text-[11px] font-mono text-stone-500 pt-2">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Formato WebP
              </span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Máx. 1920px Full HD
              </span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Auto-rotación EXIF
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alerta de Error si ocurre */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── GALERÍA DE RESULTADOS RECIENTES OPTIMIZADOS ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Imágenes Optimizadas ({items.length})
          </h2>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setItems([])}
              className="text-[11px] font-mono text-stone-400 hover:text-white transition-colors"
            >
              Limpiar lista
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/5 bg-stone-900/20 text-stone-500 font-mono text-xs">
            Aún no has subido imágenes en esta sesión. Arrastra una fotografía arriba para ver la conversión WebP inmediata con estadísticas de compresión.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-stone-900/80 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Visualizador de la Imagen WebP */}
                <div className="relative h-48 w-full bg-stone-950 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.fileName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge de Ahorro y Formato */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-mono text-[10px] font-black uppercase tracking-wider shadow-md">
                      WEBP -{item.savedPercent}
                    </span>
                    {item.width && item.height && (
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur border border-white/10 text-white font-mono text-[9px]">
                        {item.width}x{item.height}
                      </span>
                    )}
                  </div>

                  <span className="absolute top-3 right-3 text-[10px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded-md">
                    {item.timestamp}
                  </span>
                </div>

                {/* Métricas y Datos Técnicos */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </h3>

                    {/* Comparativa de Peso Antes vs Después */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 font-mono text-center text-xs">
                      <div className="p-2 rounded-lg bg-stone-950/60 border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Original</span>
                        <span className="text-xs text-stone-300 line-through">
                          {formatKB(item.originalSize)}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">WebP</span>
                        <span className="text-xs font-black text-amber-400">
                          {formatKB(item.optimizedSize)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción: Copiar URL o Abrir */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        copiedId === item.id
                          ? 'bg-emerald-500 text-stone-950'
                          : 'bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>¡URL Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="Ver imagen completa en nueva pestaña"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
