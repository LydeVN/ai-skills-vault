import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileJson, 
  FileText, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertTriangle,
  FolderArchive
} from 'lucide-react';
import type { Skill } from '../types/skill';
import { useLanguage } from '../context/LanguageContext';

interface ImportExportModalProps {
  skills: Skill[];
  onClose: () => void;
  onImport: (skills: Skill[], mode: 'merge' | 'replace') => void;
  onResetDefaults: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  skills,
  onClose,
  onImport,
  onResetDefaults,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'reset'>('export');
  const [jsonInput, setJsonInput] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const jsonString = JSON.stringify(skills, null, 2);

  // Export full JSON file
  const handleExportJson = () => {
    const filename = `ai-skills-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({ text: language === 'fr' ? 'Sauvegarde JSON téléchargée avec succès !' : 'Backup JSON downloaded successfully!' });
  };

  // Export consolidated Markdown
  const handleExportMarkdown = () => {
    const filename = `ai-skills-library-${new Date().toISOString().split('T')[0]}.md`;
    let md = language === 'fr' 
      ? `# Inventaire du Coffre de Compétences IA\n\nExporté le ${new Date().toLocaleString('fr-FR')}\nTotal des compétences : ${skills.length}\n\n---\n\n`
      : `# AI Skills Vault Inventory\n\nExported on ${new Date().toLocaleString()}\nTotal Skills: ${skills.length}\n\n---\n\n`;

    skills.forEach((s, idx) => {
      md += `## ${idx + 1}. ${s.title}\n`;
      md += `- **${language === 'fr' ? 'Catégorie' : 'Category'}**: ${s.category}\n`;
      md += `- **${language === 'fr' ? 'Type' : 'Type'}**: ${s.skillType}\n`;
      md += `- **${language === 'fr' ? 'Complexité' : 'Complexity'}**: ${s.level}\n`;
      md += `- **${language === 'fr' ? 'Modèles' : 'Models'}**: ${s.models.join(', ')}\n`;
      md += `- **Tags**: ${s.tags.join(', ')}\n\n`;
      md += `### ${language === 'fr' ? 'Description' : 'Description'}\n${s.description}\n\n`;
      md += `### ${language === 'fr' ? 'Contenu / Modèle de Prompt' : 'Content / Prompt Template'}\n\`\`\`\n${s.content}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage({ text: language === 'fr' ? 'Bibliothèque Markdown consolidée téléchargée !' : 'Consolidated Markdown library downloaded!' });
  };

  // Copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Import JSON file via input file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImport(parsed, importMode);
          setStatusMessage({ text: t('toastImportSuccess', { count: parsed.length }) });
        } else {
          setStatusMessage({ text: language === 'fr' ? 'JSON invalide : tableau de compétences attendu.' : 'Invalid JSON: Expected an array of skills.', error: true });
        }
      } catch (err: any) {
        setStatusMessage({ text: `Erreur JSON: ${err.message}`, error: true });
      }
    };
    reader.readAsText(file);
  };

  // Import from pasted textarea
  const handleImportPasted = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        onImport(parsed, importMode);
        setStatusMessage({ text: t('toastImportSuccess', { count: parsed.length }) });
        setJsonInput('');
      } else {
        setStatusMessage({ text: language === 'fr' ? 'JSON invalide : tableau de compétences attendu.' : 'Invalid JSON: Expected an array of skills.', error: true });
      }
    } catch (err: any) {
      setStatusMessage({ text: `Erreur JSON: ${err.message}`, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('syncModalTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('syncModalSubtitle')}
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

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2">
          <button
            onClick={() => { setActiveTab('export'); setStatusMessage(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('tabExport', { count: skills.length })}
          </button>
          <button
            onClick={() => { setActiveTab('import'); setStatusMessage(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('tabImport')}
          </button>
          <button
            onClick={() => { setActiveTab('reset'); setStatusMessage(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'reset'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('tabReset')}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              statusMessage.error 
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' 
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            }`}>
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('exportDesc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportJson}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800/80 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <FileJson className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white mb-0.5">{t('downloadJsonBackup')}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t('downloadJsonSub')}
                  </p>
                </button>

                <button
                  onClick={handleExportMarkdown}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <FileText className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white mb-0.5">{t('exportMarkdownAll')}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t('exportMarkdownSub')}
                  </p>
                </button>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('rawJsonPreview')}
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copiedText') : t('copyJson')}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={jsonString}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-xs font-medium text-slate-300">{t('importModeLabel')}</label>
                <div className="flex items-center space-x-3 text-xs">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="accent-indigo-500"
                    />
                    <span>{t('importMerge')}</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-indigo-500"
                    />
                    <span>{t('importReplace')}</span>
                  </label>
                </div>
              </div>

              {/* File upload */}
              <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-file-upload"
                />
                <label htmlFor="json-file-upload" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    {t('importDropText')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t('importDropSub')}
                  </p>
                </label>
              </div>

              {/* Paste JSON */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t('orPasteJson')}
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="[{ title: '...', content: '...' }]"
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleImportPasted}
                  disabled={!jsonInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  {t('importPastedButton')}
                </button>
              </div>
            </div>
          )}

          {/* RESET TAB */}
          {activeTab === 'reset' && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-sm font-bold">{t('resetVaultHeading')}</h4>
              </div>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                {t('resetVaultDesc')}
              </p>
              <button
                onClick={() => {
                  onResetDefaults();
                  setStatusMessage({ text: t('toastReset') });
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('confirmResetButton')}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
