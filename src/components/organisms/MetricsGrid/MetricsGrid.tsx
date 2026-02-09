import React from 'react';
import {
  Dumbbell,
  Ruler,
  ArrowUpFromLine,
  Footprints,
  Activity,
  User
} from 'lucide-react';
import { MetricCardData } from '@/features/dashboard/types';
import { GlassPanel } from '@/components/atoms';

interface MetricCardProps {
  metric: MetricCardData;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getBorderColor = () => {
    const label = metric.label.toUpperCase();
    if (label === "PEITORAL" || label === "COXAS" || label === "OMBROS") return "hover:border-l-primary";
    if (label === "CINTURA") return "hover:border-l-secondary";
    return "hover:border-l-primary";
  };

  const getTextColor = () => {
    const label = metric.label.toUpperCase();
    if (label === "CINTURA") return "text-secondary";
    if (label === "COXAS") return "text-green-500";
    if (label === "PANTURRILHA") return "text-red-400";
    return "text-primary";
  }

  const getIcon = () => {
    switch (metric.metric) {
      case 'peitoral': return <User size={16} />;
      case 'bracos': return <Dumbbell size={16} />;
      case 'cintura': return <Ruler size={16} />;
      case 'coxas': return <ArrowUpFromLine size={16} />;
      case 'panturrilha': return <Footprints size={16} />;
      case 'ombros': return <Activity size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <GlassPanel className={`p-4 rounded-xl flex flex-col gap-3 group border-l-2 border-l-transparent ${getBorderColor()} cursor-pointer`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{metric.label}</span>
        <div className="text-gray-600 group-hover:text-white transition-colors">
          {getIcon()}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white flex items-baseline">
          {metric.value}
          <span className="text-sm text-gray-500 font-normal ml-1">{metric.unit}</span>
        </p>

        {metric.status === 'onTarget' ? (
          <p className={`text-[10px] ${getTextColor()} mt-1 flex items-center gap-1 font-medium`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Na Meta
          </p>
        ) : (
          <p className={`text-[10px] ${getTextColor()} mt-1 font-medium`}>
            {metric.statusLabel}
          </p>
        )}
      </div>
    </GlassPanel>
  );
};

interface MetricsGridProps {
  metrics?: MetricCardData[];
  hideHeader?: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics: propMetrics, hideHeader = false }) => {
  const defaultMetrics: MetricCardData[] = [
    { metric: 'peitoral', label: 'PEITORAL', value: 112, unit: 'cm', ideal: 115, status: 'close', statusLabel: 'Faltam: 2cm' },
    { metric: 'bracos', label: 'BRAÇOS', value: 42.5, unit: 'cm', ideal: 44, status: 'far', statusLabel: 'Meta: 44cm' },
    { metric: 'cintura', label: 'CINTURA', value: 82, unit: 'cm', ideal: 78, status: 'close', statusLabel: 'Ideal: 78cm' },
    { metric: 'coxas', label: 'COXAS', value: 64, unit: 'cm', status: 'onTarget', statusLabel: 'Na Meta ✓' },
    { metric: 'panturrilha', label: 'PANTURRILHA', value: 38, unit: 'cm', status: 'close', statusLabel: 'Faltam: 2cm' },
    { metric: 'ombros', label: 'OMBROS', value: 128, unit: 'cm', ideal: 132, status: 'close', statusLabel: 'Meta: 132cm' },
  ];

  const metrics = propMetrics || defaultMetrics;

  return (
    <div className="flex flex-col gap-5">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide uppercase">MÉTRICAS PRINCIPAIS</h3>
          <button className="text-primary text-xs font-bold hover:underline uppercase tracking-wider">Ver todas medidas</button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={`${metric.metric}-${index}`} metric={metric} />
        ))}
      </div>
    </div>
  );
};