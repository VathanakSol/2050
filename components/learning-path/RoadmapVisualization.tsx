'use client';

import { useState } from 'react';
import { LearningPath, Milestone } from '@/app/actions/learning-path';
import { MilestoneCard } from '@/components/learning-path/MilestoneCard';

interface RoadmapVisualizationProps {
    learningPath: LearningPath;
    onReset: () => void;
}

export function RoadmapVisualization({ learningPath, onReset }: RoadmapVisualizationProps) {
    const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

    const toggleMilestone = (id: number) => {
        setExpandedMilestone(expandedMilestone === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-card-bg border-4 border-white p-8 shadow-[8px_8px_0px_0px_#FFD300] mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">{learningPath.title}</h1>
                        <p className="text-gray-400 text-md">{learningPath.description}</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="px-4 py-2 bg-gray-700 text-white font-bold border-2 border-white hover:bg-gray-600 transition-all whitespace-nowrap"
                    >
                        ↻ New Roadmap
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-black text-accent-yellow">{learningPath.milestones.length}</div>
                        <div className="text-sm text-gray-400">Milestones</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-white">{learningPath.estimatedDuration}</div>
                        <div className="text-sm text-gray-400">Duration</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-accent-yellow">
                            {learningPath.milestones.reduce((sum, m) => sum + m.resources.length, 0)}
                        </div>
                        <div className="text-sm text-gray-400">Resources</div>
                    </div>
                </div>
            </div>

            {/* Timeline Visualization */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-yellow via-accent-mint to-accent-blue hidden md:block" />

                {/* Milestones */}
                <div className="space-y-6">
                    {learningPath.milestones.map((milestone) => {
                        const isExpanded = expandedMilestone === milestone.id;

                        return (
                            <div key={milestone.id} className="relative">
                                {/* Timeline Node */}
                                <div className="hidden md:flex absolute left-0 top-6 items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-white bg-card-bg text-white shadow-[4px_4px_0px_0px_#FFD300] flex items-center justify-center font-black text-xl transition-all">
                                        {milestone.id}
                                    </div>
                                </div>

                                {/* Milestone Card */}
                                <div className="md:ml-32">
                                    <MilestoneCard
                                        milestone={milestone}
                                        isExpanded={isExpanded}
                                        onToggle={() => toggleMilestone(milestone.id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Export Options */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => {
                        const data = JSON.stringify(learningPath, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'learning-roadmap.json';
                        a.click();
                    }}
                    className="px-6 py-3 bg-accent-mint text-background font-bold border-3 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none transition-all"
                >
                    💾 Export Roadmap
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}
                    className="px-6 py-3 bg-white text-background font-bold border-3 border-background shadow-[4px_4px_0px_0px_#FFD300] hover:translate-y-1 hover:shadow-none transition-all"
                >
                    🔗 Share Roadmap
                </button>
            </div>
        </div>
    );
}
