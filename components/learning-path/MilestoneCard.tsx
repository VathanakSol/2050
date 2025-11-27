'use client';

import { Milestone } from '@/app/actions/learning-path';

interface MilestoneCardProps {
    milestone: Milestone;
    isExpanded: boolean;
    onToggle: () => void;
}

const DIFFICULTY_CONFIG = {
    beginner: { color: 'text-green-400', bg: 'bg-green-400/10', label: '🌱 Beginner' },
    intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: '⚡ Intermediate' },
    advanced: { color: 'text-red-400', bg: 'bg-red-400/10', label: '🔥 Advanced' },
};

const RESOURCE_TYPE_EMOJI = {
    tutorial: '📺',
    course: '🎓',
    docs: '📚',
    project: '🛠️',
    article: '📝',
    video: '▶️',
};

export function MilestoneCard({
    milestone,
    isExpanded,
    onToggle
}: MilestoneCardProps) {
    const difficultyConfig = DIFFICULTY_CONFIG[milestone.difficulty] || DIFFICULTY_CONFIG.beginner;

    return (
        <div className={`border-4 border-white bg-card-bg transition-all ${isExpanded ? 'shadow-[8px_8px_0px_0px_#FFD300]' : 'shadow-[4px_4px_0px_0px_#FFD300]'}`}>
            {/* Header */}
            <div
                onClick={onToggle}
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-white">
                                {milestone.title}
                            </h3>
                        </div>
                        <p className="text-gray-400 mb-4">{milestone.description}</p>

                        <div className="flex flex-wrap gap-3 items-center">
                            <span className={`px-3 py-1 border-2 ${difficultyConfig.bg} ${difficultyConfig.color} border-current font-bold text-sm`}>
                                {difficultyConfig.label}
                            </span>
                            <span className="text-sm text-gray-400">
                                ⏱️ <span className="font-bold">{milestone.duration}</span>
                            </span>
                            <span className="text-sm text-gray-400">
                                📦 <span className="font-bold">{milestone.resources.length} resources</span>
                            </span>
                            {milestone.prerequisites.length > 0 && (
                                <span className="text-sm text-gray-400">
                                    🔗 <span className="font-bold">Prerequisites: #{milestone.prerequisites.join(', #')}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {milestone.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-accent-blue text-white font-bold text-xs border-2 border-white"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t-4 border-current p-6 bg-background/50 animate-[fade-in-up_0.3s_ease-out]">
                    {/* Tasks List */}
                    {milestone.tasks.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xl font-black text-white mb-3">
                                ✅ Tasks to Complete
                            </h4>

                            <div className="space-y-2">
                                {milestone.tasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 border-2 border-gray-700"
                                    >
                                        <span className="text-accent-yellow font-bold">•</span>
                                        <span className="flex-1 text-white font-medium">
                                            {task}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learning Resources */}
                    {milestone.resources.length > 0 && (
                        <div>
                            <h4 className="text-xl font-black text-white mb-3">📚 Learning Resources</h4>
                            <div className="grid gap-3">
                                {milestone.resources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 border-3 border-white bg-card-bg hover:bg-white/5 hover:shadow-[4px_4px_0px_0px_#FFD300] transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xl">{RESOURCE_TYPE_EMOJI[resource.type]}</span>
                                                    <h5 className="font-bold text-white group-hover:text-accent-yellow transition-colors">
                                                        {resource.title}
                                                    </h5>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                                    <span className="capitalize">{resource.type}</span>
                                                    <span>⏱️ {resource.duration}</span>
                                                    {resource.isFree && (
                                                        <span className="text-accent-mint font-bold">FREE</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-accent-yellow text-xl group-hover:translate-x-1 transition-transform">
                                                →
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
