import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useSkills } from './hooks/useSkills';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterSidebar } from './components/FilterSidebar';
import { SkillCard } from './components/SkillCard';
import { SkillDetailModal } from './components/SkillDetailModal';
import { SkillEditorModal } from './components/SkillEditorModal';
import { PlaygroundModal } from './components/PlaygroundModal';
import { ImportExportModal } from './components/ImportExportModal';
import { Toast } from './components/Toast';
import type { Skill } from './types/skill';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function VaultMain() {
  const {
    skills,
    filteredSkills,
    filters,
    setFilters,
    stats,
    addSkill,
    updateSkill,
    deleteSkill,
    duplicateSkill,
    toggleFavorite,
    recordUsage,
    resetToDefaults,
    importSkills,
  } = useSkills();

  const { t } = useLanguage();

  // Layout view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals state
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [playgroundSkill, setPlaygroundSkill] = useState<Skill | null>(null);
  const [playgroundVars, setPlaygroundVars] = useState<Record<string, string>>({});

  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#38bdf8', '#a855f7']
      });
    } catch {
      // Safe fallback if canvas not available
    }
  };

  const handleOpenNewSkill = () => {
    setEditingSkill(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setDetailSkill(null);
    setIsEditorOpen(true);
  };

  const handleSaveSkill = (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    if (editingSkill) {
      updateSkill(editingSkill.id, skillData);
      showToast(t('toastUpdated', { title: skillData.title }));
    } else {
      const created = addSkill(skillData);
      showToast(t('toastStocked', { title: created.title }));
      triggerConfetti();
    }
    setIsEditorOpen(false);
    setEditingSkill(null);
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateSkill(id);
    if (copy) {
      showToast(t('toastDuplicated', { title: copy.title }));
      if (detailSkill?.id === id) {
        setDetailSkill(copy);
      }
    }
  };

  const handleFastCopy = (skill: Skill) => {
    recordUsage(skill.id);
    showToast(t('toastCopiedPrompt', { title: skill.title }));
    triggerConfetti();
  };

  const handleLaunchPlaygroundFromDetail = (skill: Skill, vars: Record<string, string>) => {
    setPlaygroundSkill(skill);
    setPlaygroundVars(vars);
    setDetailSkill(null);
  };

  const handleLaunchPlaygroundFromCard = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaults: Record<string, string> = {};
    if (skill.variables) {
      skill.variables.forEach(v => {
        defaults[v.name] = v.defaultValue || '';
      });
    }
    setPlaygroundSkill(skill);
    setPlaygroundVars(defaults);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navigation */}
      <Header
        onNewSkill={handleOpenNewSkill}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onResetDefaults={resetToDefaults}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalSkills={skills.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Telemetry Stats Bar */}
        <StatsBar skills={skills} />

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>{mobileFilterOpen ? 'Hide' : t('filtersAndCategories')}</span>
          </button>
          <span className="text-xs text-slate-400">
            {t('matchesCount', { count: filteredSkills.length })}
          </span>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar (3 cols) */}
          <aside className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-28">
              <FilterSidebar
                filters={filters}
                onFilterChange={(updates) => setFilters(prev => ({ ...prev, ...updates }))}
                onResetFilters={() => setFilters({
                  search: '',
                  category: 'All',
                  skillType: 'All',
                  level: 'All',
                  model: 'All',
                  onlyFavorites: false,
                  sortBy: 'updatedAt',
                  sortOrder: 'desc',
                })}
                categoryCounts={stats.categoryCounts}
                totalCount={skills.length}
              />
            </div>
          </aside>

          {/* Skills Grid / List (9 cols) */}
          <section className="lg:col-span-9 space-y-4">
            
            {/* Results Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                {t('showingSkills', { filtered: filteredSkills.length, total: skills.length })}
              </span>
              {filters.search && (
                <span>
                  {t('queryText')} "<span className="text-indigo-400">{filters.search}</span>"
                </span>
              )}
            </div>

            {/* Empty State */}
            {filteredSkills.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center space-y-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-200">{t('noSkillsTitle')}</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {t('noSkillsDesc')}
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => setFilters({
                      search: '',
                      category: 'All',
                      skillType: 'All',
                      level: 'All',
                      model: 'All',
                      onlyFavorites: false,
                      sortBy: 'updatedAt',
                      sortOrder: 'desc',
                    })}
                    className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {t('clearFilters')}
                  </button>
                  <button
                    onClick={handleOpenNewSkill}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('stockNewSkill')}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Grid or List View */
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : 'space-y-3'
                }
              >
                {filteredSkills.map(skill => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onSelect={(s) => setDetailSkill(s)}
                    onToggleFavorite={(id, e) => {
                      e.stopPropagation();
                      toggleFavorite(id);
                    }}
                    onPlayground={handleLaunchPlaygroundFromCard}
                    onFastCopy={handleFastCopy}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

          </section>

        </div>

      </main>

      {/* Detail Modal with Markdown Viewer! */}
      <SkillDetailModal
        skill={detailSkill}
        onClose={() => setDetailSkill(null)}
        onEdit={handleOpenEdit}
        onDuplicate={handleDuplicate}
        onDelete={deleteSkill}
        onToggleFavorite={toggleFavorite}
        onLaunchPlayground={handleLaunchPlaygroundFromDetail}
        onCopySuccess={() => {
          showToast(t('toastCopied'));
          triggerConfetti();
        }}
      />

      {/* Editor Modal (Create or Edit) */}
      {isEditorOpen && (
        <SkillEditorModal
          skillToEdit={editingSkill}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingSkill(null);
          }}
          onSave={handleSaveSkill}
        />
      )}

      {/* Interactive AI Playground Simulator */}
      {playgroundSkill && (
        <PlaygroundModal
          skill={playgroundSkill}
          initialVariableValues={playgroundVars}
          onClose={() => setPlaygroundSkill(null)}
          onRecordUsage={recordUsage}
        />
      )}

      {/* Import / Export & Backup Modal */}
      {isImportExportOpen && (
        <ImportExportModal
          skills={skills}
          onClose={() => setIsImportExportOpen(false)}
          onImport={(imported, mode) => {
            importSkills(imported, mode);
            showToast(t('toastImportSuccess', { count: imported.length }));
            triggerConfetti();
          }}
          onResetDefaults={() => {
            resetToDefaults();
            showToast(t('toastReset'));
          }}
        />
      )}

      {/* Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <VaultMain />
    </LanguageProvider>
  );
}

export default App;
