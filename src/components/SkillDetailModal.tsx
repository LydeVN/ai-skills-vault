import React, { useState, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Play, 
  Edit3, 
  CopyCheck, 
  Trash2, 
  Star, 
  Download, 
  Variable,
  BookOpen,
  Code2,
  FileText
} from 'lucide-react';
import type { Skill } from '../types/skill';
import { compileTemplate } from '../utils/variableExtractor';
import { estimateTokens, estimateCost, formatDate } from '../utils/tokenCounter';
import { MarkdownViewer } from './MarkdownViewer';
import { useLanguage } from '../context/LanguageContext';

interface SkillDetailModalProps {
  skill: Skill | null;
  onClose: () => void;
  onEdit: (skill: Skill) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLaunchPlayground: (skill: Skill, variableValues: Record<string, string>) => void;
  onCopySuccess: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onLaunchPlayground,
  onCopySuccess,
}) => {
  const { t, getCategoryLabel, getTypeLabel, getLevelLabel } = useLanguage();

  if (!skill) return null;

  // Initialize variable inputs with defaults
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (skill.variables) {
      skill.variables.forEach(v => {
        initial[v.name] = v.defaultValue || '';
      });
    }
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'rendered' | 'assembled' | 'raw' | 'skillmd'>('rendered');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Compile prompt live
  const compiledContent = useMemo(() => {
    return compileTemplate(skill.content, variableValues);
  }, [skill.content, variableValues]);

  // Generate full .SKILL.md format
  const skillMdContent = useMemo(() => {
    return `---
name: ${skill.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
description: ${skill.description}
category: ${skill.category}
level: ${skill.level}
models: ${skill.models.join(', ')}
tags: ${skill.tags.join(', ')}
version: 1.0.0
---

# ${skill.title}

${skill.description}

## Prompt Specification
\`\`\`markdown
${skill.content}
\`\`\`
`;
  }, [skill]);

  // Selected content to evaluate tokens
  const activeContent = activeTab === 'rendered' || activeTab === 'assembled' 
    ? compiledContent 
    : activeTab === 'skillmd' 
    ? skillMdContent 
    : skill.content;

  const tokenCount = estimateTokens(activeContent);
  const costEstimate = estimateCost(tokenCount);

  const handleCopy = (type: string) => {
    let textToCopy = '';
    if (type === 'rendered' || type === 'assembled') {
      textToCopy = compiledContent;
    } else if (type === 'raw') {
      textToCopy = skill.content;
    } else if (type === 'skillmd') {
      textToCopy = skillMdContent;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    onCopySuccess();
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadSkillMd = () => {
    const filename = `${skill.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.SKILL.md`;
    const blob = new Blob([skillMdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {getCategoryLabel(skill.category)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                {getTypeLabel(skill.skillType)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-950/60 text-violet-300 border border-violet-800/40">
                {getLevelLabel(skill.level)}
              </span>
              <button
                onClick={() => onToggleFavorite(skill.id)}
                className="p-1 rounded-md text-slate-500 hover:text-amber-400 transition-colors"
                title="Toggle favorite"
              >
                <Star className={`w-4 h-4 ${skill.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {skill.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {skill.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">{t('compatibleModels')}</span>
              <span className="text-slate-200 font-medium truncate block">
                {skill.models.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">{t('estimatedCost')}</span>
              <span className="text-emerald-400 font-medium">
                {costEstimate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">{t('deployments')}</span>
              <span className="text-indigo-400 font-medium">
                {t('times', { count: skill.usageCount || 0 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">{t('lastUpdated')}</span>
              <span className="text-slate-300 font-medium">
                {formatDate(skill.updatedAt)}
              </span>
            </div>
          </div>

          {/* Interactive Variables Section (if parameterized) */}
          {skill.variables && skill.variables.length > 0 && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Variable className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    {t('interactiveParams', { count: skill.variables.length })}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  {t('interactiveParamsTip')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {skill.variables.map(v => (
                  <div key={v.name} className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      {v.label || v.name}
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.name] ?? ''}
                      onChange={(e) => setVariableValues(prev => ({ ...prev, [v.name]: e.target.value }))}
                      placeholder={v.defaultValue || t('enterPlaceholder', { name: v.name })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Viewer Tabs: Rendered MD, Assembled, Raw, and .SKILL.md */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs flex-wrap">
                {/* Tab 1: Rendered Markdown */}
                <button
                  onClick={() => setActiveTab('rendered')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'rendered' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('tabRenderedMd')}</span>
                </button>

                {/* Tab 2: Assembled Prompt */}
                <button
                  onClick={() => setActiveTab('assembled')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'assembled' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{t('tabAssembledPrompt')}</span>
                </button>

                {/* Tab 3: Raw Template */}
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'raw' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{t('tabRawTemplate')}</span>
                </button>

                {/* Tab 4: .SKILL.md Spec */}
                <button
                  onClick={() => setActiveTab('skillmd')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'skillmd' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('tabSkillMd')}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>{t('tokensApprox', { count: tokenCount })}</span>
                <span>•</span>
                <span>{t('charsApprox', { count: activeContent.length })}</span>
              </div>
            </div>

            {/* Display Box */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="absolute right-3 top-3 z-10 flex items-center space-x-1.5">
                <button
                  onClick={() => handleCopy(activeTab)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1 border border-slate-700 shadow-sm transition-colors text-xs"
                >
                  {copiedType === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400">{t('copiedText')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">
                        {activeTab === 'rendered' 
                          ? t('copyRendered') 
                          : activeTab === 'assembled' 
                          ? t('copyPromptButton') 
                          : activeTab === 'skillmd' 
                          ? 'Copy .SKILL.md' 
                          : t('copyTemplateButton')}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* RENDERED MARKDOWN TAB */}
              {activeTab === 'rendered' ? (
                <div className="p-5 pt-12 overflow-y-auto max-h-80 select-text">
                  <MarkdownViewer content={compiledContent} />
                </div>
              ) : (
                /* RAW / ASSEMBLED / SKILL.MD MONOSPACE VIEW */
                <pre className="p-4 pt-12 overflow-x-auto text-slate-200 font-mono text-xs leading-relaxed max-h-80 select-text whitespace-pre-wrap break-words">
                  {activeContent}
                </pre>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-500 mr-1">{t('tagsLabel')}</span>
            {skill.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => onEdit(skill)}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex-1 sm:flex-initial"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('edit')}</span>
            </button>
            <button
              onClick={() => onDuplicate(skill.id)}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex-1 sm:flex-initial"
              title="Duplicate skill"
            >
              <CopyCheck className="w-3.5 h-3.5" />
              <span>{t('duplicate')}</span>
            </button>
            <button
              onClick={handleDownloadSkillMd}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex-1 sm:flex-initial"
              title="Download SKILL.md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('downloadSkillMd')}</span>
            </button>
            <button
              onClick={() => {
                if (confirm(t('deleteConfirm', { title: skill.title }))) {
                  onDelete(skill.id);
                  onClose();
                }
              }}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete skill"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleCopy('assembled')}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex-1 sm:flex-initial"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t('copyReadyPrompt')}</span>
            </button>
            <button
              onClick={() => onLaunchPlayground(skill, variableValues)}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-lg shadow-indigo-600/30 transition-all flex-1 sm:flex-initial active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>{t('runInPlayground')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
