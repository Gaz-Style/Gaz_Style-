'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '/';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' }
  ];

  // Genera URL limpia con subcarpeta (/en, /pt, etc. o / para español)
  const getLanguageUrl = (langCode: string) => {
    const cleanPath = pathname.replace(/^\/(en|pt|de|fr)(\/|$)/, '/');
    if (langCode === 'es') {
      return cleanPath === '' ? '/' : cleanPath;
    }
    return cleanPath === '/' ? `/${langCode}` : `/${langCode}${cleanPath}`;
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold tracking-wider text-stone-200 hover:text-white transition-all cursor-pointer select-none rounded-lg hover:bg-white/10"
        title="Cambiar idioma / Change language"
        aria-label="Cambiar idioma"
      >
        <span>{currentLang.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-stone-950/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {languages.map((l) => (
            <Link 
              key={l.code} 
              href={getLanguageUrl(l.code)}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2.5 text-xs font-medium text-left hover:bg-white/10 transition-colors ${currentLang === l.code ? 'text-amber-400 bg-white/10 font-bold' : 'text-stone-300'}`}
            >
              {l.label} <span className="text-[10px] text-stone-400 ml-1">({l.code.toUpperCase()})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
