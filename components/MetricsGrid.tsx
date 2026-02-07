import React from 'react';
import {
  Dumbbell,
  Ruler,
  ArrowUpFromLine,
  Footprints,
  Activity,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { MetricCardData } from '../src/features/dashboard/types';

interface MetricsGridProps {
  metrics?: MetricCardData[];
  hideHeader?: boolean;
}

const getIconForMetric = (metricSlug: string) => {
  switch (metricSlug) {
    case 'peitoral': return <User size={16} />;
    case 'bracos': return <Dumbbell size={16} />;
    case 'cintura': return <Ruler size={16} />;
    case 'coxas': return <ArrowUpFromLine size={16} />;
    case 'panturrilha': return <Footprints size={16} />;
    case 'ombros':
    default: return <Activity size={16} />;
  }
}

const MetricCard: React.FC<{ metric: MetricCardData }> = ({ metric }) => {
  const getStatusColor = () => {
    switch (metric.status) {
      case 'onTarget': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'close': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'far':
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const statusColorText = () => {
    switch (metric.status) {
      case 'onTarget': return 'text-emerald-500';
      case 'close': return 'text-yellow-500';
      case 'far': default: return 'text-gray-400';
    }
  }

  return (
    <div className="bg-[#131B2C] p-4 rounded-xl flex flex-col gap-3 group border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{metric.label}</span>
        <div className="text-gray-600 group-hover:text-white transition-colors p-1.5 bg-[#0A0F1C] rounded-lg border border-white/5">
          {getIconForMetric(metric.metric)}
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-white flex items-baseline">
          {metric.value}
          <span className="text-sm text-gray-500 font-normal ml-1">{metric.unit}</span>
        </p>

        <div className="flex justify-between items-end mt-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getStatusColor()}`}>
            {metric.statusLabel}
          </span>

          {metric.trend && (
            <div className="flex items-center gap-0.5 text-[10px] font-medium opacity-60">
              {metric.trend.value > 0 ? <ArrowUpRight size={12} className="text-emerald-500" /> :
                metric.trend.value < 0 ? <ArrowDownRight size={12} className="text-red-500" /> :
                  <Minus size={12} className="text-gray-500" />}
              <span className={metric.trend.value > 0 ? 'text-emerald-500' : metric.trend.value < 0 ? 'text-red-500' : 'text-gray-500'}>
                {Math.abs(metric.trend.value)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, hideHeader = false }) => {
  // Default metrics or skeleton if needed, but assuming data is passed
  if (!metrics) return null;

  return (
    <div className="flex flex-col gap-5">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide">MÉTRICAS PRINCIPAIS</h3>
          <button className="text-[#00C9A7] text-xs font-bold hover:underline uppercase tracking-wider transition-colors pt-1">
            Ver todas medidas
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.metric} metric={metric} />
        ))}
      </div>
    </div>
  );
};