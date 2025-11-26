'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Resources', href: '/resources' },
        { name: 'AI Chat', href: '/chat' },
        { name: 'JSON Generator', href: '/json-generator' },
        { name: 'Upload', href: '/upload' },
        { name: 'About', href: '/about' },
    ];

    useEffect(() => {
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
                            v1.0.5
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex gap-8 text-sm font-sans font-bold text-white">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors ${pathname === item.href ? 'text-accent-yellow' : 'hover:text-accent-yellow'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

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
                                        className={`block w-full px-4 py-2 rounded text-sm font-semibold ${pathname === item.href ? 'text-accent-yellow' : 'text-white/90 hover:text-accent-yellow'}`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
