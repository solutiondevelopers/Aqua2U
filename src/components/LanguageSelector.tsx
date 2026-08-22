import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'pill' | 'landing';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'pill',
  className = ''
}) => {
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button Variants */}
      {variant === 'landing' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold border border-slate-200/90 shadow-2xs transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{currentLanguageOption.flag}</span>
          <span>{currentLanguageOption.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Change Language"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200/80 hover:border-sky-300 text-slate-700 shadow-2xs transition cursor-pointer"
        >
          <span className="text-sm">{currentLanguageOption.flag}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-sm">{currentLanguageOption.flag}</span>
          <span>{currentLanguageOption.nativeName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Select Language / भाषा
            </span>
            <Globe className="w-3 h-3 text-sky-600" />
          </div>

          <div className="py-1 max-h-60 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-sky-50/80 transition cursor-pointer ${
                    isSelected ? 'bg-sky-50/90 font-bold text-sky-900' : 'text-slate-700 text-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
