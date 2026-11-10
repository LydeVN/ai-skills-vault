import React, { useState } from 'react';
import { 
  Star, 
  Copy, 
  Check, 
  Play, 
  Variable, 
  Sparkles, 
  Terminal, 
  Bot, 
  FileCode
} from 'lucide-react';
import type { Skill, SkillType } from '../types/skill';
import { estimateTokens } from '../utils/tokenCounter';
import { useLanguage } from '../context/LanguageContext';

interface SkillCardProps {
  skill: Skill;
  onSelect: (skill: Skill) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onPlayground: (skill: Skill, e: React.MouseEvent) => void;
  onFastCopy: (skill: Skill, e: React.MouseEvent) => void;
  viewMode: 'grid' | 'list';
}

const TYPE_ICONS: Record<SkillType, any> = {
  prompt: Sparkles,
  system_instruction: Terminal,
  tool_mcp: FileCode,
  agent_workflow: Bot,
  few_shot: Sparkles,
};

const TYPE_COLORS: Record<SkillType, string> = {
  prompt: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  system_instruction: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  tool_mcp: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  agent_workflow: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  few_shot: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-slate-800 text-slate-300 border-slate-700',
  Intermediate: 'bg-sky-950/70 text-sky-400 border-sky-800/60',
  Advanced: 'bg-violet-950/70 text-violet-400 border-violet-800/60',
  Expert: 'bg-rose-950/70 text-rose-400 border-rose-800/60',
};

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onSelect,
  onToggleFavorite,
  onPlayground,
  onFastCopy,
  viewMode,
}) => {
  const { t, getTypeLabel, getLevelLabel } = useLanguage();
  const [copied, setCopied] = useState(false);
  const TypeIcon = TYPE_ICONS[skill.skillType] || Sparkles;
  const typeColor = TYPE_COLORS[skill.skillType] || TYPE_COLORS.prompt;
  const tokens = estimateTokens(skill.content);
  const varCount = skill.variables ? skill.variables.length : 0;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(skill.content);
    setCopied(true);
    onFastCopy(skill, e);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onSelect(skill)}
        className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer gap-4"
      >
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          <button
            onClick={(e) => onToggleFavorite(skill.id, e)}
            className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors"
          >
            <Star className={`w-4 h-4 ${skill.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border ${typeColor}`}>
                <TypeIcon className="w-3 h-3" />
                <span>{getTypeLabel(skill.skillType)}</span>
              </span>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-300 transition-colors truncate">
                {skill.title}
              </span>
              <span className={`text-[10px] px-2 py-0.2 rounded border ${LEVEL_COLORS[skill.level] || 'text-slate-400'}`}>
                {getLevelLabel(skill.level)}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              {skill.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end border-t border-slate-800/60 md:border-t-0 pt-2 md:pt-0">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            {varCount > 0 ? (
              <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Variable className="w-3 h-3" />
                <span>{t('varsBadge', { count: varCount })}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">{t('staticBadge')}</span>
            )}
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-400">
              {t('tokensApprox', { count: tokens })}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={(e) => onPlayground(skill, e)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              title={t('testPlayground')}
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg transition-colors ${
                copied 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={t('copyPrompt')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view card
  return (
    <div
      onClick={() => onSelect(skill)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/90 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
    >
      <div>
        {/* Top bar: Type, Category, Favorite */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border ${typeColor}`}>
              <TypeIcon className="w-3.5 h-3.5" />
              <span>{getTypeLabel(skill.skillType)}</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${LEVEL_COLORS[skill.level] || 'text-slate-400'}`}>
              {getLevelLabel(skill.level)}
            </span>
          </div>
          <button
            onClick={(e) => onToggleFavorite(skill.id, e)}
            className="p-1 rounded-lg text-slate-500 hover:text-amber-400 transition-colors"
          >
            <Star className={`w-4 h-4 ${skill.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {skill.tags.length > 3 && (
            <span className="text-[10px] text-slate-500 px-1 py-0.5">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          {varCount > 0 ? (
            <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-500/20">
              <Variable className="w-3 h-3" />
              <span>{t('varsBadge', { count: varCount })}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">{t('staticBadge')}</span>
          )}
          <span className="text-[11px]">{t('tokensApprox', { count: tokens })}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => onPlayground(skill, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            title={t('testPlayground')}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-colors ${
              copied 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={t('copyPrompt')}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
