import { useState, useEffect, useMemo } from 'react';
import type { Skill, SkillFilterState } from '../types/skill';
import { DEFAULT_SKILLS } from '../data/defaultSkills';

const STORAGE_KEY = 'ai_skills_vault_items_v2';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load skills from localStorage', e);
    }
    return DEFAULT_SKILLS;
  });

  const [filters, setFilters] = useState<SkillFilterState>({
    search: '',
    category: 'All',
    skillType: 'All',
    level: 'All',
    model: 'All',
    onlyFavorites: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch (e) {
      console.error('Failed to save skills to localStorage', e);
    }
  }, [skills]);

  // CRUD Operations
  const addSkill = (newSkill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const id = 'skill-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const created: Skill = {
      ...newSkill,
      id,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setSkills(prev => [created, ...prev]);
    return created;
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id
          ? { ...skill, ...updates, updatedAt: new Date().toISOString() }
          : skill
      )
    );
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const duplicateSkill = (id: string) => {
    const original = skills.find(s => s.id === id);
    if (!original) return null;
    const now = new Date().toISOString();
    const copy: Skill = {
      ...original,
      id: 'skill-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: `${original.title} (Copy)`,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setSkills(prev => [copy, ...prev]);
    return copy;
  };

  const toggleFavorite = (id: string) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id ? { ...skill, isFavorite: !skill.isFavorite } : skill
      )
    );
  };

  const recordUsage = (id: string) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id
          ? { ...skill, usageCount: (skill.usageCount || 0) + 1 }
          : skill
      )
    );
  };

  const resetToDefaults = () => {
    setSkills(DEFAULT_SKILLS);
  };

  const importSkills = (imported: Skill[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setSkills(imported);
    } else {
      // Merge by ID or add new
      const existingIds = new Set(skills.map(s => s.id));
      const newItems = imported.filter(s => !existingIds.has(s.id));
      setSkills(prev => [...newItems, ...prev]);
    }
  };

  // Filtered & Sorted Skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = skill.title.toLowerCase().includes(query);
        const matchDesc = skill.description.toLowerCase().includes(query);
        const matchTags = skill.tags.some(t => t.toLowerCase().includes(query));
        const matchContent = skill.content.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchTags && !matchContent) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'All' && skill.category !== filters.category) {
        return false;
      }

      // Skill Type
      if (filters.skillType !== 'All' && skill.skillType !== filters.skillType) {
        return false;
      }

      // Level
      if (filters.level !== 'All' && skill.level !== filters.level) {
        return false;
      }

      // Model
      if (filters.model !== 'All') {
        const hasModel = skill.models.includes(filters.model as any) || skill.models.includes('Universal');
        if (!hasModel) return false;
      }

      // Favorites only
      if (filters.onlyFavorites && !skill.isFavorite) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let result = 0;
      if (filters.sortBy === 'updatedAt') {
        result = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (filters.sortBy === 'title') {
        result = a.title.localeCompare(b.title);
      } else if (filters.sortBy === 'usageCount') {
        result = (b.usageCount || 0) - (a.usageCount || 0);
      } else if (filters.sortBy === 'rating') {
        result = (b.rating || 0) - (a.rating || 0);
      }
      return filters.sortOrder === 'asc' ? -result : result;
    });
  }, [skills, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = skills.length;
    const favorites = skills.filter(s => s.isFavorite).length;
    const totalUsage = skills.reduce((acc, s) => acc + (s.usageCount || 0), 0);
    const categoryCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    skills.forEach(s => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      typeCounts[s.skillType] = (typeCounts[s.skillType] || 0) + 1;
    });

    return { total, favorites, totalUsage, categoryCounts, typeCounts };
  }, [skills]);

  return {
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
  };
}
