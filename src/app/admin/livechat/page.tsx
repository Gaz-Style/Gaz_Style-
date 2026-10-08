import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export default function LiveChatPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                    <div>
                        <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2">
                            <MessageSquare className="w-4 h-4" /> Centro de Comunicaciones
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                            Live <span className="font-bold">Chat</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-2">
                            Canal de emergencias en ruta y atención de ventas B2C.
                        </p>
                    </div>
                </header>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-blue-500/50 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-white mb-2">Integración de ChatBot Pendiente</h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Este módulo se conectará directamente a la API de WhatsApp Business o Intercom en la Fase 3 del despliegue, permitiendo la comunicación bidireccional con los guías satelitales (Garmin inReach).
                    </p>
                </div>
            </div>
        </div>
    );
}
