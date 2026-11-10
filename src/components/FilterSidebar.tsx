import React from 'react';
import { 
  Search, 
  X, 
  Star, 
  Bot, 
  Layers
} from 'lucide-react';
import type { SkillFilterState } from '../types/skill';
import { useLanguage } from '../context/LanguageContext';

interface FilterSidebarProps {
  filters: SkillFilterState;
  onFilterChange: (updates: Partial<SkillFilterState>) => void;
  onResetFilters: () => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

const CATEGORY_KEYS = [
  'Coding & Architecture',
  'Agentic Workflows',
  'Security & Auditing',
  'Data & Analytics',
  'Prompt Engineering',
  'Writing & Docs',
  'DevOps & Cloud',
];

const SKILL_TYPES = [
  { value: 'All', icon: '⚡' },
  { value: 'prompt', icon: '💬' },
  { value: 'system_instruction', icon: '📜' },
  { value: 'tool_mcp', icon: '🔧' },
  { value: 'agent_workflow', icon: '🤖' },
];

const MODELS = [
  'All',
  'Universal',
  'Gemini 1.5/2.0',
  'Claude 3.5 Sonnet',
  'GPT-4o',
  'Antigravity / Cursor',
  'Local / Ollama'
];

const RAW_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categoryCounts,
  totalCount,
}) => {
  const { t, getCategoryLabel, getTypeLabel, getLevelLabel } = useLanguage();

  const isFiltered = 
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.skillType !== 'All' ||
    filters.level !== 'All' ||
    filters.model !== 'All' ||
    filters.onlyFavorites;

  return (
    <div className="space-y-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
      
      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {t('searchLabel')}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Favorites Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <label 
          onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
            filters.onlyFavorites
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Star className={`w-4 h-4 ${filters.onlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="text-xs font-medium">{t('favoritesOnly')}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {filters.onlyFavorites ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>

      {/* Categories */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('category')}</span>
          </label>
          {filters.category !== 'All' && (
            <button
              onClick={() => onFilterChange({ category: 'All' })}
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          {/* All category */}
          <button
            onClick={() => onFilterChange({ category: 'All' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.category === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className="truncate">{t('allCategories')}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              filters.category === 'All' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {totalCount}
            </span>
          </button>

          {CATEGORY_KEYS.map(catKey => {
            const count = categoryCounts[catKey] || 0;
            const isSelected = filters.category === catKey;
            return (
              <button
                key={catKey}
                onClick={() => onFilterChange({ category: catKey })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{getCategoryLabel(catKey)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Type */}
      <div className="pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('skillType')}</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {SKILL_TYPES.map(type => {
            const isSelected = filters.skillType === type.value;
            const label = type.value === 'All' ? t('allTypes') : getTypeLabel(type.value);
            return (
              <button
                key={type.value}
                onClick={() => onFilterChange({ skillType: type.value })}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{type.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Model Filter */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {t('targetModel')}
        </label>
        <select
          value={filters.model}
          onChange={(e) => onFilterChange({ model: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {MODELS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Complexity Level */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {t('complexityLevel')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RAW_LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => onFilterChange({ level: lvl })}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filters.level === lvl
                  ? 'bg-slate-200 text-slate-900 font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lvl === 'All' ? t('allLevels') : getLevelLabel(lvl)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="pt-2 border-t border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {t('sortOrder')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="updatedAt">{t('recentlyUpdated')}</option>
            <option value="title">{t('titleAZ')}</option>
            <option value="usageCount">{t('mostUsed')}</option>
            <option value="rating">{t('topRated')}</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="desc">{t('descending')}</option>
            <option value="asc">{t('ascending')}</option>
          </select>
        </div>
      </div>

      {/* Reset button */}
      {isFiltered && (
        <button
          onClick={onResetFilters}
          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-rose-400 border border-dashed border-slate-800 hover:border-rose-500/40 rounded-xl transition-colors"
        >
          {t('resetFilters')}
        </button>
      )}

    </div>
  );
};
