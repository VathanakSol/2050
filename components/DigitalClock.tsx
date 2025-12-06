'use client';

import { useState, useEffect } from 'react';

export function DigitalClock() {
    const [hours, setHours] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    const [seconds, setSeconds] = useState<string>('00');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const updateTime = () => {
            const now = new Date();
            setHours(String(now.getHours()).padStart(2, '0'));
            setMinutes(String(now.getMinutes()).padStart(2, '0'));
            setSeconds(String(now.getSeconds()).padStart(2, '0'));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 pl-4">
                <svg className="w-4 h-4 text-accent-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-accent-yellow font-mono text-sm font-bold tabular-nums">
                    --:--:--
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 pl-4">
            <svg className="w-4 h-4 text-accent-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-accent-yellow font-mono text-sm font-bold tabular-nums min-w-[65px]">
                {hours}:{minutes}:{seconds}
            </span>
        </div>
    );
}
