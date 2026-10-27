'use client';

import { useState } from 'react';
import { ShieldCheck, HeartPulse, Phone, AlertTriangle, CheckCircle2, Loader2, UserCheck, Compass, MessageCircle, ArrowLeft } from 'lucide-react';
import { saveCheckInDetails } from '../actions';
import Link from 'next/link';

export default function CheckInClient({ booking }: { booking: any }) {
    const adv = booking?.crm_adventurers || {};
    const title = booking?.agenda_departures?.adventures_catalog?.title || 'Expedición Cordillera de los Andes';
    
    let formattedDate = 'Fecha coordinada con el guía';
    if (booking?.agenda_departures?.start_date) {
        try {
            formattedDate = new Date(booking.agenda_departures.start_date).toLocaleDateString('es-CL', {
                timeZone: 'UTC',
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        } catch (_) {}
    }

    const [form, setForm] = useState({
        rut: '',
        emergency_contact_name: adv.emergency_contact_name || '',
        emergency_contact_phone: adv.emergency_contact_phone || '',
        emergency_relationship: 'Familiar directo',
        blood_type: adv.blood_type || 'O+',
        allergies: adv.allergies || 'Ninguna',
        medical_conditions: adv.medical_conditions || 'Ninguna',
        mountain_experience_level: adv.mountain_experience_level || 'Principiante',
    });

    const [accepted, setAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(Boolean(booking?.waiver_signed));
    const [touched, setTouched] = useState(false);

    const isRutValid = form.rut.trim().length >= 4;
    const isContactNameValid = form.emergency_contact_name.trim().length >= 3;
    const isContactPhoneValid = form.emergency_contact_phone.replace(/\D/g, '').length >= 8;

    const canSubmit = isRutValid && isContactNameValid && isContactPhoneValid && accepted;

    const handleSubmit = async () => {
        setTouched(true);
        if (!canSubmit) {
            alert('Por favor completa todos los campos obligatorios (*) y acepta la liberación de responsabilidades.');
            return;
        }

        setIsSubmitting(true);
        try {
            await saveCheckInDetails(booking.id, adv.id, {
                rut: form.rut,
                emergency_contact_name: form.emergency_contact_name,
                emergency_contact_phone: form.emergency_contact_phone,
                emergency_relationship: form.emergency_relationship,
                blood_type: form.blood_type,
                allergies: form.allergies,
                medical_conditions: form.medical_conditions,
                mountain_experience_level: form.mountain_experience_level,
            });
            setIsDone(true);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar tu información. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl text-center bg-stone-900/90 border border-emerald-500/40 shadow-[0_16px_50px_rgba(16,185,129,0.15)] backdrop-blur-xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                    Check-in WFR Verificado
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-3">
                    ¡Expedition Pass Activo!
                </h2>
                <p className="text-white/70 text-sm font-light mb-6 leading-relaxed">
                    Tus datos de seguridad, RUT y ficha médica han sido registrados con éxito en el sistema central de guías de <strong className="text-white">Santiago Hiking</strong>.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-2 mb-8 text-xs font-mono">
                    <div className="flex justify-between text-white/60">
                        <span>Expedición:</span>
                        <strong className="text-white">{title}</strong>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>Fecha:</span>
                        <strong className="text-amber-400 capitalize">{formattedDate}</strong>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>Titular:</span>
                        <span className="text-white">{adv.first_name} {adv.last_name}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>Grupo Sanguíneo:</span>
                        <span className="text-emerald-400">{form.blood_type}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                        <span>Contacto Emergencia:</span>
                        <span className="text-white">{form.emergency_contact_name}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                        href={`https://wa.me/56984021940?text=${encodeURIComponent(`¡Hola Gaz! Acabo de completar mi Ficha Médica y Check-in para ${title}. Quedo atento a las instrucciones.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-arcteryx-primary inline-flex items-center justify-center gap-2 !py-3.5 !px-6 text-xs font-mono font-bold tracking-widest"
                    >
                        <MessageCircle className="w-4 h-4" /> COORDINAR CON EL GUÍA
                    </a>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-xs font-mono font-bold tracking-wider transition-colors"
                    >
                        Volver a la Web
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 w-full my-6">
            
            {/* Cabecera */}
            <div className="text-center space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
                    Paso 2: Registro Post-Pago
                </span>
                <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                    Ficha de Seguridad & Check-in
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-light max-w-lg mx-auto leading-relaxed">
                    Tu pago ha sido recibido. Por normativa de montaña y seguros de rescate WFR, completa los datos de cada expedicionario.
                </p>
            </div>

            {/* Tarjeta de Resumen de la Expedición */}
            <div 
                className="p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
            >
                <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                        Expedición Confirmada
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold uppercase text-white">
                        {title}
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-1 capitalize">
                        {formattedDate} {adv.first_name && `· Pasajero: ${adv.first_name} ${adv.last_name}`}
                    </p>
                </div>
                <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pago Aprobado
                    </span>
                </div>
            </div>

            {/* SECCIÓN 1: Identificación Oficial (RUT / Pasaporte) */}
            <div 
                className="p-6 sm:p-8 rounded-3xl space-y-5"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
            >
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold uppercase text-white font-mono">
                            1. Identificación Oficial
                        </h3>
                        <span className="text-[11px] text-white/50 font-light">
                            Requerido para seguros y registro de acceso en Parques
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            RUT o Pasaporte <span className="text-red-400 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.rut}
                            onChange={(e) => setForm(f => ({ ...f, rut: e.target.value }))}
                            placeholder="Ej. 18.234.567-8 / Pasaporte"
                            className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                                touched && !isRutValid
                                    ? 'border-red-500 bg-red-950/20'
                                    : 'border-white/15 focus:border-amber-400 bg-black/40'
                            }`}
                            style={{ borderWidth: '1px' }}
                        />
                        {touched && !isRutValid && (
                            <span className="text-[10px] text-red-400 font-mono">Ingresa un RUT o documento válido</span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            Nivel de Experiencia en Senderismo
                        </label>
                        <select
                            value={form.mountain_experience_level}
                            onChange={(e) => setForm(f => ({ ...f, mountain_experience_level: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-sm text-white bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none transition-all"
                        >
                            <option value="Principiante" className="bg-stone-900 text-white">Principiante (Primeras ascensiones)</option>
                            <option value="Intermedio" className="bg-stone-900 text-white">Intermedio (Hago trekking habitual 2.000m-3.000m)</option>
                            <option value="Avanzado" className="bg-stone-900 text-white">Avanzado (Alta montaña / uso de crampones)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: Contacto de Emergencia */}
            <div 
                className="p-6 sm:p-8 rounded-3xl space-y-5"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
            >
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold uppercase text-white font-mono">
                            2. Contacto de Emergencia
                        </h3>
                        <span className="text-[11px] text-white/50 font-light">
                            Persona de confianza a contactar en caso de imprevisto
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            Nombre Completo <span className="text-red-400 font-bold">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.emergency_contact_name}
                            onChange={(e) => setForm(f => ({ ...f, emergency_contact_name: e.target.value }))}
                            placeholder="Ej. María Valenzuela"
                            className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                                touched && !isContactNameValid
                                    ? 'border-red-500 bg-red-950/20'
                                    : 'border-white/15 focus:border-amber-400 bg-black/40'
                            }`}
                            style={{ borderWidth: '1px' }}
                        />
                        {touched && !isContactNameValid && (
                            <span className="text-[10px] text-red-400 font-mono">Nombre de contacto obligatorio</span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            Teléfono de Contacto <span className="text-red-400 font-bold">*</span>
                        </label>
                        <input
                            type="tel"
                            value={form.emergency_contact_phone}
                            onChange={(e) => setForm(f => ({ ...f, emergency_contact_phone: e.target.value }))}
                            placeholder="+56 9 8765 4321"
                            className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                                touched && !isContactPhoneValid
                                    ? 'border-red-500 bg-red-950/20'
                                    : 'border-white/15 focus:border-amber-400 bg-black/40'
                            }`}
                            style={{ borderWidth: '1px' }}
                        />
                        {touched && !isContactPhoneValid && (
                            <span className="text-[10px] text-red-400 font-mono">Ingresa un teléfono válido</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                        Parentesco o Relación
                    </label>
                    <select
                        value={form.emergency_relationship}
                        onChange={(e) => setForm(f => ({ ...f, emergency_relationship: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm text-white bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none transition-all"
                    >
                        <option value="Pareja / Cónyuge" className="bg-stone-900 text-white">Pareja / Cónyuge</option>
                        <option value="Madre / Padre" className="bg-stone-900 text-white">Madre / Padre</option>
                        <option value="Hermano/a" className="bg-stone-900 text-white">Hermano/a</option>
                        <option value="Hijo/a" className="bg-stone-900 text-white">Hijo/a</option>
                        <option value="Amigo/a de confianza" className="bg-stone-900 text-white">Amigo/a de confianza</option>
                    </select>
                </div>
            </div>

            {/* SECCIÓN 3: Ficha Médica WFR */}
            <div 
                className="p-6 sm:p-8 rounded-3xl space-y-5"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
            >
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <HeartPulse className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold uppercase text-white font-mono">
                            3. Ficha Médica y Grupo Sanguíneo
                        </h3>
                        <span className="text-[11px] text-white/50 font-light">
                            Protocolo Wilderness First Responder (WFR)
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            Grupo Sanguíneo
                        </label>
                        <select
                            value={form.blood_type}
                            onChange={(e) => setForm(f => ({ ...f, blood_type: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-sm text-white bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none transition-all"
                        >
                            <option value="O+" className="bg-stone-900 text-white">O Positivo (O+)</option>
                            <option value="O-" className="bg-stone-900 text-white">O Negativo (O-)</option>
                            <option value="A+" className="bg-stone-900 text-white">A Positivo (A+)</option>
                            <option value="A-" className="bg-stone-900 text-white">A Negativo (A-)</option>
                            <option value="B+" className="bg-stone-900 text-white">B Positivo (B+)</option>
                            <option value="B-" className="bg-stone-900 text-white">B Negativo (B-)</option>
                            <option value="AB+" className="bg-stone-900 text-white">AB Positivo (AB+)</option>
                            <option value="AB-" className="bg-stone-900 text-white">AB Negativo (AB-)</option>
                            <option value="Desconocido" className="bg-stone-900 text-white">No lo recuerdo / Desconocido</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                            Alergias Severas (Medicamentos / Picaduras)
                        </label>
                        <input
                            type="text"
                            value={form.allergies}
                            onChange={(e) => setForm(f => ({ ...f, allergies: e.target.value }))}
                            placeholder="Ej. Ninguna, o Penicilina, picadura de avispa..."
                            className="w-full rounded-xl px-4 py-3 text-sm text-white bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase font-semibold text-white/80 block">
                        Condiciones Médicas Preexistentes, Asma o Lesiones Recientes
                    </label>
                    <input
                        type="text"
                        value={form.medical_conditions}
                        onChange={(e) => setForm(f => ({ ...f, medical_conditions: e.target.value }))}
                        placeholder="Ej. Ninguna / Asma controlada / Lesión de rodilla..."
                        className="w-full rounded-xl px-4 py-3 text-sm text-white bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* SECCIÓN 4: Liberación de Responsabilidades (Waiver) */}
            <div 
                className="p-6 sm:p-8 rounded-3xl space-y-4"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
            >
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <h3 className="text-sm font-bold uppercase text-white font-mono">
                        4. Liberación de Responsabilidad de Montaña
                    </h3>
                </div>

                <div className="text-xs text-white/60 leading-relaxed space-y-2 max-h-36 overflow-y-auto pr-3 font-light">
                    <p>1. Declaro estar en condiciones físicas y cardiovasculares compatibles con el senderismo en montaña y acataré en todo momento las decisiones del guía a cargo.</p>
                    <p>2. Entiendo los riesgos objetivos propios del terreno agreste (condiciones meteorológicas cambiantes, caídas de rocas o desniveles pronunciados).</p>
                    <p>3. Autorizo al equipo de Santiago Hiking a coordinar asistencia médica o de rescate en caso de emergencia si la situación lo amerita.</p>
                </div>

                <label className="flex items-start gap-3.5 p-4 rounded-xl border border-white/15 hover:border-amber-400/50 cursor-pointer bg-black/40 transition-colors">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-white/30 text-amber-500 focus:ring-amber-400 bg-stone-900 cursor-pointer accent-amber-500 shrink-0"
                    />
                    <div className="text-xs text-white/80 leading-relaxed">
                        <strong className="text-white block font-medium">He leído y acepto los términos del Waiver de Montaña *</strong>
                        <span className="text-[11px] text-white/50 block mt-0.5">
                            Mi firma digital quedará asociada a mi RUT y fecha de hoy.
                        </span>
                    </div>
                </label>
            </div>

            {/* Botón de Guardar Check-in */}
            <div className="space-y-3 pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`btn-arcteryx-primary w-full !py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all cursor-pointer ${
                        !canSubmit ? 'opacity-50' : 'hover:scale-[1.01]'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                            <span>Guardando información de seguridad...</span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="w-4 h-4 text-stone-950" />
                            <span>FINALIZAR CHECK-IN & ACTIVAR EXPEDITION PASS →</span>
                        </>
                    )}
                </button>

                <div className="text-center">
                    <Link href="/" className="text-xs text-white/40 hover:text-white/80 font-mono transition-colors">
                        ← Volver a la página principal
                    </Link>
                </div>
            </div>

        </div>
    );
}
