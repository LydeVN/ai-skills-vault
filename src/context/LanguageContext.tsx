import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
  getCategoryLabel: (category: string) => string;
  getTypeLabel: (type: string) => string;
  getLevelLabel: (level: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'ai_skills_vault_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') {
        return saved;
      }
      // If browser language is French, default to French!
      if (navigator.language.startsWith('fr')) {
        return 'fr';
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let text = (dict as any)[key] || (translations.en as any)[key] || key;
    if (typeof text !== 'string') {
      return String(text);
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  const getCategoryLabel = (category: string): string => {
    const dict = translations[language].categories as Record<string, string>;
    return dict[category] || category;
  };

  const getTypeLabel = (type: string): string => {
    const dict = translations[language].skillTypes as Record<string, string>;
    return dict[type] || type;
  };

  const getLevelLabel = (level: string): string => {
    const dict = translations[language].levels as Record<string, string>;
    return dict[level] || level;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getCategoryLabel,
      getTypeLabel,
      getLevelLabel,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
