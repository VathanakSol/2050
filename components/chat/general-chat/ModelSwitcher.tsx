import React from 'react';

interface ModelSwitcherProps {
    currentModel: 'general' | 'code-fixer';
    onModelChange: (model: 'general' | 'code-fixer') => void;
}

export function ModelSwitcher({ currentModel, onModelChange }: ModelSwitcherProps) {
    return (
        <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex border border-gray-200">
                <button
                    onClick={() => onModelChange('general')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${currentModel === 'general'
                        ? 'bg-white text-black shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    General
                </button>
                <button
                    onClick={() => onModelChange('code-fixer')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${currentModel === 'code-fixer'
                        ? 'bg-[#10162F] text-accent-yellow shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <span>Code Fixer</span>
                    {currentModel === 'code-fixer' && <span className="text-xs">🛠️</span>}
                </button>
            </div>
        </div>
    );
}
