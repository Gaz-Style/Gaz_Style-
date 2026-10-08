"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";

// Default canvas values
const DEFAULT_CANVAS_DATA = {
  partners: [
    "<strong>Programa Emerge (Anglo American):</strong> Respaldo institucional, mentoría estratégica y red de negocios.",
    "<strong>Alianzas de Equipamiento:</strong> Proveedores para arriendo de bastones, zapatos técnicos y gear.",
    "<strong>Asociación Parque Cordillera / CONAF:</strong> Permisos y gestión de acceso a senderos."
  ],
  partnersFooter: "Anclaje territorial Lo Barnechea",
  activities: [
    "Operación de logística 'Door-to-Mountain' y arriendo de equipo.",
    "Desarrollo de ecosistema Web e-commerce con reservas de 'Fricción Cero'.",
    "Guiado premium WFR enfocado en desconexión real, bienestar y educación ambiental."
  ],
  resources: [
    "<strong>Identidad de Marca Gaz_Style:</strong> Foco en wellness, credibilidad y tracción orgánica.",
    "<strong>Stack Tecnológico:</strong> Plataforma propia (Next.js/Supabase) para automatización total.",
    "<strong>Equipamiento de Seguridad:</strong> Botiquines WFR y convenios de arriendo de equipo técnico."
  ],
  valueB2C: "Experiencia outdoor enfocada en <strong>desconexión real, seguridad y bienestar</strong>. Eliminamos la carga logística para soltar el estrés. Incluye raciones de marcha locales y perfilamiento físico para grupos equilibrados.",
  valueComuna: "Inyección económica directa a proveedores gastronómicos locales mediante flujo de clientes de alto valor adquisitivo.",
  valueQuote: "La montaña, vivida con propósito.",
  relationships: [
    "<strong>En Terreno:</strong> Servicio Boutique personalizado, contención y liderazgo adaptado al perfil del grupo.",
    "<strong>Digital:</strong> Reservas automatizadas, perfilamiento previo por nivel físico y pagos online seguros."
  ],
  channels: [
    "<strong>Atracción Orgánica:</strong> Instagram & TikTok enfocados en desconexión urbana y wellness.",
    "<strong>Conversión Digital:</strong> Plataforma Web propia con catálogo interactivo y checkout (Webpay/Stripe)."
  ],
  segmentsTarget: [
    "<strong>Sunset Treks:</strong> Jóvenes profesionales que buscan recarga mental rápida (After Office).",
    "<strong>Full Day Escapades:</strong> Personas que buscan wellness de fin de semana con logística resuelta.",
    "<strong>VIP Hikes:</strong> Mercado corporativo B2B (Team Building) y turistas internacionales."
  ],
  segmentsScale: "Crecimiento del canal B2B (Empresas) y escalabilidad territorial a otras montañas de Chile.",
  costFixed: "Servidores y BD (~$80.000 CLP/mes).<br/>&bull; Seguros anuales, branding corporativo y patentes.",
  costVariable: "Arriendo de equipamiento por pasajero, honorarios de guías extra y raciones de marcha locales.",
  revenueTicket: "<strong>Venta Directa de Catálogo:</strong><br/>&bull; Sunset Treks ($25.000)<br/>&bull; Full Day ($45.000)<br/>&bull; VIP Hikes (A cotizar, $80.000+).",
  revenueMargin: "Ingresos adicionales por arriendo de equipo técnico y alianzas B2B."
};

interface EditableHTMLProps {
  html: string;
  onChange: (newHtml: string) => void;
  className?: string;
  tag?: string;
}

const EditableHTML: React.FC<EditableHTMLProps> = ({ html, onChange, className = "", tag = "span" }) => {
  const Tag = tag as any;
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onChange(e.target.innerHTML);
  };

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: html }}
      className={`${className} outline-none focus:ring-1 focus:ring-amber-500/50 focus:bg-slate-800/40 px-1 rounded transition-all cursor-edit border-b border-transparent hover:border-amber-500/35 hover:bg-slate-800/10`}
      title="Haz clic para editar"
    />
  );
};

export default function ModeloNegocioPage() {
  const [activeTab, setActiveTab] = useState<"canvas" | "mvp" | "pitch">("canvas");
  const [canvasData, setCanvasData] = useState(DEFAULT_CANVAS_DATA);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("gaz_style_canvas_data");
    if (saved) {
      try {
        setCanvasData(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved canvas data:", e);
      }
    }
  }, []);

  // Save changes helper
  const updateField = (fieldKey: keyof typeof DEFAULT_CANVAS_DATA, value: string | string[], index?: number) => {
    setCanvasData(prev => {
      let updated: typeof DEFAULT_CANVAS_DATA;
      if (Array.isArray(prev[fieldKey]) && typeof index === "number") {
        const newArr = [...(prev[fieldKey] as string[])];
        newArr[index] = value as string;
        updated = { ...prev, [fieldKey]: newArr };
      } else {
        updated = { ...prev, [fieldKey]: value as string };
      }
      localStorage.setItem("gaz_style_canvas_data", JSON.stringify(updated));
      return updated;
    });

    // Briefly show a "Saved" indicator
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 1500);
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas restablecer los valores originales del Canvas? Se borrarán tus cambios.")) {
      setCanvasData(DEFAULT_CANVAS_DATA);
      localStorage.removeItem("gaz_style_canvas_data");
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 1500);
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
          
          .modelo-negocio-body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
          }
          
          .canvas-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(2, minmax(220px, auto)) minmax(150px, auto);
            gap: 1rem;
          }
          
          @media (max-width: 1024px) {
            .canvas-grid {
              display: flex;
              flex-direction: column;
            }
          }
          
          .box-partners { grid-column: 1; grid-row: 1 / 3; }
          .box-activities { grid-column: 2; grid-row: 1; }
          .box-resources { grid-column: 2; grid-row: 2; }
          .box-value { grid-column: 3; grid-row: 1 / 3; }
          .box-relationships { grid-column: 4; grid-row: 1; }
          .box-channels { grid-column: 4; grid-row: 2; }
          .box-segments { grid-column: 5; grid-row: 1 / 3; }
          .box-cost { grid-column: 1 / 3; grid-row: 3; }
          .box-revenue { grid-column: 3 / 6; grid-row: 3; }

          .tab-btn.active {
            background-color: #f59e0b;
            color: #0f172a;
            font-weight: 800;
          }
          
          .cursor-edit {
            cursor: text;
          }
        `
      }} />

      <div className="modelo-negocio-body min-h-screen p-4 md:p-6 flex flex-col relative">
        {/* Floating autosave notification */}
        {isSavedAlert && (
          <div className="fixed bottom-4 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce">
            <Save className="w-4 h-4" />
            <span>¡Cambios guardados!</span>
          </div>
        )}

        {/* Header principal con selector de vistas */}
        <header className="w-full max-w-7xl mx-auto mb-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white uppercase transition-colors mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </Link>
              <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">MVP B2C Pequeño</span>
              <span className="text-slate-400 text-xs font-medium">
                <i className="fa-solid fa-location-dot text-amber-500 mr-1"></i> Lo Barnechea, Santiago
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">GAZ_STYLE &bull; MODELO DE NEGOCIO</h1>
            <p className="text-xs text-slate-400">Plataforma de Vitalidad, Mentalidad y Experiencias de Montaña</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {activeTab === "canvas" && (
              <button
                onClick={handleReset}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border border-red-500/20"
                title="Restablecer Canvas original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("canvas")}
              className={`tab-btn px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border ${
                activeTab === "canvas"
                  ? "active border-amber-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <i className="fa-solid fa-table-cells text-sm"></i> Canvas 9 Bloques
            </button>
            <button
              onClick={() => setActiveTab("mvp")}
              className={`tab-btn px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border ${
                activeTab === "mvp"
                  ? "active border-amber-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <i className="fa-solid fa-rocket text-sm"></i> MVP Piloto B2C
            </button>
            <button
              onClick={() => setActiveTab("pitch")}
              className={`tab-btn px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 border ${
                activeTab === "pitch"
                  ? "active border-amber-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <i className="fa-solid fa-comments text-sm"></i> Guion Tutoría Emerge
            </button>
          </div>
        </header>

        {activeTab === "canvas" && (
          <div className="max-w-7xl w-full mx-auto mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span><strong>Tablero Interactivo:</strong> Haz clic sobre cualquier texto o punto en los casilleros de abajo para editarlo. Tus cambios se guardarán automáticamente en tu navegador.</span>
          </div>
        )}

        {/* VISTA 1: CANVAS DE 9 BLOQUES */}
        <main
          className={`max-w-7xl w-full mx-auto canvas-grid mb-6 ${
            activeTab === "canvas" ? "" : "hidden"
          }`}
        >
          {/* 1. SOCIOS CLAVE */}
          <div className="box-partners bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
                <i className="fa-solid fa-handshake text-lg"></i>
                <h2 className="font-bold text-xs uppercase text-white tracking-wider">Socios Clave</h2>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                {canvasData.partners.map((partner, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <i className="fa-solid fa-shield-halved text-amber-500 mt-0.5 shrink-0"></i>
                    <EditableHTML
                      html={partner}
                      onChange={(newVal) => updateField("partners", newVal, idx)}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <EditableHTML
                html={canvasData.partnersFooter}
                onChange={(newVal) => updateField("partnersFooter", newVal)}
                className="text-[10px] text-amber-400 font-mono"
              />
            </div>
          </div>

          {/* 2. ACTIVIDADES CLAVE */}
          <div className="box-activities bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-list-check text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Actividades Clave</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {canvasData.activities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-amber-500 text-[10px] mt-1 shrink-0"></i>
                  <EditableHTML
                    html={act}
                    onChange={(newVal) => updateField("activities", newVal, idx)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* 3. RECURSOS CLAVE */}
          <div className="box-resources bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-cubes text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Recursos Clave</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {canvasData.resources.map((res, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-amber-500 text-[10px] mt-1 shrink-0"></i>
                  <EditableHTML
                    html={res}
                    onChange={(newVal) => updateField("resources", newVal, idx)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* 4. PROPUESTA DE VALOR */}
          <div className="box-value bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 p-5 rounded-2xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
                <i className="fa-solid fa-gem text-lg"></i>
                <h2 className="font-bold text-xs uppercase text-white tracking-wider">Propuesta de Valor</h2>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mb-3">
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-1">
                  <i className="fa-solid fa-user-bolt mr-1"></i> Para el Cliente (B2C)
                </p>
                <EditableHTML
                  html={canvasData.valueB2C}
                  onChange={(newVal) => updateField("valueB2C", newVal)}
                  className="text-xs text-slate-200 leading-relaxed block"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide mb-1">
                  <i className="fa-solid fa-store mr-1"></i> Para la Comuna
                </p>
                <EditableHTML
                  html={canvasData.valueComuna}
                  onChange={(newVal) => updateField("valueComuna", newVal)}
                  className="text-xs text-slate-200 leading-relaxed block"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-xs font-bold text-amber-400 italic">"</span>
              <EditableHTML
                html={canvasData.valueQuote}
                onChange={(newVal) => updateField("valueQuote", newVal)}
                className="text-xs font-bold text-amber-400 italic"
              />
              <span className="text-xs font-bold text-amber-400 italic">"</span>
            </div>
          </div>

          {/* 5. RELACIÓN CON CLIENTES */}
          <div className="box-relationships bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-heart text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Relación con Clientes</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {canvasData.relationships.map((rel, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-amber-500 text-[10px] mt-1 shrink-0"></i>
                  <EditableHTML
                    html={rel}
                    onChange={(newVal) => updateField("relationships", newVal, idx)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* 6. CANALES */}
          <div className="box-channels bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-bullhorn text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Canales</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {canvasData.channels.map((chan, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-amber-500 text-[10px] mt-1 shrink-0"></i>
                  <EditableHTML
                    html={chan}
                    onChange={(newVal) => updateField("channels", newVal, idx)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* 7. SEGMENTO DE CLIENTES */}
          <div className="box-segments bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
                <i className="fa-solid fa-users text-lg"></i>
                <h2 className="font-bold text-xs uppercase text-white tracking-wider">Segmento de Clientes</h2>
              </div>
              
              <div className="mb-3">
                <p className="text-xs font-bold text-white mb-1">Target Piloto (MVP B2C):</p>
                <ul className="space-y-2 text-xs text-slate-300">
                  {canvasData.segmentsTarget.map((seg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <i className="fa-solid fa-user-check text-amber-500 mt-0.5 shrink-0"></i>
                      <EditableHTML
                        html={seg}
                        onChange={(newVal) => updateField("segmentsTarget", newVal, idx)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mt-2">
              <p className="text-[10px] text-amber-400 font-semibold">
                <i className="fa-solid fa-arrow-up-right-dots mr-1"></i> Escala Futura:
              </p>
              <EditableHTML
                html={canvasData.segmentsScale}
                onChange={(newVal) => updateField("segmentsScale", newVal)}
                className="text-[10px] text-slate-400 block"
              />
            </div>
          </div>

          {/* 8. ESTRUCTURA DE COSTOS */}
          <div className="box-cost bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-rose-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-calculator text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Estructura de Costos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="font-bold text-slate-200 mb-1">Costos Fijos (Digitales):</p>
                <EditableHTML
                  html={canvasData.costFixed}
                  onChange={(newVal) => updateField("costFixed", newVal)}
                  className="text-slate-400 block"
                />
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="font-bold text-slate-200 mb-1">Costos Variables (Por Piloto):</p>
                <EditableHTML
                  html={canvasData.costVariable}
                  onChange={(newVal) => updateField("costVariable", newVal)}
                  className="text-slate-400 block"
                />
              </div>
            </div>
          </div>

          {/* 9. FUENTES DE INGRESOS */}
          <div className="box-revenue bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-sack-dollar text-lg"></i>
              <h2 className="font-bold text-xs uppercase text-white tracking-wider">Fuentes de Ingresos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
                <p className="font-bold text-emerald-300 mb-1">1. Ticket Integral B2C (Piloto):</p>
                <EditableHTML
                  html={canvasData.revenueTicket}
                  onChange={(newVal) => updateField("revenueTicket", newVal)}
                  className="text-slate-300 block"
                />
              </div>
              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
                <p className="font-bold text-emerald-300 mb-1">2. Margen de Intermediación:</p>
                <EditableHTML
                  html={canvasData.revenueMargin}
                  onChange={(newVal) => updateField("revenueMargin", newVal)}
                  className="text-slate-300 block"
                />
              </div>
            </div>
          </div>
        </main>

        {/* VISTA 2: DETALLE DEL MVP PILOTO B2C */}
        <section
          className={`max-w-7xl w-full mx-auto mb-8 space-y-6 ${
            activeTab === "mvp" ? "" : "hidden"
          }`}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center text-lg">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">MVP B2C: "Piloto Recarga Lo Barnechea"</h2>
                <p className="text-xs text-slate-400">Estrategia de validación ágil antes de escalar al mercado corporativo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Tamaño del Grupo</p>
                <p className="text-2xl font-black text-amber-400 mt-1">6 a 10 Cupos</p>
                <p className="text-[11px] text-slate-500 mt-1">Grupo reducido para control total de seguridad y experiencia personalizada.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Costo de Adquisición (CAC)</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">$0 CLP</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Convocatoria 100% orgánica mediante el canal de Instagram <code className="text-amber-400">@gaz_style</code>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Ubicación Clave</p>
                <p className="text-2xl font-black text-sky-400 mt-1">Lo Barnechea</p>
                <p className="text-[11px] text-slate-500 mt-1">Ruta en Parque Cordillera + Consumo en local gastronómico aliado de la comuna.</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-amber-500"></i> Flujo de Ejecución del Piloto (3 Pasos)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">Paso 1</span>
                <h4 className="font-bold text-white mt-2 text-sm">Atracción & Reserva Digital</h4>
                <p className="text-slate-300 mt-1">
                  Lanzamiento de historia orgánica en Instagram. El usuario ingresa a la Landing Page en{" "}
                  <code className="text-amber-300">gaz_style.cl</code>, reserva su cupo y recibe confirmación automática por mail.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">Paso 2</span>
                <h4 className="font-bold text-white mt-2 text-sm">Ruta de Montaña & Seguridad</h4>
                <p className="text-slate-300 mt-1">
                  Ejecución del trekking guiado por Mario Cruz. Foco en mentalidad, desconexión del estrés urbano, contención de
                  grupo y seguridad técnica en terreno.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">Paso 3</span>
                <h4 className="font-bold text-white mt-2 text-sm">Experiencia Gastronómica Local</h4>
                <p className="text-slate-300 mt-1">
                  Cierre de la jornada en el restaurante o café aliado de Lo Barnechea. Canalización directa de gasto hacia el
                  comercio de la comuna.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VISTA 3: GUION PARA LA TUTORÍA DE EMERGENCIA */}
        <section
          className={`max-w-7xl w-full mx-auto mb-8 space-y-6 ${
            activeTab === "pitch" ? "" : "hidden"
          }`}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 text-slate-950 font-black rounded-xl flex items-center justify-center text-lg">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Guion Estratégico para la Tutoría Emerge</h2>
                <p className="text-xs text-slate-400">Puntos clave para presentar el Canvas y el MVP frente al coach de Anglo American</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="font-bold text-amber-400 text-sm mb-1">1. La Apertura (Tu postura de Negocio):</p>
                <p className="italic text-slate-200">
                  "En esta sesión traemos un Modelo Canvas enfocado en nuestro MVP B2C. Decidimos iniciar con un piloto pequeño en el
                  mercado de consumidor final para validar rápido, con bajo riesgo y costo cero de adquisición antes de abrir el
                  canal corporativo B2B."
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="font-bold text-amber-400 text-sm mb-1">2. Por qué B2C Pequeño (Respuesta a objeciones del Tutor):</p>
                <p className="italic text-slate-200">
                  "Con un grupo de 6 a 10 personas probamos la tecnología de reserva automatizada, medimos la logística de seguridad
                  en montaña y consolidamos la alianza con el restaurante aliado en Lo Barnechea. Esto nos da datos reales de margen sin
                  desgastar la marca."
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="font-bold text-amber-400 text-sm mb-1">3. Tus Números Fijos y Métricas a Medir:</p>
                <p className="text-slate-300 mb-2">&bull; <strong>Tracción Orgánica:</strong> 7.600 visualizaciones activas al mes en Instagram (CAC $0).</p>
                <p className="text-slate-300 mb-2">&bull; <strong>Costo Fijo Digital:</strong> ~$50.000 a $80.000 CLP/mes en hosting y base de datos.</p>
                <p className="text-slate-300">
                  &bull; <strong>Lo que buscamos de Emerge:</strong> Mentoría para estructurar la matriz de costos/márgenes de la alianza
                  gastronómica local.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
