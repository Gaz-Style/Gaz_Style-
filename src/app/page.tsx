import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import { ArrowLeft, Mountain, ShieldCheck, Clock, HeartPulse, Compass, Download, MessageCircle, Camera, Tent, ArrowRight, CheckCircle2, Star, Globe } from "lucide-react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import LanguageSwitcher from "./LanguageSwitcher";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getPublicData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const [{ data: routes }, { data: departures }] = await Promise.all([
    supabase.from('adventures_catalog').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('agenda_departures').select('*, adventures_catalog(title, base_price, max_pax)').in('status', ['scheduled', 'confirmed']).gte('start_date', new Date().toISOString().split('T')[0]).order('start_date', { ascending: true }).limit(6),
  ]);
  return { routes: routes || [], departures: departures || [] };
}

const dict: Record<string, any> = {
  es: {
    bookHike: "Ven al cerro",
    premiumOutdoors: "Experiencias Outdoor Premium",
    heroTitle1: "Creando experiencias y recargando la",
    heroTitle2: "fucking",
    heroTitle3: "vibra. ⚡",
    heroSubtitle: "Mentalidad, conexión y aventura. Vamos a la montaña.",
    exploreRoutes: "Explorar Rutas",
    joinClub: "El Círculo",
    leadTitle: "Las 5 rutas para empezar.",
    leadSub: "Recibe la guía en tu correo.",
    leadBtn: "Recibir Guía",
    experiences: "Experiencias",
    testimonialsTitle: "Voces de la cumbre.",
    methodTag: "El Método Santiago Hiking",
    methodTitle: "Logística de Cero Fricción.",
    methodSub: "Diseñamos una experiencia en 3 fases para garantizar tu seguridad física y tu descarga mental.",
    phase1: "Fase 1",
    phase1Title: "Atracción & Reserva Digital",
    phase1Desc: "Reservas en 2 clics. Check-in médico online y perfilamiento físico previo para asegurar que el grupo sea homogéneo y seguro.",
    phase2: "Fase 2",
    phase2Title: "La Ruta: Barro y Desconexión",
    phase2Desc: "Guiado premium WFR (Wilderness First Responder). Exigencia física real para botar el estrés, contención grupal y seguridad en cada paso.",
    phase3: "Fase 3",
    phase3Title: "Gastronomía en Lo Barnechea",
    phase3Desc: "Bajamos del cerro directo a recargar energías en locales aliados. Tú comes increíble, y juntos inyectamos valor directo a la comuna.",
    catalogTag: "Expediciones Grupales",
    catalogTitle: "Ven conmigo al cerro.",
    catalogSub: "Yo armo la ruta, yo te guío y yo me aseguro de que volvamos sanos, salvos y con las mejores fotos.",
    bestseller: "Mi Favorita",
    level: "Nivel",
    maxPax: "Máx",
    people: "personas",
    from: "Desde",
    viewItinerary: "Ver Itinerario",
    privateTag: "Experiencia Exclusiva",
    privateExp: "Expediciones 1 a 1",
    privateDesc: "¿Prefieres ir a tu propio ritmo, con tu propio grupo de amigos, o buscas un desafío personal específico? Arma una ruta a tu medida donde el foco de la guianza está 100% en ti.",
    quoteBtn: "Cotizar Ruta Privada",
    communityTitle: "Conecta con el Círculo.",
    communitySub: "La montaña no se sube solo. Tenemos un grupo de WhatsApp gratuito donde organizamos salidas exprés, resolvemos dudas de equipo y compartimos fotos. ¡Todos son bienvenidos!",
    whatsapp: "Entrar al WhatsApp",
    instagram: "Ver mi día a día",
    fieldTag: "En Terreno",
    upcoming: "Próximas Salidas Grupales",
    noDepartures: "No hay salidas grupales programadas por ahora. Entra al WhatsApp para enterarte antes que nadie.",
    noRoutes: "Próximamente abriré mis rutas privadas.",
    only: "¡Últimos",
    spotsLeft: "cupos!",
    spotLeft: "cupo!",
    spotsAvail: "Cupos Abiertos",
    perPerson: "por persona",
    book: "Anotarme",
    footerText: "Tu compañero de ruta. Creador de contenido y guía de montaña.",
    rights: "Todos los derechos reservados."
  },
  en: {
    bookHike: "Book a Hike",
    premiumOutdoors: "Premium Outdoor Experiences",
    heroTitle1: "Creating experiences and recharging the",
    heroTitle2: "fucking",
    heroTitle3: "vibe. ⚡",
    heroSubtitle: "Mindset, connection, and adventure. Let's hit the mountains.",
    exploreRoutes: "Explore Routes",
    joinClub: "Join the Club",
    leadTitle: "Top 5 beginner routes.",
    leadSub: "Get our exclusive PDF guide in your inbox.",
    leadBtn: "Get Guide",
    experiences: "Experiences",
    testimonialsTitle: "Voices from the summit.",
    methodTag: "The Santiago Hiking Method",
    methodTitle: "Zero-Friction Logistics.",
    methodSub: "We designed a 3-phase experience to guarantee your physical safety and mental reset.",
    phase1: "Phase 1",
    phase1Title: "Seamless Booking",
    phase1Desc: "Book in 2 clicks. Online medical check-in and physical profiling to ensure homogeneous and safe groups.",
    phase2: "Phase 2",
    phase2Title: "The Ascent",
    phase2Desc: "Premium WFR (Wilderness First Responder) guidance. Real physical challenge to release stress with group contention.",
    phase3: "Phase 3",
    phase3Title: "Local Gastronomy",
    phase3Desc: "We descend from the mountain straight to recharge at allied local spots. You eat amazing food while we support the community.",
    catalogTag: "Group Expeditions",
    catalogTitle: "Come hike with us.",
    catalogSub: "We design the route, guide you, and ensure you return safe with the best photos.",
    bestseller: "Bestseller",
    level: "Level",
    maxPax: "Max",
    people: "people",
    from: "From",
    viewItinerary: "View Itinerary",
    privateTag: "Exclusive Experience",
    privateExp: "1-on-1 Private Expeditions",
    privateDesc: "Prefer to go at your own pace, with your own friends, or seeking a specific challenge? Build a custom route.",
    quoteBtn: "Quote Private Route",
    communityTitle: "Join the Community.",
    communitySub: "The mountain shouldn't be climbed alone. We have a free WhatsApp group for express outings and gear advice.",
    whatsapp: "Join WhatsApp",
    instagram: "Instagram",
    fieldTag: "Field Work",
    upcoming: "Upcoming Group Departures",
    noDepartures: "No group departures scheduled right now. Join WhatsApp to hear about them first.",
    noRoutes: "Private routes opening soon.",
    only: "Only",
    spotsLeft: "spots left!",
    spotLeft: "spot left!",
    spotsAvail: "Spots Available",
    perPerson: "per person",
    book: "Book",
    footerText: "Your trail partner. Content creator and mountain guide.",
    rights: "All rights reserved."
  },
  pt: {
    bookHike: "Reservar Trilha",
    premiumOutdoors: "Experiências Outdoor Premium",
    heroTitle1: "Criando experiências e recarregando a",
    heroTitle2: "fucking",
    heroTitle3: "vibe. ⚡",
    heroSubtitle: "Mentalidade, conexão e aventura. Vamos para a montanha.",
    exploreRoutes: "Explorar Trilhas",
    joinClub: "Entrar no Clube",
    leadTitle: "As 5 melhores trilhas.",
    leadSub: "Receba o guia exclusivo no seu email.",
    leadBtn: "Receber Guia",
    experiences: "Experiências",
    testimonialsTitle: "Vozes do cume.",
    methodTag: "O Método Santiago Hiking",
    methodTitle: "Logística sem Atrito.",
    methodSub: "Experiência em 3 fases desenhada para garantir sua segurança e renovação mental.",
    phase1: "Fase 1",
    phase1Title: "Reserva Digital",
    phase1Desc: "Reserva em 2 cliques. Check-in médico online e avaliação física prévia para grupos homogêneos.",
    phase2: "Fase 2",
    phase2Title: "A Subida",
    phase2Desc: "Guia premium WFR (Wilderness First Responder). Desafio físico real para liberar o estresse com total segurança.",
    phase3: "Fase 3",
    phase3Title: "Gastronomia Local",
    phase3Desc: "Descemos da montanha direto para recarregar as energias em locais parceiros. Você come bem e apoiamos a comunidade.",
    catalogTag: "Expedições em Grupo",
    catalogTitle: "Venha para a montanha.",
    catalogSub: "Nós desenhamos a rota, guiamos você e garantimos seu retorno em segurança.",
    bestseller: "Mais Vendido",
    level: "Nível",
    maxPax: "Máx",
    people: "pessoas",
    from: "A partir de",
    viewItinerary: "Ver Roteiro",
    privateTag: "Experiência Exclusiva",
    privateExp: "Expedições 1 a 1",
    privateDesc: "Prefere seu próprio ritmo ou um desafio específico? Crie uma rota 100% focada em você.",
    quoteBtn: "Cotar Rota",
    communityTitle: "Conecte-se à Comunidade.",
    communitySub: "A montanha não se sobe sozinho. Entre no nosso grupo gratuito de WhatsApp.",
    whatsapp: "Entrar no WhatsApp",
    instagram: "Instagram",
    fieldTag: "Em Campo",
    upcoming: "Próximas Saídas em Grupo",
    noDepartures: "Nenhuma saída programada no momento. Entre no WhatsApp para ser o primeiro a saber.",
    noRoutes: "Rotas privadas em breve.",
    only: "Últimas",
    spotsLeft: "vagas!",
    spotLeft: "vaga!",
    spotsAvail: "Vagas Abertas",
    perPerson: "por pessoa",
    book: "Reservar",
    footerText: "Seu parceiro de trilha. Criador de conteúdo e guia de montanha.",
    rights: "Todos os direitos reservados."
  },
  de: {
    bookHike: "Tour buchen",
    premiumOutdoors: "Premium Outdoor Erlebnisse",
    heroTitle1: "Erlebnisse schaffen und den",
    heroTitle2: "fucking",
    heroTitle3: "Vibe aufladen. ⚡",
    heroSubtitle: "Mindset, Verbindung und Abenteuer. Auf in die Berge.",
    exploreRoutes: "Routen entdecken",
    joinClub: "Dem Club beitreten",
    leadTitle: "Top 5 Einsteiger-Routen.",
    leadSub: "Hol dir unseren PDF-Guide direkt ins Postfach.",
    leadBtn: "Guide erhalten",
    experiences: "Erlebnisse",
    testimonialsTitle: "Stimmen vom Gipfel.",
    methodTag: "Die Santiago Hiking Methode",
    methodTitle: "Reibungslose Logistik.",
    methodSub: "Ein 3-Phasen-Erlebnis, konzipiert für deine Sicherheit und mentale Erholung.",
    phase1: "Phase 1",
    phase1Title: "Nahtlose Buchung",
    phase1Desc: "Buchung in 2 Klicks. Online Medizin-Check und Profiling für homogene, sichere Gruppen.",
    phase2: "Phase 2",
    phase2Title: "Der Aufstieg",
    phase2Desc: "Premium WFR (Wilderness First Responder) Führung. Echte körperliche Herausforderung zum Stressabbau mit absoluter Sicherheit.",
    phase3: "Phase 3",
    phase3Title: "Lokale Gastronomie",
    phase3Desc: "Vom Berg direkt zu unseren lokalen Partnern. Du isst großartig und wir unterstützen die Gemeinde.",
    catalogTag: "Gruppenexpeditionen",
    catalogTitle: "Komm mit uns wandern.",
    catalogSub: "Wir planen die Route, führen dich und bringen dich sicher mit den besten Fotos zurück.",
    bestseller: "Bestseller",
    level: "Niveau",
    maxPax: "Max",
    people: "Personen",
    from: "Ab",
    viewItinerary: "Route ansehen",
    privateTag: "Exklusives Erlebnis",
    privateExp: "1-zu-1 Private Expeditionen",
    privateDesc: "Lieber im eigenen Tempo? Erstelle eine maßgeschneiderte Route, 100% auf dich fokussiert.",
    quoteBtn: "Private Route anfragen",
    communityTitle: "Verbinde dich.",
    communitySub: "Die Berge besteigt man nicht allein. Tritt unserer kostenlosen WhatsApp-Gruppe bei.",
    whatsapp: "WhatsApp beitreten",
    instagram: "Instagram",
    fieldTag: "Im Gelände",
    upcoming: "Kommende Gruppentouren",
    noDepartures: "Derzeit keine Gruppentouren geplant. Tritt WhatsApp bei, um es als Erster zu erfahren.",
    noRoutes: "Private Routen in Kürze.",
    only: "Nur noch",
    spotsLeft: "Plätze frei!",
    spotLeft: "Platz frei!",
    spotsAvail: "Plätze verfügbar",
    perPerson: "pro Person",
    book: "Buchen",
    footerText: "Dein Trail-Partner. Content Creator und Bergführer.",
    rights: "Alle Rechte vorbehalten."
  },
  zh: {
    bookHike: "预订徒步",
    premiumOutdoors: "高端户外体验",
    heroTitle1: "创造体验并重置",
    heroTitle2: "最硬核的",
    heroTitle3: "氛围。 ⚡",
    heroSubtitle: "心态、联系与冒险。向大山出发。",
    exploreRoutes: "探索路线",
    joinClub: "加入俱乐部",
    leadTitle: "五大新手徒步路线。",
    leadSub: "在收件箱获取独家PDF指南。",
    leadBtn: "获取指南",
    experiences: "体验评价",
    testimonialsTitle: "来自顶峰的声音。",
    methodTag: "圣地亚哥徒步方法",
    methodTitle: "零摩擦物流。",
    methodSub: "我们设计了三阶段体验，保证您的身体安全和身心放松。",
    phase1: "第一阶段",
    phase1Title: "无缝预订",
    phase1Desc: "两步预订。在线医疗签到和身体情况评估，确保团队安全均匀。",
    phase2: "第二阶段",
    phase2Title: "攀登",
    phase2Desc: "高级WFR（野外急救员）向导。通过真实的体力挑战释放压力，绝对安全。",
    phase3: "第三阶段",
    phase3Title: "当地美食",
    phase3Desc: "我们从山上直接前往合作的当地餐厅补充能量。享受美食的同时支持当地社区。",
    catalogTag: "团队探险",
    catalogTitle: "和我们一起徒步。",
    catalogSub: "我们设计路线、为您向导，并确保您安全返回并带回最棒的照片。",
    bestseller: "最畅销",
    level: "难度等级",
    maxPax: "最多",
    people: "人",
    from: "起步价",
    viewItinerary: "查看行程",
    privateTag: "独家体验",
    privateExp: "一对一私人探险",
    privateDesc: "喜欢按照自己的节奏前进，或者寻找特定的挑战？建立100%专注您的专属路线。",
    quoteBtn: "私人路线报价",
    communityTitle: "加入社区。",
    communitySub: "不应独自登山。加入我们的免费WhatsApp群组。",
    whatsapp: "加入WhatsApp",
    instagram: "Instagram",
    fieldTag: "现场工作",
    upcoming: "即将出发的团队",
    noDepartures: "目前没有安排团队出发。加入WhatsApp获取第一手资讯。",
    noRoutes: "私人路线即将开放。",
    only: "仅剩",
    spotsLeft: "个名额！",
    spotLeft: "个名额！",
    spotsAvail: "名额开放",
    perPerson: "每人",
    book: "预订",
    footerText: "您的徒步伙伴。内容创作者和高山向导。",
    rights: "版权所有。"
  }
};

export default async function ExperienciaMontanaPage(props: { searchParams: Promise<{ lang?: string }> }) {
  const searchParams = await props.searchParams;
  const lang = searchParams?.lang && ['es', 'en', 'pt', 'de', 'zh'].includes(searchParams.lang as string) ? (searchParams.lang as string) : 'es';
  const t = dict[lang];

  const { routes, departures } = await getPublicData();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
          
          .gaz-premium-body {
            background-color: transparent;
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
          }
          .font-editorial {
            font-family: 'Playfair Display', serif;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .gold-gradient-text {
            background: linear-gradient(to right, #f59e0b, #fbbf24, #fcd34d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `
      }} />

      <div className="gaz-premium-body min-h-screen flex flex-col antialiased selection:bg-amber-500/30">
        
        {/* HEADER */}
        <header className="fixed w-full top-0 z-50 glass-panel border-b-0 border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            
            {/* Espacio vacío a la izquierda para centrar el logo en desktop */}
            <div className="w-[180px] hidden md:block"></div>
            
            {/* Logo al centro */}
            <div className="flex items-center justify-center gap-3">
              <Image src="/images/logo/Favicon 1.png" alt="Santiago Hiking Logo" width={28} height={28} className="object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <span className="font-editorial font-bold text-2xl tracking-wider text-white">
                Santiago <span className="text-amber-500 italic">Hiking</span>
              </span>
            </div>

            {/* Controles a la derecha */}
            <div className="flex items-center justify-end gap-4 w-auto md:w-[180px]">
              <LanguageSwitcher currentLang={lang} />

              <a href="#rutas" className="hidden lg:inline-flex bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap">
                {t.bookHike}
              </a>
            </div>

          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <HeroCarousel />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium tracking-widest uppercase text-amber-400">{t.premiumOutdoors}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-editorial font-bold text-white leading-tight mb-6">
              {t.heroTitle1} <br />
              <span className="italic font-light text-slate-300">{t.heroTitle2} </span>
              <span className="gold-gradient-text">{t.heroTitle3}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a href="#rutas" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                {t.exploreRoutes}
              </a>
              <a href="#circulo" className="w-full sm:w-auto glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all">
                {t.joinClub}
              </a>
            </div>
          </div>
        </section>

        {/* LEAD MAGNET / NEWSLETTER */}
        <section className="py-8 bg-transparent relative z-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-panel border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 hidden sm:flex">
                  <Mountain className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{t.leadTitle}</h3>
                  <p className="text-slate-400 font-light text-xs mt-1">{t.leadSub}</p>
                </div>
              </div>
              <form className="flex flex-col sm:flex-row w-full md:w-auto gap-3 sm:gap-2 mt-2 md:mt-0">
                <input type="email" placeholder="Email" className="bg-black/50 border border-slate-700 rounded-full px-4 py-3 sm:py-2 text-sm text-white focus:outline-none focus:border-amber-500 flex-1 md:w-64" required />
                <button type="button" className="w-full sm:w-auto bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 sm:py-2 rounded-full transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {t.leadBtn}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-20 bg-black/80 relative z-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">{t.experiences}</span>
                <h2 className="font-editorial text-3xl md:text-4xl font-bold text-white">{t.testimonialsTitle}</h2>
              </div>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* STORYTELLING */}
        <section className="py-24 bg-black/30 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">{t.methodTag}</span>
                <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white">{t.methodTitle}</h2>
              </div>
              <p className="text-slate-400 mt-4 md:mt-0 max-w-sm text-sm font-light">
                {t.methodSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer border border-white/5">
                <div className="aspect-video bg-stone-800 relative">
                  <Image src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-80" alt={t.phase1Title} />
                  <span className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">{t.phase1}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{t.phase1Title}</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-3">{t.phase1Desc}</p>
                </div>
              </div>

              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer border border-white/5">
                <div className="aspect-video bg-stone-800 relative">
                  <Image src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-80" alt={t.phase2Title} />
                  <span className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">{t.phase2}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{t.phase2Title}</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-3">{t.phase2Desc}</p>
                </div>
              </div>

              <div className="glass-panel rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer border border-white/5">
                <div className="aspect-video bg-stone-800 relative">
                  <Image src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-80" alt={t.phase3Title} />
                  <span className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">{t.phase3}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{t.phase3Title}</h3>
                  <p className="text-sm text-slate-400 font-light line-clamp-3">{t.phase3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATALOGO DE RUTAS */}
        <section id="rutas" className="py-24 bg-black/80 backdrop-blur-lg relative z-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">{t.catalogTag}</span>
                <h2 className="font-editorial text-4xl md:text-5xl font-bold text-white">{t.catalogTitle}</h2>
              </div>
              <p className="text-slate-400 mt-4 md:mt-0 max-w-sm text-sm font-light">
                {t.catalogSub}
              </p>
            </div>

            {routes.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
                <Tent className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
                <p className="text-slate-500">{t.noRoutes}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {routes.map((route: any, i: number) => (
                  <div key={route.id} className={`group relative rounded-3xl overflow-hidden glass-panel flex flex-col ${i === 1 ? 'border-amber-500/30' : ''}`}>
                    {i === 1 && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg z-20">
                        {t.bestseller}
                      </div>
                    )}
                    <div className="aspect-[4/3] relative overflow-hidden bg-stone-800 flex items-center justify-center">
                      {route.image_url ? (
                        <Image
                          src={route.image_url}
                          alt={route.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <Mountain className="w-16 h-16 text-amber-500/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                      <span className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">{route.category}</span>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                      <div>
                        <h3 className="font-editorial text-2xl font-bold text-white mb-2">{route.title}</h3>
                        <p className="text-sm text-slate-400 mb-6 font-light line-clamp-3">{route.description || 'Te acompaño paso a paso en esta aventura.'}</p>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-center text-xs text-slate-300"><Clock className="w-4 h-4 mr-3 text-amber-500" /> {route.duration_text || `${route.duration_days} día${route.duration_days > 1 ? 's' : ''}`}</li>
                          <li className="flex items-center text-xs text-slate-300"><HeartPulse className="w-4 h-4 mr-3 text-amber-500" /> {t.level}: {route.difficulty_level}</li>
                          <li className="flex items-center text-xs text-slate-300"><CheckCircle2 className="w-4 h-4 mr-3 text-amber-500" /> {t.maxPax} {route.max_pax} {t.people}</li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.from}</span>
                          <span className="text-lg font-bold text-white">${Number(route.base_price).toLocaleString('en-US')}</span>
                        </div>
                        <Link href={`/rutas/${route.id}`} className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
                          {t.viewItinerary} <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Expediciones 1 a 1 CTA */}
            <div className="mt-16 bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 glass-panel relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2 block">{t.privateTag}</span>
                <h3 className="font-editorial text-3xl font-bold text-white mb-2">{t.privateExp}</h3>
                <p className="text-slate-400 text-sm max-w-xl">
                  {t.privateDesc}
                </p>
              </div>
              <div className="relative z-10 flex-shrink-0">
                <a href="#" className="inline-block bg-amber-500 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors text-center shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  {t.quoteBtn}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* EL CIRCULO Y PRÓXIMAS SALIDAS GRUPALES */}
        <section id="circulo" className="py-24 bg-transparent relative z-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            
            <div className="glass-panel border-blue-500/20 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden mb-16">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="text-center relative z-10">
                <h2 className="font-editorial text-4xl font-bold text-white mb-4">{t.communityTitle}</h2>
                <p className="text-slate-300 text-base font-light mb-8 max-w-xl mx-auto">
                  {t.communitySub}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="#" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20">
                    <MessageCircle className="w-5 h-5" /> {t.whatsapp}
                  </a>
                  <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 glass-panel hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all">
                    <Camera className="w-5 h-5" /> {t.instagram}
                  </a>
                </div>
              </div>
            </div>

            {/* AGENDA - SALIDAS GRUPALES */}
            <div className="mb-12 md:flex justify-between items-end">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3 block">{t.fieldTag}</span>
                <h3 className="font-editorial text-3xl font-bold text-white mb-4">{t.upcoming}</h3>
              </div>
            </div>

            {departures.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl mb-10">
                <p className="text-slate-500">{t.noDepartures}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {departures.map((dep: any) => {
                  const adv = dep.adventures_catalog;
                  const spots = (adv?.max_pax || 0) - (dep.current_pax || 0);
                  return (
                    <div key={dep.id} className="glass-panel rounded-2xl p-6 flex items-center gap-5 hover:border-amber-500/30 transition-all">
                      <div className="text-center min-w-[56px]">
                        <p className="text-2xl font-black text-white">{new Date(dep.start_date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase">
                          {new Date(dep.start_date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-white">{adv?.title || 'Expedición'}</p>
                        {spots <= 5 ? (
                          <p className="text-xs text-amber-500 font-bold animate-pulse mt-0.5">{t.only} {spots} {spots === 1 ? t.spotLeft : t.spotsLeft}</p>
                        ) : (
                          <p className="text-xs text-slate-400 mt-0.5">{t.spotsAvail}</p>
                        )}
                      </div>
                      <div className="text-right flex flex-col justify-between items-end h-full">
                        <div>
                          <p className="font-black text-white">${Number(adv?.base_price).toLocaleString('en-US')}</p>
                          <p className="text-[10px] text-slate-500 mb-2">{t.perPerson}</p>
                        </div>
                        <Link href="/reservar" className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-white bg-amber-500/10 hover:bg-amber-500 px-3 py-1.5 rounded-md transition-colors">
                          {t.book}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 pb-8 mt-auto bg-black/90 backdrop-blur-xl border-t border-white/5 text-center relative z-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
            <div className="flex justify-center items-center gap-2 mb-6">
               <span className="text-sm font-light text-slate-400 italic">by</span>
               <span className="font-editorial font-bold text-2xl tracking-wider text-white">
                  GAZ<span className="text-amber-500 italic">_Style</span>
               </span>
            </div>
            <p className="text-slate-500 text-xs font-light mb-2 max-w-md mx-auto leading-relaxed">{t.footerText}</p>
            <p className="text-slate-600 text-[10px] tracking-widest uppercase mt-4">
              &copy; 2026 GAZ_STYLE. {t.rights}
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
