'use client';

import { useState, useEffect } from 'react';
import { getFeatureFlag, setFeatureFlag } from '@/lib/featureFlags';

interface BetaToggleProps {
    flagName?: string;
}

export function BetaToggle({ flagName = 'features_enabled' }: BetaToggleProps) {
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

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-[#1F2937] border-2 border-white shadow-[4px_4px_0px_0px_#FFD300] p-4 flex items-center gap-3">
                {/* Decorative corner */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#00FFF0] border border-white"></div>

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#00FFF0] uppercase tracking-wider">
                        Beta Mode
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
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
        </div>
    );
}
