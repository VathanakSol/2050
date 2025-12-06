'use client';

import React, { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownBanner() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const calculateTimeLeft = (): TimeLeft => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const nextYear = new Date(currentYear + 1, 0, 1, 0, 0, 0); // January 1st next year
            const difference = nextYear.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }

            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return null;
    }

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
    ];

    return (
        <div className="w-full bg-accent-yellow border-b border-[#10162F]/20 relative overflow-hidden">
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 py-2 relative z-10">
                <div className="flex items-center justify-center gap-3 text-sm">
                    {/* Icon */}
                    <span className="text-[#10162F]">🎉</span>

                    {/* Text */}
                    <span className="text-[#10162F] font-bold">
                        ROAD TO {new Date().getFullYear() + 1}
                    </span>

                    {/* Inline Countdown */}
                    <div className="flex items-center gap-1.5">
                        {timeUnits.map((unit, index) => (
                            <React.Fragment key={unit.label}>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#10162F] font-black tabular-nums">
                                        {String(unit.value).padStart(2, '0')}
                                    </span>
                                    <span className="text-[#10162F]/70 text-xs font-medium">
                                        {unit.label.toLowerCase()}
                                    </span>
                                </div>

                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
