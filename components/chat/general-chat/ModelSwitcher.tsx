import React from 'react';

interface ModelSwitcherProps {
    currentModel: 'general' | 'code-fixer';
    onModelChange: (model: 'general' | 'code-fixer') => void;
}

export function ModelSwitcher({ currentModel, onModelChange }: ModelSwitcherProps) {
    return (
        <div className="flex justify-center mb-6">
            <div className="bg-card-bg p-1 rounded-lg inline-flex border border-foreground/20">
                <button
                    onClick={() => onModelChange('general')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${currentModel === 'general'
                        ? 'bg-background text-foreground shadow-sm border border-foreground/20'
                        : 'text-foreground/60 hover:text-foreground'
                        }`}
                >
                    General
                </button>
                <button
                    onClick={() => onModelChange('code-fixer')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${currentModel === 'code-fixer'
                        ? 'bg-card-bg text-accent-yellow shadow-sm'
                        : 'text-foreground/60 hover:text-foreground'
                        }`}
                >
                    <span>Code Fixer</span>
                    {currentModel === 'code-fixer' && <span className="text-xs">🛠️</span>}
                </button>
            </div>
        </div>
    );
}
