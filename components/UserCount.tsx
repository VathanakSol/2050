'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getUserCount } from '@/app/actions/user-actions';

export function UserCount() {
    const [count, setCount] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            const userCount = await getUserCount();
            // If count is 0, we might want to show a base number or just 0
            // For a "Join X+ developers" vibe, we can handle it here
            setCount(userCount);
            setIsVisible(true);
        };

        fetchCount();

        // Refresh every 5 minutes if page stays open
        const interval = setInterval(fetchCount, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    // Aesthetic display logic: if count is 0, show "Be the first" or "Join our"
    const displayCount = count !== null && count > 0 ? `${count}+` : '';

    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-full animate-fade-in transition-all hover:bg-foreground/10 dark:hover:bg-white/10 group cursor-default shadow-sm hover:shadow-md">
            <div className="relative">
                <Users className="w-4 h-4 text-accent-yellow group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-yellow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-yellow"></span>
                </span>
            </div>
            <p className="text-xs font-bold tracking-tight text-foreground/80">
                Join <span className="text-accent-yellow font-black">{displayCount || 'our'}</span> growing community of developers
            </p>
        </div>
    );
}
