import React from 'react';
import { 
  Dumbbell, 
  Ruler, 
  ArrowUpFromLine, 
  Footprints,
  Activity,
  User
} from 'lucide-react';
import { BodyMetric } from '../types';
import { GlassPanel } from './GlassPanel';

const MetricCard: React.FC<{ metric: BodyMetric }> = ({ metric }) => {
  const getBorderColor = () => {
    if (metric.label === "Peitoral" || metric.label === "Coxas" || metric.label === "Ombros") return "hover:border-l-primary";
    if (metric.label === "Cintura") return "hover:border-l-secondary";
    return "hover:border-l-primary";
  };
  
  const getTextColor = () => {
      if (metric.label === "Cintura") return "text-secondary";
      if (metric.label === "Coxas") return "text-green-500";
      if (metric.label === "Panturrilha") return "text-red-400";
      return "text-primary";
  }

  return (
    <GlassPanel className={`p-4 rounded-xl flex flex-col gap-3 group border-l-2 border-l-transparent ${getBorderColor()} cursor-pointer`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{metric.label}</span>
        <div className="text-gray-600 group-hover:text-white transition-colors">
            {metric.icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white flex items-baseline">
          {metric.value}
          <span className="text-sm text-gray-500 font-normal ml-1">{metric.unit}</span>
        </p>
        
        {metric.status === 'on-track' ? (
           <p className={`text-[10px] ${getTextColor()} mt-1 flex items-center gap-1 font-medium`}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Na Meta
           </p>
        ) : metric.diff ? (
            <p className={`text-[10px] ${getTextColor()} mt-1 font-medium`}>
                Faltam: {metric.diff}{metric.unit}
            </p>
        ) : (
            <p className={`text-[10px] ${getTextColor()} mt-1 font-medium`}>
                {metric.ideal ? `Ideal: ${metric.ideal}${metric.unit}` : `Meta: ${metric.target}${metric.unit}`}
            </p>
        )}
      </div>
    </GlassPanel>
  );
};

export const MetricsGrid: React.FC = () => {
  const metrics: BodyMetric[] = [
    { id: '1', label: 'Peitoral', value: 112, unit: 'cm', target: 115, icon: <User size={16} /> },
    { id: '2', label: 'Braços', value: 42.5, unit: 'cm', target: 44, icon: <Dumbbell size={16} /> },
    { id: '3', label: 'Cintura', value: 82, unit: 'cm', ideal: 78, icon: <Ruler size={16} /> },
    { id: '4', label: 'Coxas', value: 64, unit: 'cm', status: 'on-track', icon: <ArrowUpFromLine size={16} /> },
    { id: '5', label: 'Panturrilha', value: 38, unit: 'cm', diff: 2, icon: <Footprints size={16} /> },
    { id: '6', label: 'Ombros', value: 128, unit: 'cm', target: 132, icon: <Activity size={16} /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-wide">MÉTRICAS PRINCIPAIS</h3>
        <button className="text-primary text-xs font-bold hover:underline uppercase tracking-wider">Ver todas medidas</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};