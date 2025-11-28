'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { BetaToggle } from '@/components/BetaToggle';

const navIcons = {
    Home: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Resources: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    'Learning Paths': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    ),
    'AI Chat': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    ),
    'JSON Generator': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    Upload: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    ),
    About: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Resources', href: '/resources' },
        { name: 'Learning Paths', href: '/learning-path' },
        { name: 'AI Chat', href: '/chat' },
        { name: 'JSON Generator', href: '/json-generator' },
        { name: 'Upload', href: '/upload' },
        { name: 'About', href: '/about' },
    ];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setMobileOpen(false);
        }
        if (mobileOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileOpen]);

    // Prevent background scrolling and avoid layout shift when modal opens
    const bodyPrevStyleRef = useRef<{ overflow?: string; paddingRight?: string } | null>(null);
    useEffect(() => {
        if (!mobileOpen) {
            if (bodyPrevStyleRef.current) {
                document.body.style.overflow = bodyPrevStyleRef.current.overflow || '';
                document.body.style.paddingRight = bodyPrevStyleRef.current.paddingRight || '';
                bodyPrevStyleRef.current = null;
            }
            return;
        }

        bodyPrevStyleRef.current = {
            overflow: document.body.style.overflow,
            paddingRight: document.body.style.paddingRight,
        };

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            if (bodyPrevStyleRef.current) {
                document.body.style.overflow = bodyPrevStyleRef.current.overflow || '';
                document.body.style.paddingRight = bodyPrevStyleRef.current.paddingRight || '';
                bodyPrevStyleRef.current = null;
            }
        };
    }, [mobileOpen]);

    return (
        <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-[#10162F] border-b border-gray-800 relative z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-[#10162F] flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_#FFD300]">
                        N
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
                            NakTech
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-black bg-[#FFD300] text-[#10162F] transform -rotate-6 border border-white shadow-[2px_2px_0px_0px_#FFFFFF]">
                            v1.2
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6">
                        <nav className="flex gap-6 text-sm font-medium text-white">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`transition-colors hover:text-accent-yellow ${pathname === item.href ? 'text-accent-yellow font-semibold' : 'text-white/80'}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="border-l border-gray-700 pl-6">
                            <BetaToggle flagName="features_enabled" />
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMobileOpen((s) => !s)}
                        className="md:hidden p-2 rounded-md bg-white/5 hover:bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="naktech-mobile-menu">
                    <div
                        className="fixed inset-0 z-40 bg-black/40 pointer-events-auto"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation"
                        className="fixed left-1/2 transform -translate-x-1/2 top-20 z-50 w-[min(640px,calc(100%-32px))]"
                    >
                        <div className="rounded-lg bg-[#0F1530] border border-gray-800 shadow-lg overflow-hidden">


                            <nav className="flex flex-col p-4 gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 w-full px-4 py-2 rounded text-sm font-semibold ${pathname === item.href ? 'text-accent-yellow' : 'text-white/90 hover:text-accent-yellow'}`}
                                    >
                                        {navIcons[item.name as keyof typeof navIcons]}
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="border-t border-gray-700 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    {/* <span className="text-xs font-bold text-[#00FFF0] uppercase tracking-wider">Beta Mode</span> */}
                                    <BetaToggle flagName="features_enabled" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
