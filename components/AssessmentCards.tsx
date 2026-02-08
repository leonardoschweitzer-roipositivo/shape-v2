import React from 'react';
import { Utensils, Dumbbell, ArrowUpRight, ArrowDownRight, Trophy, Bot, Sparkles, Hand, Footprints, Activity, Accessibility } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { colors, typography, spacing, borders, shadows } from '../src/tokens';

// --- SHARED STYLES ---
const cardStyles = {
  badge: {
    base: {
      padding: `${spacing[1]} ${spacing[2]}`,
      borderRadius: borders.radius.sm,
      fontSize: '10px',
      fontWeight: typography.fontWeight.bold,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing[1]
    },
    primary: {
      color: colors.brand.primary,
      background: `${colors.brand.primary}1A`, // 10% opacity
      border: `1px solid ${colors.brand.primary}33`
    },
    secondary: {
      color: colors.brand.secondary,
      background: `${colors.brand.secondary}1A`,
      border: `1px solid ${colors.brand.secondary}33`
    },
    warning: {
      color: colors.semantic.warning,
      background: `${colors.semantic.warning}1A`,
      border: `1px solid ${colors.semantic.warning}33`
    }
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    fontFamily: 'monospace'
  },
  metricValue: {
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold
  }
};

// --- MASS CARD ---
export const MassCard: React.FC<{ label: string; value: number; unit: string; trend: number; color?: 'green' | 'red' | 'purple' }> = ({ label, value, unit, trend, color = 'green' }) => {
  const isPositive = trend > 0;

  // Map props to tokens
  const getColor = (c: string) => {
    switch (c) {
      case 'green': return colors.brand.primary;
      case 'red': return colors.semantic.error;
      case 'purple': return colors.brand.secondary;
      default: return colors.brand.primary;
    }
  };

  const themeColor = getColor(color);
  const bgOpacity = (opacity: number) => `${themeColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;

  return (
    <GlassPanel className="p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <h4 style={{ fontSize: '10px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</h4>
        {label === "Peso Gordo" ? <Utensils size={14} color={colors.text.disabled} /> : <Dumbbell size={14} color={colors.text.disabled} />}
      </div>

      <div className="z-10 mt-2">
        <div className="flex items-baseline gap-1">
          <span style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, letterSpacing: typography.letterSpacing.tight }}>{value}</span>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.medium }}>{unit}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between z-10">
        <div style={{ height: '24px', width: '64px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.2, background: themeColor, height: color === 'red' ? '80%' : '40%' }}></div>
          <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.4, background: themeColor, height: color === 'red' ? '60%' : '60%' }}></div>
          <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, opacity: 0.6, background: themeColor, height: color === 'red' ? '50%' : '70%' }}></div>
          <div style={{ width: '25%', borderRadius: `${borders.radius.sm} ${borders.radius.sm} 0 0`, background: themeColor, height: color === 'red' ? '40%' : '90%' }}></div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: borders.radius.sm,
          fontSize: '10px',
          fontWeight: typography.fontWeight.bold,
          background: bgOpacity(0.1),
          color: themeColor
        }}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </GlassPanel>
  );
};

// --- PROPORTION CARD ---
interface ProportionCardProps {
  title: string;
  badge: string;
  metrics: { label: string; value: string }[];
  currentValue: number | string;
  valueUnit?: string;
  valueLabel?: string;
  description: string;
  statusLabel: string;
  userPosition: number; // 0-100%
  goalPosition: number; // 0-100%
  goalLabel?: string;
  image: string;
  overlayStyle?: 'v-taper' | 'chest' | 'arm' | 'triad' | 'waist' | 'legs';
  rawImage?: boolean;
  measurementsUsed?: string[];
}

export const ProportionCard: React.FC<ProportionCardProps> = ({
  title, badge, metrics, currentValue, valueUnit, valueLabel, description, statusLabel, userPosition, goalPosition, goalLabel = "GOLDEN", image, overlayStyle, rawImage = false, measurementsUsed
}) => {
  return (
    <GlassPanel className="rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-auto md:h-72" hoverEffect={false}>
      {/* Visual Section */}
      <div className="w-full md:w-1/4 relative bg-[#050810] flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center bg-[#050810]">
          <img
            src={image}
            alt={title}
            className={`h-full w-full object-contain transition-opacity duration-500 ${rawImage ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
          />
        </div>
        {!rawImage && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050810]/20 to-[#131B2C]/90"></div>}

        {/* Anatomy Overlays - Simplified for readability */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          {/* Note: In a full refactor, these specific overlays could be their own components, but kept here for brevity */}
          {overlayStyle === 'v-taper' && (
            <div className="flex flex-col items-center gap-12 w-full px-8 mt-4">
              <div className="w-full border-t border-dashed border-white/60 relative"></div>
              <div className="h-20 w-full border-x border-blue-500/30 rounded-[50%]"></div>
              <div className="w-2/3 border-t border-dashed border-blue-400 relative"></div>
            </div>
          )}
          {/* ... other overlay styles ... */}

          {overlayStyle && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-900/40 border border-blue-500/30 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest backdrop-blur-sm">
              {badge}
            </div>
          )}
        </div>
      </div>

      {/* Data Section */}
      <div className="w-full md:w-3/4 p-6 md:p-8 flex flex-col justify-between relative">
        <div className="flex justify-between items-start">
          <div>
            <span style={{ ...cardStyles.badge.base, ...cardStyles.badge.primary, marginBottom: spacing[2] }}>
              {badge}
            </span>
            <h3 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing[2] }}>
              {title}
            </h3>
            <div style={{ display: 'flex', gap: spacing[2] }}>
              {metrics.map((m, i) => (
                <span key={i} style={{
                  background: colors.background.dark,
                  padding: `${spacing[1]} ${spacing[3]}`,
                  borderRadius: borders.radius.sm,
                  border: `1px solid rgba(255, 255, 255, 0.05)`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1]
                }}>
                  <span style={cardStyles.metricLabel}>{m.label}:</span>
                  <strong style={cardStyles.metricValue}>{m.value}</strong>
                </span>
              ))}
            </div>
            {measurementsUsed && (
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-500 font-medium opacity-80">
                <span className="uppercase tracking-wide font-bold">Base:</span>
                {measurementsUsed.join(' • ')}
              </div>
            )}
          </div>
          <div className="text-right">
            <div style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: colors.semantic.info, lineHeight: 1 }}>
              {currentValue}
              {valueUnit && <span style={{ fontSize: typography.fontSize.lg, color: `${colors.semantic.info}80`, marginLeft: spacing[1] }}>{valueUnit}</span>}
            </div>
            {valueLabel && (
              <div style={{ fontSize: '10px', color: colors.text.muted, textTransform: 'uppercase', fontWeight: typography.fontWeight.bold, letterSpacing: '0.1em', marginTop: spacing[1] }}>
                {valueLabel}
              </div>
            )}
          </div>
        </div>

        <div className="my-6 relative">
          <div style={{
            height: '12px',
            background: colors.background.dark,
            borderRadius: borders.radius.full,
            display: 'flex',
            overflow: 'hidden',
            border: `1px solid rgba(255, 255, 255, 0.05)`,
            position: 'relative'
          }}>
            <div style={{ width: '20%', height: '100%', borderRight: '1px solid rgba(10, 15, 28, 0.5)', background: `${colors.semantic.info}4D` }}></div>
            <div style={{ width: '20%', height: '100%', borderRight: '1px solid rgba(10, 15, 28, 0.5)', background: `${colors.semantic.info}66` }}></div>
            <div style={{ width: '20%', height: '100%', borderRight: '1px solid rgba(10, 15, 28, 0.5)', background: `${colors.semantic.info}80` }}></div>
            <div style={{ width: '20%', height: '100%', borderRight: '1px solid rgba(10, 15, 28, 0.5)', background: `${colors.semantic.info}99`, boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}></div>
            <div style={{ width: '20%', height: '100%', background: `${colors.brand.secondary}99` }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: colors.text.secondary, marginTop: spacing[2], textTransform: 'uppercase', fontWeight: typography.fontWeight.bold, letterSpacing: '0.1em', padding: '0 4px' }}>
            <span style={{ width: '20%', textAlign: 'center' }}>Bloco</span>
            <span style={{ width: '20%', textAlign: 'center' }}>Normal</span>
            <span style={{ width: '20%', textAlign: 'center' }}>Atlético</span>
            <span style={{ width: '20%', textAlign: 'center', color: colors.semantic.info }}>Estético</span>
            <span style={{ width: '20%', textAlign: 'center', opacity: 0.5 }}>Freak</span>
          </div>

          <div className="absolute top-[-20px]" style={{ left: `${userPosition}%`, transform: 'translateX(-50%)' }}>
            <div style={{ padding: '2px 6px', background: colors.text.primary, color: colors.background.dark, fontSize: '9px', fontWeight: typography.fontWeight.bold, borderRadius: borders.radius.sm, marginBottom: spacing[1], whiteSpace: 'nowrap' }}>VOCÊ</div>
            <div style={{ width: '16px', height: '16px', borderRadius: borders.radius.full, background: colors.text.primary, border: `4px solid ${colors.background.dark}`, boxShadow: '0 0 10px rgba(255,255,255,0.5)', margin: '0 auto' }}></div>
          </div>

          <div className="absolute top-[-20px]" style={{ left: `${goalPosition}%`, transform: 'translateX(-50%)' }}>
            <div className="flex flex-col items-center">
              <Trophy size={10} color={colors.semantic.warning} style={{ marginBottom: 2 }} />
              <div style={{ fontSize: '8px', fontWeight: typography.fontWeight.bold, color: colors.semantic.warning, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{goalLabel}</div>
              <div style={{ width: '2px', height: '24px', background: `${colors.semantic.warning}80`, marginTop: spacing[1], borderRight: `1px dashed ${colors.semantic.warning}40` }}></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <p style={{ fontSize: typography.fontSize.xs, color: colors.text.muted, maxWidth: '28rem', lineHeight: typography.lineHeight.relaxed }}>
            {description}
          </p>
          <button style={{
            padding: `${spacing[2]} ${spacing[4]}`,
            background: colors.background.dark,
            border: `1px solid ${colors.semantic.info}4D`,
            color: colors.semantic.info,
            borderRadius: borders.radius.lg,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.bold,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer'
          }}>
            {statusLabel}
          </button>
        </div>
      </div>
    </GlassPanel>
  );
};

// --- ASYMMETRY CARD ---
interface AsymmetryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  leftVal: string;
  rightVal: string;
  diff: string;
  status: 'high' | 'moderate' | 'symmetrical';
}

export const AsymmetryCard: React.FC<AsymmetryCardProps> = ({ icon, title, subtitle, leftVal, rightVal, diff, status }) => {
  const statusConfig = {
    high: {
      text: 'ASSIMETRIA ALTA',
      color: colors.semantic.orange,
      bgColor: `${colors.semantic.orange}1A`,
      borderColor: `${colors.semantic.orange}4D`
    },
    moderate: {
      text: 'ASSIMETRIA MODERADA',
      color: colors.semantic.warning,
      bgColor: `${colors.semantic.warning}1A`,
      borderColor: `${colors.semantic.warning}4D`
    },
    symmetrical: {
      text: 'SIMÉTRICO',
      color: colors.brand.primary,
      bgColor: `${colors.brand.primary}1A`,
      borderColor: `${colors.brand.primary}4D`
    }
  };

  const config = statusConfig[status];
  const isRightHeavy = parseFloat(rightVal.replace(',', '.')) > parseFloat(leftVal.replace(',', '.'));
  const isBalanced = status === 'symmetrical';

  return (
    <GlassPanel className="p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: borders.radius.full,
            background: colors.background.card,
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.muted
          }}>
            {icon}
          </div>
          <div>
            <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.sm, letterSpacing: '0.025em' }}>{title}</h4>
            <p style={{ color: colors.text.secondary, fontSize: '10px', fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{subtitle}</p>
          </div>
        </div>
        <span style={{
          padding: `${spacing[1]} ${spacing[2]}`,
          borderRadius: borders.radius.sm,
          fontSize: '10px',
          fontWeight: typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: `1px solid ${config.borderColor}`,
          color: config.color,
          background: config.bgColor
        }}>
          {config.text}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 gap-4">
        <div className="text-center w-24">
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.brand.secondary, letterSpacing: typography.letterSpacing.tight }}>
            {leftVal} <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.normal }}>cm</span>
          </div>
          <div style={{ fontSize: '9px', color: colors.text.secondary, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Esquerdo</div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div style={{
            width: '100%',
            height: '10px',
            background: colors.background.dark,
            borderRadius: borders.radius.full,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            border: `1px solid rgba(255, 255, 255, 0.05)`
          }}>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '100%', background: colors.text.disabled, zIndex: 10 }}></div>
            {!isBalanced && (
              <div
                style={{
                  height: '100%',
                  borderRadius: borders.radius.full,
                  position: 'absolute',
                  background: isRightHeavy ? colors.brand.primary : colors.brand.secondary,
                  width: status === 'high' ? '40%' : '15%',
                  ...(isRightHeavy ? { right: '50%', transformOrigin: 'left' } : { left: '50%', transform: 'translateX(-100%)', transformOrigin: 'right' })
                }}
              ></div>
            )}
            {isBalanced && (
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: borders.radius.full,
                background: colors.brand.primary,
                boxShadow: `0 0 5px ${colors.brand.primary}CC`
              }}></div>
            )}
          </div>

          <span style={{
            padding: `${spacing[1]} ${spacing[2]}`,
            borderRadius: borders.radius.sm,
            fontSize: '10px',
            fontWeight: typography.fontWeight.bold,
            color: config.color,
            background: config.bgColor
          }}>
            {status === 'symmetrical' ? '0,0 cm' : `${diff} cm`}
          </span>
        </div>

        <div className="text-center w-24">
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.brand.primary, letterSpacing: typography.letterSpacing.tight }}>
            {rightVal} <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, fontWeight: typography.fontWeight.normal }}>cm</span>
          </div>
          <div style={{ fontSize: '9px', color: colors.text.secondary, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Direito</div>
        </div>
      </div>
    </GlassPanel>
  );
};

// --- SCORE WIDGET ---
export const ScoreWidget: React.FC<{ score: number; label?: string; change?: string }> = ({ score, label = "Pontos", change = "+5%" }) => {
  return (
    <GlassPanel className="rounded-2xl p-1 relative flex flex-col items-center justify-center min-h-[300px]" hoverEffect={false}>
      <div style={{ position: 'absolute', top: spacing[6], left: spacing[6], fontSize: typography.fontSize.xs, color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avaliação Geral</div>
      <Trophy style={{ position: 'absolute', top: spacing[6], right: spacing[6], color: colors.text.disabled }} size={24} />

      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: colors.brand.primary }}></div>
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="80" fill="none" stroke={colors.background.card} strokeWidth="16" />
          <circle
            cx="120" cy="120" r="80" fill="none" stroke={colors.brand.primary} strokeWidth="16"
            strokeDasharray="502" strokeDashoffset={502 - (502 * score) / 100}
            strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${colors.brand.primary}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: typography.fontSize['5xl'], fontWeight: typography.fontWeight.bold, color: colors.text.primary, letterSpacing: typography.letterSpacing.tight }}>{score}</span>
          <span style={{ fontSize: '10px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: spacing[1] }}>{label}</span>
        </div>
      </div>

      <div style={{ marginTop: spacing[6], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
        <span style={{
          padding: `${spacing[1]} ${spacing[4]}`,
          borderRadius: borders.radius.full,
          background: 'rgba(255, 255, 255, 0.05)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          color: colors.brand.primary,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>Shape Atlético</span>
        <span style={{ fontSize: '10px', color: colors.semantic.success, fontWeight: typography.fontWeight.bold }}>
          {change} <span style={{ color: colors.text.secondary, fontWeight: typography.fontWeight.medium }}>vs. mês anterior</span>
        </span>
      </div>
    </GlassPanel>
  );
};

// --- AI ANALYSIS WIDGET (LARGE) ---
export const AiAnalysisWidget: React.FC<{ title?: string; analysis: React.ReactNode; onCorrection?: () => void; onMacros?: () => void }> = ({
  title = "ANÁLISE DA INTELIGÊNCIA ARTIFICIAL",
  analysis,
  onCorrection,
  onMacros
}) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#1E293B] to-[#131B2C] border border-white/10 p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 -skew-x-12 translate-x-16"></div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={28} className="text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 text-[10px] font-bold border border-white/10">BETA</span>
          </div>

          <div className="text-gray-300 text-sm leading-relaxed mb-6 max-w-4xl">
            {analysis}
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={onCorrection} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-primary/50 group/btn">
              <Dumbbell size={16} className="text-primary group-hover/btn:text-white transition-colors" />
              Gerar Treino Corretivo
            </button>
            <button onClick={onMacros} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all hover:border-secondary/50 group/btn">
              <Utensils size={16} className="text-secondary group-hover/btn:text-white transition-colors" />
              Ajustar Macros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PROPORTION AI ANALYSIS CARD (SIDE) ---
export const ProportionAiAnalysisCard: React.FC<{ strength?: string; weakness?: string; suggestion?: string; }> = ({ strength, weakness, suggestion }) => {
  return (
    <GlassPanel className="h-full p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden flex flex-col" hoverEffect={false}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" style={{ background: `${colors.brand.primary}0D` }}></div>

      <div className="flex items-center gap-2 mb-4">
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: borders.radius.sm,
          background: `${colors.brand.primary}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${colors.brand.primary}33`,
          boxShadow: `0 0 10px ${colors.brand.primary}1A`
        }}>
          <Sparkles size={12} color={colors.brand.primary} />
        </div>
        <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.xs, letterSpacing: '0.05em' }}>ANÁLISE DE PROPORÇÃO</h4>
      </div>

      <div className="flex-1 space-y-4">
        {strength && (
          <div className="relative pl-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.brand.primary}80, transparent)` }}></div>
            <p style={{ fontSize: '9px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing[1] }}>Ponto Forte</p>
            <p style={{ fontSize: typography.fontSize.xs, color: colors.text.primary, lineHeight: typography.lineHeight.relaxed }} dangerouslySetInnerHTML={{ __html: strength }}></p>
          </div>
        )}
        {weakness && (
          <div className="relative pl-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.semantic.orange}80, transparent)` }}></div>
            <p style={{ fontSize: '9px', color: colors.text.muted, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing[1] }}>Atenção</p>
            <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, lineHeight: typography.lineHeight.relaxed }} dangerouslySetInnerHTML={{ __html: weakness }}></p>
          </div>
        )}
      </div>

      {suggestion && (
        <div style={{ marginTop: spacing[4], paddingTop: spacing[4], borderTop: `1px solid rgba(255, 255, 255, 0.05)` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Bot size={12} color={colors.semantic.info} />
            <span style={{ fontSize: '9px', fontWeight: typography.fontWeight.bold, color: colors.semantic.info, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coach IA</span>
          </div>
          <p style={{ fontSize: '10px', color: colors.text.muted, fontStyle: 'italic', lineHeight: typography.lineHeight.relaxed }}>
            "{suggestion}"
          </p>
        </div>
      )}
    </GlassPanel>
  );
};

// --- AI INSIGHT CARD (SMALL) ---
export const AiInsightCard: React.FC<{ type?: string; title: string; description: React.ReactNode }> = ({ type = "AI Insight", title, description }) => {
  return (
    <GlassPanel className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#131B2C] to-[#0A0F1C] relative overflow-hidden" hoverEffect={false}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: `${colors.brand.primary}0D` }}></div>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: borders.radius.sm,
        background: `${colors.brand.primary}1A`,
        border: `1px solid ${colors.brand.primary}33`,
        color: colors.brand.primary,
        fontSize: '10px',
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: spacing[3]
      }}>
        <Sparkles size={10} /> {type}
      </div>
      <h4 style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>{title}</h4>
      <div style={{ color: colors.text.muted, fontSize: typography.fontSize.xs, lineHeight: typography.lineHeight.relaxed }}>
        {description}
      </div>
    </GlassPanel>
  );
};