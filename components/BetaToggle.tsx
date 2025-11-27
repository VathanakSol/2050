'use client';

import { useState, useEffect } from 'react';
import { getFeatureFlag, setFeatureFlag } from '@/lib/featureFlags';

interface BetaToggleProps {
    flagName?: string;
    compact?: boolean;
}

export function BetaToggle({ flagName = 'features_enabled', compact = false }: BetaToggleProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize state from feature flag
        setIsEnabled(getFeatureFlag(flagName));
        setIsLoading(false);
    }, [flagName]);

    const handleToggle = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        setFeatureFlag(flagName, newValue);

        // Reload page to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    if (isLoading) {
        return null;
    }

    // Compact version for header integration
    if (compact) {
        return (
            <button
                onClick={handleToggle}
                className={`
                    relative w-12 h-6 border-2 border-gray-600 rounded-md transition-all
                    ${isEnabled ? 'bg-[#FFD300]' : 'bg-gray-700'}
                    hover:border-gray-400
                `}
                aria-label={`Toggle beta mode ${isEnabled ? 'off' : 'on'}`}
            >
                <div
                    className={`
                        absolute top-0.5 w-4 h-4 bg-white border border-[#10162F]
                        transition-all duration-300
                        ${isEnabled ? 'right-0.5' : 'left-0.5'}
                    `}
                />
            </button>
        );
    }

    // Default version (for standalone use or custom positioning)
    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-[#00FFF0] uppercase tracking-wider">
                    Beta
                </span>
                {/* <span className="text-[10px] text-gray-400 font-mono">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                </span> */}
            </div>

            <button
                onClick={handleToggle}
                className={`
                    relative w-14 h-7 border-2 border-white transition-all
                    ${isEnabled ? 'bg-[#FFD300]' : 'bg-gray-700'}
                    hover:shadow-[2px_2px_0px_0px_#FFFFFF]
                `}
                aria-label={`Toggle beta mode ${isEnabled ? 'off' : 'on'}`}
            >
                <div
                    className={`
                        absolute top-0.5 w-5 h-5 bg-white border-2 border-[#10162F]
                        transition-all duration-300
                        ${isEnabled ? 'right-0.5' : 'left-0.5'}
                    `}
                />
            </button>
        </div>
    );
}
