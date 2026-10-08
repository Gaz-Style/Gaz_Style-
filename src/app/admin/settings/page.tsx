import React from 'react';
import { Settings, ShieldCheck, Database, Key } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
                            <Settings className="w-4 h-4" /> Core System
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                            Ajustes <span className="font-bold">Generales</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-2">
                            Configuración de pasarelas de pago y roles de usuario.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            <h2 className="text-lg font-semibold text-white">Roles y Permisos</h2>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Solo el rol Administrador (Tú) tiene acceso a modificar las plantillas de costos.</p>
                        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded transition-colors">
                            Gestionar Usuarios
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                            <Key className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-lg font-semibold text-white">Integraciones B2B</h2>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Credenciales de Transbank Webpay Plus y API Keys de Supabase.</p>
                        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded transition-colors">
                            Ver API Keys
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
