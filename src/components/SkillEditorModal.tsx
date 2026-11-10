import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Variable, 
  Trash2, 
  Code, 
  BookTemplate
} from 'lucide-react';
import type { 
  Skill, 
  SkillCategory, 
  SkillType, 
  SkillLevel, 
  ModelTarget, 
  SkillVariable 
} from '../types/skill';
import { extractVariables } from '../utils/variableExtractor';
import { estimateTokens } from '../utils/tokenCounter';
import { useLanguage } from '../context/LanguageContext';

interface SkillEditorModalProps {
  skillToEdit?: Skill | null;
  onClose: () => void;
  onSave: (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
}

const CATEGORIES: SkillCategory[] = [
  'Coding & Architecture',
  'Agentic Workflows',
  'Security & Auditing',
  'Data & Analytics',
  'Prompt Engineering',
  'Writing & Docs',
  'DevOps & Cloud',
  'Custom',
];

const SKILL_TYPES: { value: SkillType }[] = [
  { value: 'prompt' },
  { value: 'system_instruction' },
  { value: 'tool_mcp' },
  { value: 'agent_workflow' },
  { value: 'few_shot' },
];

const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const ALL_MODELS: ModelTarget[] = [
  'Universal',
  'Gemini 1.5/2.0',
  'Claude 3.5 Sonnet',
  'GPT-4o',
  'Antigravity / Cursor',
  'Local / Ollama',
];

export const SkillEditorModal: React.FC<SkillEditorModalProps> = ({
  skillToEdit,
  onClose,
  onSave,
}) => {
  const { t, language, getCategoryLabel, getTypeLabel, getLevelLabel } = useLanguage();
  const isEditing = !!skillToEdit;
  const isFr = language === 'fr';

  const [title, setTitle] = useState(skillToEdit?.title || '');
  const [description, setDescription] = useState(skillToEdit?.description || '');
  const [category, setCategory] = useState<SkillCategory>(skillToEdit?.category || 'Coding & Architecture');
  const [skillType, setSkillType] = useState<SkillType>(skillToEdit?.skillType || 'prompt');
  const [level, setLevel] = useState<SkillLevel>(skillToEdit?.level || 'Intermediate');
  const [models, setModels] = useState<ModelTarget[]>(skillToEdit?.models || ['Universal']);
  const [tagsInput, setTagsInput] = useState(skillToEdit?.tags?.join(', ') || 'AI, Agent, Prompt');
  const [content, setContent] = useState(skillToEdit?.content || '');
  const [variables, setVariables] = useState<SkillVariable[]>(skillToEdit?.variables || []);
  const [author, setAuthor] = useState(skillToEdit?.author || (isFr ? 'Mon Coffre' : 'My Vault'));

  const tokenCount = estimateTokens(content);

  // Quick Starters tailored by language
  const starterTemplates = {
    react_agent: {
      title: isFr ? 'Boucle d\'Agent Autonome ReAct' : 'Autonomous ReAct Agent Loop',
      desc: isFr ? 'Boucle Pensée-Action-Observation avec appel d\'outils et auto-correction' : 'Thought-Action-Observation loop with tool calling',
      type: 'agent_workflow' as SkillType,
      category: 'Agentic Workflows' as SkillCategory,
      content: isFr ? `Vous agissez en tant qu'agent autonome de résolution de problèmes appliquant le paradigme ReAct (Raisonnement + Action).

Objectif : {{objectif_tache}}
Outils Disponibles : {{liste_outils}}

Protocole d'exécution :
Pour chaque étape, structurez impérativement votre réponse ainsi :
Pensée : Décomposition du problème, analyse des faits et choix du prochain outil.
Action : {"outil": "<nom_outil>", "arguments": { ... }}
Observation : [L'environnement fournira ici le résultat de l'exécution]
... (Répéter jusqu'à validation complète de l'objectif)

Réponse Finale : Synthèse claire de la solution avec preuves de validation.`
        : `You are an autonomous problem-solving agent executing via the ReAct loop.

Goal: {{task_goal}}
Available Tools: {{tools_list}}

Operating Instructions:
1. Thought: Analyze current state and plan next step.
2. Action: Call tool with JSON arguments.
3. Observation: Review output.
4. Final Answer: Synthesize conclusion.`
    },
    code_review: {
      title: isFr ? 'Relecteur de Code & Auditeur Senior' : 'Strict Senior Code Reviewer',
      desc: isFr ? 'Analyse rigoureuse de code axée sur la robustesse, la sécurité et SOLID' : 'High standard code analysis focusing on correctness and performance',
      type: 'system_instruction' as SkillType,
      category: 'Coding & Architecture' as SkillCategory,
      content: isFr ? `Vous êtes un Ingénieur Logiciel Principal et Architecte Système.
Effectuez une revue critique du code {{langage}} suivant :
- Fuites mémoire, conditions de course (race conditions), cas limites aux frontières
- Respect des principes SOLID, DRY et séparation des responsabilités
- Lisibilité, typage strict et style idiomatique

Code Cible :
\`\`\`
{{extrait_code}}
\`\`\`

Rédigez votre bilan avec des étiquettes de criticité [CRITIQUE], [AVERTISSEMENT], [SUGGESTION] et fournissez le code corrigé.`
        : `You are a Principal Software Engineer.
Review the following {{language}} code for:
- Memory leaks, race conditions, edge-case failure modes
- Adherence to SOLID principles and DRY
- Readability and idiomatic style

Target Code:
\`\`\`
{{code_snippet}}
\`\`\`

Provide a Markdown summary with severity tags [CRITICAL], [WARNING], [SUGGESTION].`
    },
    skill_md: {
      title: isFr ? 'Générateur de Spécification SKILL.md Antigravity' : 'Antigravity SKILL.md Agent Capability',
      desc: isFr ? 'Génère un fichier SKILL.md normalisé pour les agents IA d\'Antigravity' : 'Standardized skill definition file for Antigravity AI agents',
      type: 'system_instruction' as SkillType,
      category: 'Prompt Engineering' as SkillCategory,
      content: `---
name: {{nom_competence}}
description: {{description_competence}}
version: 1.0.0
---

# {{nom_competence}}

## Description & Déclencheur
Lorsque l'utilisateur demande de {{action_declencheur}}, exécutez ce protocole.

## Étapes Opérationnelles :
1. Vérification des prérequis : {{prerequis}}
2. Exécution de la tâche principale : {{etapes_execution}}
3. Validation avec liste de contrôle de sécurité.`
    }
  };

  const handleAutoDetectVariables = () => {
    const detected = extractVariables(content);
    const merged = detected.map(d => {
      const existing = variables.find(v => v.name === d.name);
      return existing || d;
    });
    setVariables(merged);
  };

  const toggleModel = (model: ModelTarget) => {
    if (models.includes(model)) {
      if (models.length > 1) {
        setModels(models.filter(m => m !== model));
      }
    } else {
      setModels([...models, model]);
    }
  };

  const handleApplyTemplate = (key: keyof typeof starterTemplates) => {
    const template = starterTemplates[key];
    if (!template) return;
    setTitle(template.title);
    setDescription(template.desc);
    setCategory(template.category);
    setSkillType(template.type);
    setContent(template.content);
    setVariables(extractVariables(template.content));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert(isFr ? 'Veuillez renseigner au moins un titre et le contenu de la compétence.' : 'Please provide at least a title and skill content.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      skillType,
      level,
      models,
      tags: tags.length > 0 ? tags : ['General'],
      content,
      variables,
      isFavorite: skillToEdit?.isFavorite || false,
      rating: skillToEdit?.rating || 5,
      author: author.trim() || (isFr ? 'Mon Coffre' : 'My Vault'),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? t('editSkillTitle') : t('stockNewTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('editorSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Quick Starter Templates */}
          {!isEditing && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <BookTemplate className="w-4 h-4 text-indigo-400" />
                <span className="font-medium text-slate-300">{t('quickStarters')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('react_agent')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-300 transition-colors"
                >
                  ⚡ {isFr ? 'Boucle ReAct' : 'ReAct Agent'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('code_review')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-300 transition-colors"
                >
                  🛡️ {isFr ? 'Revue de Code Senior' : 'Senior Code Review'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('skill_md')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-300 transition-colors"
                >
                  📋 SKILL.md
                </button>
              </div>
            </div>
          )}

          {/* Title & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('skillTitleLabel')}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('skillTitlePlaceholder')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t('summaryDescLabel')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('summaryDescPlaceholder')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type & Level & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('skillType')}
              </label>
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value as SkillType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {SKILL_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{getTypeLabel(type.value)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('complexityLevel')}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{getLevelLabel(lvl)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('tagsLabelInput')}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="OWASP, Security, Code"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Model Compatibility Multi-select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t('targetModel')}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_MODELS.map(model => {
                const isSelected = models.includes(model);
                return (
                  <button
                    type="button"
                    key={model}
                    onClick={() => toggleModel(model)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {model}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content / Prompt Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('promptContentLabel')}</span>
              </label>
              <div className="flex items-center space-x-3 text-xs">
                <button
                  type="button"
                  onClick={handleAutoDetectVariables}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-[11px]"
                  title="Scan template for {{placeholders}}"
                >
                  <Variable className="w-3 h-3" />
                  <span>{t('autoDetectVars')}</span>
                </button>
                <span className="text-slate-500">{t('tokensApprox', { count: tokenCount })}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {t('promptContentTip')}
            </p>

            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('promptContentPlaceholder')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
            />
          </div>

          {/* Detected Variables List */}
          {variables.length > 0 && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Variable className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('configuredVars', { count: variables.length })}</span>
                </h4>
              </div>

              <div className="space-y-2">
                {variables.map((v, idx) => (
                  <div key={v.name} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                    <span className="sm:col-span-3 font-mono font-semibold text-emerald-400 truncate">
                      &#123;&#123;{v.name}&#125;&#125;
                    </span>
                    <input
                      type="text"
                      placeholder="Display label"
                      value={v.label}
                      onChange={(e) => {
                        const updated = [...variables];
                        updated[idx].label = e.target.value;
                        setVariables(updated);
                      }}
                      className="sm:col-span-4 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Default value"
                      value={v.defaultValue || ''}
                      onChange={(e) => {
                        const updated = [...variables];
                        updated[idx].defaultValue = e.target.value;
                        setVariables(updated);
                      }}
                      className="sm:col-span-4 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setVariables(variables.filter((_, i) => i !== idx))}
                      className="sm:col-span-1 p-1 text-slate-500 hover:text-rose-400 justify-self-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t('authorLabel')}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t('authorPlaceholder')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? t('saveChanges') : t('saveStock')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
