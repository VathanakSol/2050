'use client';

import { useState } from 'react';
import { UserProfile } from '@/app/actions/learning-path';

interface OnboardingFormProps {
    onComplete: (profile: UserProfile) => void;
    isLoading: boolean;
}

const SKILL_LEVELS = [
    { value: 'beginner' as const, label: 'Beginner', emoji: '🌱', desc: 'Just starting out' },
    { value: 'junior' as const, label: 'Junior', emoji: '🌿', desc: '0-2 years experience' },
    { value: 'intermediate' as const, label: 'Intermediate', emoji: '🌳', desc: '2-5 years experience' },
    { value: 'senior' as const, label: 'Senior', emoji: '🏆', desc: '5+ years experience' },
    { value: 'expert' as const, label: 'Expert', emoji: '🚀', desc: 'Industry veteran' },
];

const TARGET_ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Engineer',
    'Machine Learning Engineer',
    'Cloud Architect',
    'UI/UX Developer',
    'Game Developer',
];

const LEARNING_STYLES = [
    { value: 'project-based' as const, label: 'Project-Based', emoji: '🛠️', desc: 'Learn by building' },
    { value: 'tutorial-based' as const, label: 'Tutorial-Based', emoji: '📺', desc: 'Follow guided lessons' },
    { value: 'documentation-based' as const, label: 'Documentation', emoji: '📚', desc: 'Read and explore' },
    { value: 'mixed' as const, label: 'Mixed', emoji: '🎯', desc: 'Combination approach' },
];

const COMMON_SKILLS = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Node.js', 'Python', 'Java', 'C#', 'Go', 'Rust',
    'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'CI/CD', 'Testing', 'Agile',
];

export function OnboardingForm({ onComplete, isLoading }: OnboardingFormProps) {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        currentSkills: [],
    });

    const totalSteps = 5;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        if (isProfileComplete(profile)) {
            onComplete(profile as UserProfile);
        }
    };

    const isProfileComplete = (p: Partial<UserProfile>): boolean => {
        return !!(
            p.skillLevel &&
            p.targetRole &&
            p.hoursPerWeek &&
            p.learningStyle &&
            p.currentSkills
        );
    };

    const toggleSkill = (skill: string) => {
        const current = profile.currentSkills || [];
        if (current.includes(skill)) {
            setProfile({ ...profile, currentSkills: current.filter(s => s !== skill) });
        } else {
            setProfile({ ...profile, currentSkills: [...current, skill] });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">Step {step} of {totalSteps}</span>
                    <span className="text-sm font-bold text-accent-yellow">{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-800 border-2 border-white shadow-[4px_4px_0px_0px_#FFD300]">
                    <div
                        className="h-full bg-accent-yellow transition-all duration-500"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-card-bg border-4 border-white p-8 shadow-[8px_8px_0px_0px_#FFD300] min-h-[400px]">
                {/* Step 1: Skill Level */}
                {step === 1 && (
                    <div className="animate-[fade-in-up_0.5s_ease-out]">
                        <h2 className="text-3xl font-black text-white mb-3">What's your current level?</h2>
                        <p className="text-gray-400 mb-6">This helps us tailor the roadmap to your experience.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SKILL_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setProfile({ ...profile, skillLevel: level.value })}
                                    className={`p-6 border-4 transition-all transform hover:-translate-y-1 ${profile.skillLevel === level.value
                                        ? 'border-accent-yellow bg-accent-yellow/10 shadow-[4px_4px_0px_0px_#FFD300]'
                                        : 'border-gray-700 hover:border-accent-mint'
                                        }`}
                                >
                                    <div className="text-4xl mb-2">{level.emoji}</div>
                                    <div className="font-black text-white text-lg">{level.label}</div>
                                    <div className="text-sm text-gray-400">{level.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Target Role */}
                {step === 2 && (
                    <div className="animate-[fade-in-up_0.5s_ease-out]">
                        <h2 className="text-3xl font-black text-white mb-3">What's your goal?</h2>
                        <p className="text-gray-400 mb-6">Choose the role you're aiming for.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {TARGET_ROLES.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setProfile({ ...profile, targetRole: role })}
                                    className={`p-4 border-3 text-left font-bold transition-all ${profile.targetRole === role
                                        ? 'border-accent-yellow bg-accent-yellow/10 text-accent-yellow'
                                        : 'border-gray-700 text-white hover:border-accent-mint hover:text-accent-mint'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-bold text-white mb-2">Or enter custom role:</label>
                            <input
                                type="text"
                                placeholder="e.g., Blockchain Developer"
                                value={!TARGET_ROLES.includes(profile.targetRole || '') ? (profile.targetRole || '') : ''}
                                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                                className="w-full px-4 py-3 bg-background border-3 border-gray-700 text-white focus:border-accent-yellow focus:outline-none font-medium"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Time Commitment */}
                {step === 3 && (
                    <div className="animate-[fade-in-up_0.5s_ease-out]">
                        <h2 className="text-3xl font-black text-white mb-3">How much time can you commit?</h2>
                        <p className="text-gray-400 mb-6">Hours per week you can dedicate to learning.</p>

                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <div className="text-7xl font-black text-accent-yellow mb-2">
                                    {profile.hoursPerWeek || 0}
                                </div>
                                <div className="text-xl text-white font-bold">hours per week</div>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="40"
                                value={profile.hoursPerWeek || 10}
                                onChange={(e) => setProfile({ ...profile, hoursPerWeek: parseInt(e.target.value) })}
                                className="w-full h-3 bg-gray-700 border-2 border-white appearance-none cursor-pointer accent-accent-yellow"
                            />

                            <div className="flex justify-between text-sm text-gray-400 mt-2">
                                <span>1h</span>
                                <span>20h</span>
                                <span>40h</span>
                            </div>

                            <div className="mt-8 p-4 bg-background border-2 border-accent-mint">
                                <div className="text-sm text-gray-400">
                                    💡 <span className="font-bold text-accent-mint">Pro tip:</span> {
                                        (profile.hoursPerWeek || 0) < 5 ? 'Even a few hours weekly builds momentum!' :
                                            (profile.hoursPerWeek || 0) < 15 ? 'Great commitment! You\'ll see steady progress.' :
                                                'Intense pace! You\'ll advance quickly.'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Current Skills */}
                {step === 4 && (
                    <div className="animate-[fade-in-up_0.5s_ease-out]">
                        <h2 className="text-3xl font-black text-white mb-3">What do you already know?</h2>
                        <p className="text-gray-400 mb-6">Select all technologies you're familiar with.</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {COMMON_SKILLS.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-4 py-2 border-2 font-bold text-sm transition-all ${(profile.currentSkills || []).includes(skill)
                                        ? 'border-accent-yellow bg-accent-yellow text-background'
                                        : 'border-gray-700 text-white hover:border-accent-mint'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>

                        <div className="text-sm text-gray-400 text-center">
                            Selected: <span className="font-bold text-accent-yellow">{(profile.currentSkills || []).length}</span> skills
                        </div>
                    </div>
                )}

                {/* Step 5: Learning Style */}
                {step === 5 && (
                    <div className="animate-[fade-in-up_0.5s_ease-out]">
                        <h2 className="text-3xl font-black text-white mb-3">How do you learn best?</h2>
                        <p className="text-gray-400 mb-6">We'll customize resources to match your style.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {LEARNING_STYLES.map((style) => (
                                <button
                                    key={style.value}
                                    onClick={() => setProfile({ ...profile, learningStyle: style.value })}
                                    className={`p-6 border-4 transition-all ${profile.learningStyle === style.value
                                        ? 'border-accent-yellow bg-accent-yellow/10 shadow-[4px_4px_0px_0px_#FFD300]'
                                        : 'border-gray-700 hover:border-accent-mint'
                                        }`}
                                >
                                    <div className="text-5xl mb-3">{style.emoji}</div>
                                    <div className="font-black text-white text-xl mb-1">{style.label}</div>
                                    <div className="text-sm text-gray-400">{style.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="px-6 py-3 bg-gray-700 text-white font-bold border-3 border-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    ← Back
                </button>

                {step < totalSteps ? (
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !profile.skillLevel) ||
                            (step === 2 && !profile.targetRole) ||
                            (step === 3 && !profile.hoursPerWeek)
                        }
                        className="px-6 py-3 bg-accent-yellow text-background font-black border-3 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isProfileComplete(profile) || isLoading}
                        className="px-8 py-3 bg-accent-yellow text-background font-black text-lg border-3 border-white shadow-[6px_6px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? '⚡ Generating...' : '🚀 Generate My Roadmap'}
                    </button>
                )}
            </div>
        </div>
    );
}
