'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Send, Bot, User, Phone, Search, 
  ToggleLeft, ToggleRight, MessageSquare, 
  Mountain, RefreshCw, X, Plus, Smile, Sparkles
} from 'lucide-react';
import { 
  getWhatsAppChatsAction, 
  getWhatsAppMessagesAction, 
  sendWhatsAppMessageAction, 
  toggleBotSessionAction,
  createOrStartChatAction
} from './actions';

// Icono Oficial de WhatsApp
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);


export default function LiveChatClient({ initialChats }: { initialChats: any[] }) {
  const [chats, setChats] = useState<any[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<any>(initialChats[0] || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [autoRevertSeconds, setAutoRevertSeconds] = useState<number | null>(null);
  const [showCRM, setShowCRM] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  // Modal para iniciar nuevo chat
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoRevertRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Ref para rastrear siempre el chat activo y evitar cierres obsoletos (stale closures) en intervalos
  const selectedChatRef = useRef<any>(initialChats[0] || null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const AUTO_REVERT_SECS = 180; // 3 minutos

  const clearAutoRevert = () => {
    if (autoRevertRef.current) clearInterval(autoRevertRef.current);
    autoRevertRef.current = null;
    setAutoRevertSeconds(null);
  };

  const startAutoRevert = (chatId: string) => {
    clearAutoRevert();
    setAutoRevertSeconds(AUTO_REVERT_SECS);
    let remaining = AUTO_REVERT_SECS;
    autoRevertRef.current = setInterval(async () => {
      remaining -= 1;
      setAutoRevertSeconds(remaining);
      if (remaining <= 0) {
        clearAutoRevert();
        await toggleBotSessionAction(chatId, true);
        setSelectedChat((prev: any) => prev?.id === chatId ? { ...prev, session_status: 'bot' } : prev);
        refreshChats();
      }
    }, 1000);
  };

  const refreshChats = async () => {
    try {
      const data = await getWhatsAppChatsAction();
      setChats(data);
      const current = selectedChatRef.current;
      if (current?.id) {
        const match = data.find((c: any) => c.id === current.id);
        if (match) {
          setSelectedChat((prev: any) => {
            // Si el usuario cambió de chat mientras se hacía el fetch, no sobreescribir
            if (!prev || prev.id !== match.id) return prev;
            return { ...prev, ...match };
          });
        }
      }
    } catch (err) {
      console.error('Error refreshing chats:', err);
    }
  };

  // Poll chats periodically
  useEffect(() => {
    refreshChats();
    const interval = setInterval(refreshChats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll messages for selected chat (con protección contra condiciones de carrera)
  useEffect(() => {
    if (!selectedChat?.id) return;
    
    const activeId = selectedChat.id;
    let isCancelled = false;

    const loadMessages = async () => {
      try {
        const msgs = await getWhatsAppMessagesAction(activeId);
        if (!isCancelled) {
          setMessages(msgs);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [selectedChat?.id]);

  // Manage auto-revert timer
  useEffect(() => {
    if (selectedChat?.id && selectedChat.session_status !== 'bot') {
      startAutoRevert(selectedChat.id);
    } else {
      clearAutoRevert();
    }
    return () => clearAutoRevert();
  }, [selectedChat?.id, selectedChat?.session_status]);

  // Scroll to bottom
  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
    }, 80);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length, selectedChat?.id]);

  const handleSelectChat = (chat: any) => {
    selectedChatRef.current = chat;
    setSelectedChat(chat);
    setShowMobileList(false);
  };

  const handleBackToList = () => {
    selectedChatRef.current = null;
    setShowMobileList(true);
    setSelectedChat(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || replyText;
    if (!content.trim() || !selectedChat || sending) return;

    setSending(true);
    setSendError(null);
    if (!textToSend) {
      setReplyText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }

    // Actualización optimista inmediata
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      chat_id: selectedChat.id,
      sender_type: 'human',
      message_type: 'text',
      content: content.trim(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      const res = await sendWhatsAppMessageAction(selectedChat.id, content.trim());
      if (!res.success) {
        setSendError(res.error || 'No se pudo enviar el mensaje por WhatsApp.');
      }

      const msgs = await getWhatsAppMessagesAction(selectedChat.id);
      setMessages(msgs);

      if (selectedChat.session_status === 'bot') {
        setSelectedChat({ ...selectedChat, session_status: 'human_handoff' });
        refreshChats();
      } else {
        startAutoRevert(selectedChat.id);
      }
    } catch (e: any) {
      console.error(e);
      setSendError(e.message || 'Error de conexión');
    } finally {
      setSending(false);
    }
  };

  const handleToggleBot = async () => {
    if (!selectedChat) return;
    const isBot = selectedChat.session_status === 'bot';
    const nextStatus = !isBot;
    await toggleBotSessionAction(selectedChat.id, nextStatus);
    setSelectedChat({ ...selectedChat, session_status: nextStatus ? 'bot' : 'human_handoff' });
    refreshChats();
  };

  const handleStartChat = async (phoneToUse?: string) => {
    const rawTarget = phoneToUse !== undefined ? phoneToUse : newPhoneInput;
    const phone = rawTarget.trim();
    if (!phone) {
      alert('Por favor ingresa un número de teléfono válido.');
      return;
    }

    setCreatingChat(true);
    try {
      const res = await createOrStartChatAction(phone);
      if (!res.success || !res.chat) {
        alert(res.error || 'No se pudo iniciar la conversación.');
        return;
      }

      await refreshChats();
      setSelectedChat(res.chat);
      setShowMobileList(false);
      setSearchQuery('');
      setNewPhoneInput('');
      setIsNewChatModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error de conexión.');
    } finally {
      setCreatingChat(false);
    }
  };

  // Formato de hora estándar 24h idéntico a WhatsApp Web (evita desajustes de hidratación entre Node y Chrome)
  const formatTimeDigits = (dateStr?: string | Date) => {
    if (!dateStr) return '';
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return '';
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  // Formato de fechas idéntico a WhatsApp Web
  const formatMessageDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'HOY';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'AYER';
    } else {
      const day = d.getDate();
      const monthNames = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
      ];
      return `${day} DE ${monthNames[d.getMonth()]} DE ${d.getFullYear()}`;
    }
  };

  const formatLastInteraction = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return formatTimeDigits(d);
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }
  };

  // Filtrado de chats
  const filteredChats = chats.filter(c => {
    const q = searchQuery.toLowerCase();
    const name = (c.customers?.full_name || c.phone_number || '').toLowerCase();
    const phone = (c.phone_number || '').toLowerCase();
    return name.includes(q) || phone.includes(q);
  });

  return (
    <div className="h-[calc(100dvh-64px)] lg:h-[100dvh] w-full bg-[#f0f2f5] text-slate-800 flex flex-col font-sans overflow-hidden select-none">
      
      {/* ── BARRA SUPERIOR WHATSAPP OMNICANAL ────────────────────────── */}
      <header className={`h-14 bg-[#128c7e] text-white px-4 flex items-center justify-between shrink-0 shadow-sm z-20 ${!showMobileList ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Volver al Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <h1 className="text-sm font-semibold tracking-wide">WhatsApp Business Live</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> Conectado
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setNewPhoneInput(searchQuery || '');
              setIsNewChatModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-white text-[#075e54] hover:bg-white/95 font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Chat</span>
          </button>
          <button 
            onClick={refreshChats}
            className="p-2 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
            title="Refrescar conversaciones"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── CUERPO PRINCIPAL WHATSAPP WEB ───────────────────────────── */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto overflow-hidden bg-white shadow-lg border-x border-slate-200 relative">
        
        {/* ── COLUMNA 1: LISTADO DE CHATS ── */}
        <aside className={`w-full md:w-[360px] lg:w-[410px] border-r border-[#e9edef] flex flex-col bg-white shrink-0 z-10 ${!showMobileList ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Buscador de Chats */}
          <div className="p-2.5 bg-[#f0f2f5] border-b border-[#e9edef]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#54656f] absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Busca un chat o escribe un número..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.replace(/\D/g, '').length >= 8) {
                    handleStartChat(searchQuery);
                  }
                }}
                className="w-full bg-white border border-[#e9edef] focus:border-[#00a884] rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-[#667781] outline-none shadow-sm transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Detección directa de número en la búsqueda */}
          {searchQuery.replace(/\D/g, '').length >= 8 && (
            <div className="p-3 bg-[#e7fce3] border-b border-[#b7e4c7] flex items-center justify-between gap-2 animate-fadeIn">
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#008069] uppercase flex items-center gap-1">
                  <WhatsAppIcon className="w-3 h-3" /> WhatsApp directo
                </div>
                <div className="text-xs font-mono font-bold text-slate-900 truncate">
                  {searchQuery}
                </div>
              </div>
              <button
                onClick={() => handleStartChat(searchQuery)}
                disabled={creatingChat}
                className="px-3 py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-xs flex items-center gap-1 transition-all shadow shrink-0"
              >
                {creatingChat ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Iniciar Chat
              </button>
            </div>
          )}

          {/* Lista de Chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] bg-white no-scrollbar">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[#667781]">
                <MessageSquare className="w-12 h-12 mb-2 text-[#d1d7db]" />
                <p className="text-xs font-medium">No hay conversaciones</p>
                {searchQuery.replace(/\D/g, '').length >= 8 && (
                  <button
                    onClick={() => handleStartChat(searchQuery)}
                    className="mt-3 px-4 py-2 bg-[#00a884] text-white text-xs font-bold rounded-lg shadow hover:bg-[#008f6f] transition-all"
                  >
                    Iniciar chat con {searchQuery}
                  </button>
                )}
              </div>
            ) : (
              filteredChats.map(chat => {
                const isSelected = selectedChat?.id === chat.id;
                const isBot = chat.session_status === 'bot';

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full px-3.5 py-3 text-left transition-colors flex items-center gap-3 cursor-pointer relative ${
                      isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'
                    }`}
                  >
                    {/* Avatar con Insignia WhatsApp */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#dfe5e7] flex items-center justify-center font-bold text-sm text-[#54656f] overflow-hidden">
                        {chat.customers?.full_name ? chat.customers.full_name.charAt(0) : <User className="w-6 h-6 text-[#8696a0]" />}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      </div>
                    </div>

                    {/* Datos del Contacto */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-semibold text-slate-900 truncate text-[14px]">
                          {chat.customers?.full_name || chat.phone_number}
                        </h4>
                        <span className="text-[11px] text-[#667781] shrink-0 font-sans" suppressHydrationWarning>
                          {formatLastInteraction(chat.last_message_at || chat.last_interaction)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] text-[#667781] truncate flex-1 font-light">
                          {chat.last_message || 'Conversación iniciada'}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                          isBot ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {isBot ? '🤖 IA' : '👤 Humano'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ── COLUMNA 2: ÁREA CENTRAL DE CONVERSACIÓN WHATSAPP ── */}
        <main className={`flex-1 flex flex-col bg-[#efeae2] relative h-full min-w-0 overflow-hidden ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Trama de Fondo WhatsApp */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06]" 
            style={{ 
              backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/887/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp-thumbnail.jpg")', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }} 
          />

          {selectedChat ? (
            <>
              {/* Header de la Conversación */}
              <div className="h-14 px-3 sm:px-4 border-b border-[#e9edef] bg-[#f0f2f5] flex items-center justify-between shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button 
                    onClick={handleBackToList}
                    className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg"
                    title="Volver a chats"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#54656f]" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                      {selectedChat.customers?.full_name || selectedChat.phone_number}
                    </h3>
                    <p className="text-[11px] text-[#667781] font-mono leading-tight truncate">
                      {selectedChat.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedChat.session_status !== 'bot' && autoRevertSeconds !== null && (
                    <span className="hidden sm:inline-block text-[11px] text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-medium animate-pulse">
                      IA reanuda en {autoRevertSeconds}s
                    </span>
                  )}

                  {/* Toggle Bot / Humano */}
                  <button 
                    onClick={handleToggleBot}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm ${
                      selectedChat.session_status === 'bot' 
                        ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' 
                        : 'bg-[#00a884] text-white border-[#00a884] hover:bg-[#008f6f]'
                    }`}
                  >
                    {selectedChat.session_status === 'bot' ? <ToggleRight className="w-4 h-4 text-[#00a884]" /> : <ToggleLeft className="w-4 h-4 text-white" />}
                    <span className="hidden sm:inline">{selectedChat.session_status === 'bot' ? 'Modo IA Activa' : 'Modo Operador Humano'}</span>
                    <span className="sm:hidden">{selectedChat.session_status === 'bot' ? 'IA' : 'Humano'}</span>
                  </button>

                  {/* Botón Abrir Ficha CRM */}
                  <button
                    onClick={() => setShowCRM(!showCRM)}
                    className={`p-2 rounded-full border text-xs transition-colors ${
                      showCRM ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                    title="Alternar Ficha Aventurero CRM"
                  >
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Historial de Mensajes con Burbujas WhatsApp */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 z-10 scroll-smooth no-scrollbar">
                {messages.map((msg, index) => {
                  const isCustomer = msg.sender_type === 'customer' || msg.sender_type === 'client';
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const showDateSeparator = !prevMsg || 
                    new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();

                  return (
                    <React.Fragment key={msg.id || index}>
                      {showDateSeparator && (
                        <div className="flex justify-center my-3">
                          <span className="text-[12px] font-medium text-[#54656f] bg-white/95 px-3 py-1 rounded-lg shadow-sm border border-slate-200/50" suppressHydrationWarning>
                            {formatMessageDate(msg.created_at)}
                          </span>
                        </div>
                      )}

                      <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                        <div 
                          className={`relative max-w-[85%] sm:max-w-[70%] rounded-xl shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] px-3 py-1.5 ${
                            isCustomer 
                              ? 'bg-white text-slate-900 rounded-tl-none before:absolute before:top-0 before:-left-[8px] before:w-0 before:h-0 before:border-r-[8px] before:border-r-white before:border-b-[12px] before:border-b-transparent' 
                              : 'bg-[#dcf8c6] text-slate-900 rounded-tr-none after:absolute after:top-0 after:-right-[8px] after:w-0 after:h-0 after:border-l-[8px] after:border-l-[#dcf8c6] after:border-b-[12px] after:border-b-transparent'
                          }`}
                        >
                          {/* Indicador de quién responde (Operador / IA) */}
                          {!isCustomer && (
                            <div className="flex items-center gap-1 mb-0.5 text-[#075e54]">
                              {msg.sender_type === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              <span className="text-[11px] font-bold">
                                {msg.sender_type === 'bot' ? 'Guía IA Santiago' : 'Operador Santiago Hiking'}
                              </span>
                            </div>
                          )}

                          {/* Contenido del Mensaje */}
                          <p className="text-[14px] leading-[19px] whitespace-pre-wrap break-words pb-3">
                            {msg.content}
                            <span className="inline-block w-14 h-1"></span>
                          </p>

                          {/* Hora y Doble Check Azul */}
                          <div 
                            className={`absolute bottom-1 right-2 text-[10.5px] flex items-center gap-1 ${
                              isCustomer ? 'text-[#667781]' : 'text-[#54656f]'
                            }`}
                            suppressHydrationWarning
                          >
                            {formatTimeDigits(msg.created_at)}
                            {!isCustomer && <span className="text-[#53bdeb] font-bold">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>


              {/* Input WhatsApp con Cápsula Inferior */}
              <div className="bg-[#f0f2f5] p-2.5 z-20 shrink-0 border-t border-[#e9edef]">
                {sendError && (
                  <div className="mb-2 text-[12px] text-red-600 text-center bg-red-50 border border-red-200 py-1 rounded-lg">
                    ⚠️ {sendError}
                  </div>
                )}

                <div className="flex items-end gap-2 max-w-5xl mx-auto relative">
                  
                  {/* Selector de Emojis */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-[56px] left-0 sm:left-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 w-[300px] max-w-[calc(100vw-32px)] max-h-[260px] overflow-y-auto no-scrollbar">
                      {[
                        { label: 'Frecuentes', emojis: ['😊', '👍', '❤️', '🙏', '✨', '🎉', '💯', '🔥', '👏', '😍', '🏔️', '🥾'] },
                        { label: 'Montaña & Aventura', emojis: ['🏔️', '⛰️', '🌄', '🌅', '🥾', '🧗', '🎒', '🧭', '🏕️', '🔦', '🌲', '☀️'] },
                        { label: 'Caras', emojis: ['😀', '😄', '😁', '😆', '🥹', '😅', '😂', '🙂', '😉', '😌', '🤔', '😎'] },
                        { label: 'Gestos', emojis: ['👋', '🤝', '✌️', '🤞', '👌', '🫶', '🙌', '👀', '💬', '📸', '📍', '⭐'] },
                      ].map((cat) => (
                        <div key={cat.label} className="mb-2">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 px-1">{cat.label}</p>
                          <div className="grid grid-cols-6 gap-1">
                            {cat.emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setReplyText(prev => prev + emoji);
                                  textareaRef.current?.focus();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cápsula de Texto */}
                  <div className="flex-1 bg-white rounded-3xl flex items-center px-2 min-h-[44px] shadow-sm border border-slate-200 focus-within:border-[#00a884]">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-[#00a884]' : 'text-[#54656f] hover:text-slate-800'}`}
                      title="Emojis"
                    >
                      <Smile className="w-6 h-6" />
                    </button>

                    <textarea
                      ref={textareaRef}
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                        setSendError(null);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                        if (selectedChat?.id && selectedChat?.session_status !== 'bot') {
                          startAutoRevert(selectedChat.id);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      onFocus={() => setShowEmojiPicker(false)}
                      placeholder="Escribe un mensaje por WhatsApp..."
                      className="w-full py-2.5 px-2 text-[14px] bg-transparent outline-none resize-none max-h-[120px] leading-snug text-slate-900 no-scrollbar overflow-hidden"
                      rows={1}
                    />
                  </div>

                  {/* Botón Circular de Enviar WhatsApp */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!replyText.trim() || sending}
                    className="bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full w-[44px] h-[44px] flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 shadow-md"
                    title="Enviar mensaje"
                  >
                    {sending ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Estado Vacío Estilo WhatsApp Web */
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-[#f0f2f5] z-10 border-b-8 border-[#00a884]">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#25D366] mb-4 shadow-sm">
                <WhatsAppIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-light text-[#41525d] mb-2">WhatsApp Web Live Chat</h2>
              <p className="text-sm text-[#667781] max-w-md leading-relaxed">
                Selecciona una conversación del listado para responder a los aventureros o haz clic en <strong>+ Nuevo Chat</strong> para hablarle a cualquier número.
              </p>
            </div>
          )}
        </main>

        {/* ── COLUMNA 3: FICHA AVENTURERO CRM (DRAWER LATERAL) ── */}
        {showCRM && selectedChat && (
          <>
            <div 
              onClick={() => setShowCRM(false)}
              className="2xl:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-85 2xl:static 2xl:z-auto border-l border-[#e9edef] bg-white p-5 space-y-5 overflow-y-auto shrink-0 text-xs shadow-2xl 2xl:shadow-none animate-in slide-in-from-right duration-200 h-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-[#075e54] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5" /> Ficha Aventurero CRM
                </span>
                <button 
                  onClick={() => setShowCRM(false)} 
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedChat.customers ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Identificación</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedChat.customers.full_name}</p>
                    <p className="text-slate-600 text-xs">{selectedChat.customers.email || 'Sin correo registrado'}</p>
                    <p className="text-[#008069] font-mono font-bold text-xs">{selectedChat.customers.phone}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Ficha Médica & Montaña</span>
                    
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-600">Grupo Sanguíneo:</span>
                      <strong className="text-amber-700">{selectedChat.customers.blood_type || 'No declarado'}</strong>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-600">Expediciones:</span>
                      <strong className="text-emerald-700">{selectedChat.customers.total_ascents || 0} Salidas</strong>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Contacto Emergencia:</span>
                      <p className="text-slate-800 font-medium">{selectedChat.customers.emergency_contact || 'No asignado'}</p>
                    </div>

                    {selectedChat.customers.medical_notes && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px]">
                        <strong className="block text-[10px] uppercase text-red-900 mb-0.5">Notas Médicas / Alergias:</strong>
                        {selectedChat.customers.medical_notes}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/admin/registro-aventurero"
                    className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-bold rounded-xl text-center block transition-colors shadow-sm"
                  >
                    Ver Ficha Completa en CRM →
                  </Link>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 space-y-2">
                  <User className="w-8 h-8 mx-auto opacity-30" />
                  <p className="font-medium">Número no registrado en la base de clientes.</p>
                  <p className="text-[11px] text-slate-400">Al registrar una reserva o completar la ficha de aventurero, se vinculará automáticamente.</p>
                </div>
              )}
            </aside>
          </>
        )}

      </div>

      {/* ── MODAL: NUEVA CONVERSACIÓN DE WHATSAPP ─────────────────── */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsNewChatModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#25D366]">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Iniciar Conversación WhatsApp</h3>
                <p className="text-xs text-slate-500">Línea Oficial Santiago Hiking</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Ingresa el número al que deseas contactar. Si es de Chile, puedes escribir los 9 dígitos (ej: <span className="text-[#008069] font-mono font-bold">942904843</span>) o en formato internacional (<span className="text-[#008069] font-mono font-bold">56942904843</span>).
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleStartChat();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">
                  Número de Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="56942904843 ó 942904843"
                    value={newPhoneInput}
                    onChange={e => setNewPhoneInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#00a884] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-[#075e54] font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Vinculación inteligente
                </div>
                <p>
                  Si este número pertenece a un aventurero con ficha CRM o reservas previas, su perfil médico se vinculará automáticamente.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingChat || !newPhoneInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  {creatingChat ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Abrir Chat</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
