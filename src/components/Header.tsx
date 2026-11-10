import React from 'react';
import { 
  Plus, 
  FolderDown, 
  LayoutGrid, 
  List, 
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onNewSkill: () => void;
  onOpenImportExport: () => void;
  onResetDefaults?: () => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalSkills: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewSkill,
  onOpenImportExport,
  viewMode,
  onToggleViewMode,
  totalSkills,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                {t('brandName')}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {t('stockedBadge', { count: totalSkills })}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                language === 'fr'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Passer en Français"
            >
              <span>🇫🇷</span>
              <span className="hidden sm:inline">FR</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-slate-400">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:text-slate-200'
              }`}
              title={t('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:text-slate-200'
              }`}
              title={t('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Import / Export Hub */}
          <button
            onClick={onOpenImportExport}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors shadow-sm"
            title={t('syncExport')}
          >
            <FolderDown className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">{t('syncExport')}</span>
          </button>

          {/* New Skill Button */}
          <button
            onClick={onNewSkill}
            className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 rounded-lg shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>{t('stockNewSkill')}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
