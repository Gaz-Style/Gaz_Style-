'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' }
  ];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[10px] font-bold text-white uppercase">{currentLang}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-stone-900 border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-50">
          {languages.map((l) => (
            <Link 
              key={l.code} 
              href={`?lang=${l.code}`}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 text-xs font-medium text-left hover:bg-white/5 transition-colors ${currentLang === l.code ? 'text-amber-500 bg-amber-500/10' : 'text-slate-300'}`}
            >
              {l.label} <span className="text-[10px] text-slate-500 ml-1">({l.code.toUpperCase()})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
