import React from 'react';
import { Layers, Star, PlayCircle, Variable } from 'lucide-react';
import type { Skill } from '../types/skill';
import { useLanguage } from '../context/LanguageContext';

interface StatsBarProps {
  skills: Skill[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ skills }) => {
  const { t } = useLanguage();
  const total = skills.length;
  const favorites = skills.filter(s => s.isFavorite).length;
  const totalUsages = skills.reduce((sum, s) => sum + (s.usageCount || 0), 0);
  const parameterizedCount = skills.filter(s => s.variables && s.variables.length > 0).length;

  const statItems = [
    {
      label: t('statStocked'),
      value: total,
      subtext: t('statStockedSub'),
      icon: Layers,
      color: 'from-blue-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      label: t('statFavorites'),
      value: favorites,
      subtext: t('statFavoritesSub'),
      icon: Star,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      label: t('statParameterized'),
      value: parameterizedCount,
      subtext: t('statParameterizedSub'),
      icon: Variable,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      label: t('statDeployments'),
      value: totalUsages,
      subtext: t('statDeploymentsSub'),
      icon: PlayCircle,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20',
      iconColor: 'text-purple-400'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border bg-gradient-to-br backdrop-blur-sm ${stat.color} transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <Icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold tracking-tight text-white">{stat.value}</span>
              <span className="text-[11px] text-slate-400">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
