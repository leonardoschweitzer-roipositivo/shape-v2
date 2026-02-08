// PersonalPublicProfile - Modal for expanded personal profile
// VITRU IA - Ranking Personais

import React from 'react';
import {
    X,
    Trophy,
    MapPin,
    CheckCircle,
    ExternalLink,
    Instagram,
    MessageCircle,
    TrendingUp,
    Users,
    Target,
    Clock,
} from 'lucide-react';
import { PersonalPublicProfile as ProfileType, TIER_CONFIG, CATEGORY_LABELS } from '../../types/personalRanking';

interface PersonalPublicProfileProps {
    profile: ProfileType | null;
    onClose: () => void;
}

const ScoreBar: React.FC<{ label: string; score: number; weight: number }> = ({
    label,
    score,
    weight,
}) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-medium">{score.toFixed(0)}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${score}%` }}
            />
        </div>
        <p className="text-[10px] text-gray-500">{(weight * 100).toFixed(0)}% do score</p>
    </div>
);

const AchievementBadge: React.FC<{
    icon: string;
    name: string;
    description: string;
}> = ({ icon, name, description }) => (
    <div className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg border border-card-border">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-white font-medium text-center">{name}</span>
        <span className="text-[10px] text-gray-500 text-center">{description}</span>
    </div>
);

export const PersonalPublicProfile: React.FC<PersonalPublicProfileProps> = ({
    profile,
    onClose,
}) => {
    if (!profile) return null;

    const tierConfig = TIER_CONFIG[profile.tier];
    const athletesImprovedPercent = profile.scoreBreakdown.athleteEvolution.metrics.athletesImproved;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background-dark border border-card-border rounded-2xl shadow-2xl custom-scrollbar">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={20} className="text-white" />
                </button>

                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-card-border">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-400">
                                    {profile.name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                                {profile.crefVerified && (
                                    <CheckCircle size={16} className="text-primary flex-shrink-0" />
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-500 text-sm">
                                    {profile.position <= 3 ? ['🥇', '🥈', '🥉'][profile.position - 1] : `#${profile.position}`}
                                </span>
                                <span className="text-gray-400 text-sm">no Ranking Nacional</span>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {profile.city}, {profile.state}
                                </span>
                                {profile.cref && (
                                    <span className="flex items-center gap-1">
                                        CREF: {profile.cref}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {profile.yearsExperience}
                                </span>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-2 mt-3">
                                {profile.instagram && (
                                    <a
                                        href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Instagram size={14} />
                                        {profile.instagram}
                                    </a>
                                )}
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        Site
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Score Breakdown */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                                Score Detalhado
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-white">{profile.score.toFixed(1)}</span>
                                <span className="text-gray-400">/100</span>
                                <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400">
                                    {tierConfig.icon} {tierConfig.name}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <ScoreBar
                                label="Evolução dos Atletas"
                                score={profile.scoreBreakdown.athleteEvolution.score}
                                weight={profile.scoreBreakdown.athleteEvolution.weight}
                            />
                            <ScoreBar
                                label="Consistência"
                                score={profile.scoreBreakdown.consistency.score}
                                weight={profile.scoreBreakdown.consistency.weight}
                            />
                            <ScoreBar
                                label="Correção de Assimetrias"
                                score={profile.scoreBreakdown.symmetryCorrection.score}
                                weight={profile.scoreBreakdown.symmetryCorrection.weight}
                            />
                            <ScoreBar
                                label="Engajamento"
                                score={profile.scoreBreakdown.engagement.score}
                                weight={profile.scoreBreakdown.engagement.weight}
                            />
                        </div>
                    </div>

                    {/* Achievements */}
                    {profile.achievements.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-500" />
                                Conquistas
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {profile.achievements.slice(0, 6).map((achievement) => (
                                    <AchievementBadge
                                        key={achievement.id}
                                        icon={achievement.icon}
                                        name={achievement.name}
                                        description={achievement.description}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Athlete Results */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-400" />
                            Resultados dos Atletas
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 flex items-center gap-2">
                                    <Users size={16} />
                                    {profile.athleteCount} atletas ativos
                                </span>
                                <span className="text-green-400 font-medium">
                                    +{profile.avgEvolution.toFixed(1)} pts média
                                </span>
                            </div>

                            {/* Progress bar for athletes improved */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Atletas que melhoraram</span>
                                    <span className="text-green-400">{athletesImprovedPercent.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${athletesImprovedPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Evolution Distribution */}
                            <div className="space-y-1.5 mt-3">
                                {profile.evolutionDistribution.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <span className="w-24 text-gray-500">{item.range}</span>
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/60 rounded-full"
                                                style={{
                                                    width: `${(item.count / profile.athleteCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-gray-400 w-8 text-right">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                            <Target size={16} className="text-secondary" />
                            Especialidades
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.specialties.map((spec) => (
                                <span
                                    key={spec}
                                    className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm border border-secondary/20"
                                >
                                    {CATEGORY_LABELS[spec]}
                                </span>
                            ))}
                        </div>
                        {profile.methodology && (
                            <div className="text-sm text-gray-400 mt-2">
                                <p><strong className="text-gray-300">Público-alvo:</strong> {profile.methodology.targetAudience.join(', ')}</p>
                                <p><strong className="text-gray-300">Metodologia:</strong> {profile.methodology.approach.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                                Sobre
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{profile.bio}</p>
                        </div>
                    )}

                    {/* Contact CTA */}
                    {profile.phone && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                            <p className="text-sm text-white">
                                Interessado em treinar com {profile.name.split(' ')[0]}?
                            </p>
                            <a
                                href={`https://wa.me/55${profile.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                            >
                                <MessageCircle size={18} />
                                Entrar em contato via WhatsApp
                            </a>
                            <p className="text-[10px] text-gray-500 text-center">
                                ⓘ O VITRU IA não intermedia contratações. Este é apenas um perfil público do profissional.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
