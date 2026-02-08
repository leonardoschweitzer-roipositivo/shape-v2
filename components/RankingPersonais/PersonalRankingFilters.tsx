// PersonalRankingFilters - Filter bar for ranking
// VITRU IA - Ranking Personais

import React from 'react';
import { Search, Filter, MapPin, Calendar, Target } from 'lucide-react';
import {
    RankingFilters,
    RankingCategory,
    RegionFilter,
    RankingPeriod,
    CATEGORY_LABELS,
    REGION_LABELS,
    PERIOD_LABELS,
} from '../../types/personalRanking';

interface PersonalRankingFiltersProps {
    filters: RankingFilters;
    onFilterChange: (filters: Partial<RankingFilters>) => void;
    onReset: () => void;
}

const SelectField: React.FC<{
    icon: React.ReactNode;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    className?: string;
}> = ({ icon, value, options, onChange, className = '' }) => (
    <div className={`relative flex items-center ${className}`}>
        <span className="absolute left-3 text-gray-400 pointer-events-none">
            {icon}
        </span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
        w-full pl-10 pr-4 py-2.5 rounded-lg
        bg-[#0D121F] border border-white/5
        text-white text-sm
        focus:outline-none focus:border-primary/30
        appearance-none cursor-pointer
        transition-colors
      "
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0D121F]">
                    {opt.label}
                </option>
            ))}
        </select>
        <span className="absolute right-3 text-gray-400 pointer-events-none scale-75 opacity-50">▼</span>
    </div>
);

export const PersonalRankingFilters: React.FC<PersonalRankingFiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
}) => {
    const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const regionOptions = Object.entries(REGION_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const periodOptions = Object.entries(PERIOD_LABELS).map(([value, label]) => ({
        value,
        label,
    }));

    const specialtyOptions = [
        { value: 'todas', label: 'Todas Especialidades' },
        ...categoryOptions,
    ];

    const hasActiveFilters =
        filters.search ||
        filters.category !== 'geral' ||
        filters.region !== 'nacional' ||
        filters.specialty !== 'todas' ||
        filters.period !== '6-meses';

    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            {/* Search */}
            <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar personal por nome ou cidade..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    className="
            w-full pl-10 pr-4 py-3 rounded-lg
            bg-[#0D121F] border border-white/5
            text-white placeholder-gray-500 text-sm
            focus:outline-none focus:border-primary/30
            transition-colors
          "
                />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SelectField
                    icon={<Filter size={16} />}
                    value={filters.category}
                    options={categoryOptions}
                    onChange={(v) => onFilterChange({ category: v as RankingCategory })}
                />

                <SelectField
                    icon={<MapPin size={16} />}
                    value={filters.region}
                    options={regionOptions}
                    onChange={(v) => onFilterChange({ region: v as RegionFilter })}
                />

                <SelectField
                    icon={<Calendar size={16} />}
                    value={filters.period}
                    options={periodOptions}
                    onChange={(v) => onFilterChange({ period: v as RankingPeriod })}
                />

                <SelectField
                    icon={<Target size={16} />}
                    value={filters.specialty}
                    options={specialtyOptions}
                    onChange={(v) => onFilterChange({ specialty: v as RankingCategory | 'todas' })}
                />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
                <button
                    onClick={onReset}
                    className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                    Limpar filtros
                </button>
            )}
        </div>
    );
};
