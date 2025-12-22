'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { DigitalClock } from '@/components/DigitalClock';
import { useTheme } from 'next-themes';
import { Sun, Moon, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
    Tools: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
    ),
    'Developer Hub': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    'Mini Postman': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    Upload: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    ),
    'Remove BG': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    'Project Analyzer': (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    About: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Blog: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    ),
    Learn: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    ),
    Playground: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Profile: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )
};

const learnItems = [
    { name: 'Learning Paths', href: '/learning-path' },
    { name: 'Resources', href: '/resources' },
    { name: 'Learn', href: '/learn' },
];

const toolsItems = [
    { name: 'Mini Postman', href: '/mini-postman' },
    { name: 'Remove BG', href: '/remove-background' },
    { name: 'Project Analyzer', href: '/project-analyzer' },
    { name: 'Playground', href: '/playground' },
];

const aiItems = [
    { name: 'AI Chat', href: '/chat' },
];

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [learnOpen, setLearnOpen] = useState(false);
    const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
    const learnDropdownRef = useRef<HTMLDivElement>(null);
    const toolsDropdownRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, signOut } = useAuth();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Learn', href: '#', isDropdown: true, dropdownType: 'learn' },
        { name: 'Tools', href: '#', isDropdown: true, dropdownType: 'tools' },
        { name: 'AI Chat', href: '/chat' },
        { name: 'Upload', href: '/upload' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
    ];

    const isLearnActive = learnItems.some(item => pathname === item.href);
    const isToolsActive = toolsItems.some(item => pathname === item.href);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setMobileOpen(false);
                setLearnOpen(false);
                setToolsOpen(false);
            }
        }
        if (mobileOpen || learnOpen || toolsOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [mobileOpen, learnOpen, toolsOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (learnDropdownRef.current && !learnDropdownRef.current.contains(event.target as Node)) {
                setLearnOpen(false);
            }
            if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
                setToolsOpen(false);
            }
        }

        if (learnOpen || toolsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [learnOpen, toolsOpen]);

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
        <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-background border-b border-gray-800 relative z-30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center font-black text-xs shadow-[4px_4px_0px_0px_#FFD300]">
                        2050
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-sans font-bold text-foreground tracking-tight">
                            Developer
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-black bg-accent-yellow text-[#10162F] transform -rotate-6 border border-white shadow-[2px_2px_0px_0px_#FFFFFF]">
                            v2.2
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">

                    <div className="hidden md:flex items-center gap-2">
                        <nav className="flex gap-1 text-sm font-medium text-foreground">
                            {navItems.map((item) => {
                                if (item.isDropdown) {
                                    const isLearn = item.dropdownType === 'learn';

                                    const dropdownOpen = isLearn ? learnOpen : toolsOpen;
                                    const setDropdownOpen = isLearn ? setLearnOpen : setToolsOpen;
                                    const dropdownRef = isLearn ? learnDropdownRef : toolsDropdownRef;
                                    const dropdownItems = isLearn ? learnItems : toolsItems;
                                    const isActive = isLearn ? isLearnActive : isToolsActive;

                                    return (
                                        <div key={item.name} className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => {
                                                    if (isLearn) {
                                                        setLearnOpen(!learnOpen);
                                                        setToolsOpen(false);
                                                    } else {
                                                        setToolsOpen(!toolsOpen);
                                                        setLearnOpen(false);
                                                    }
                                                }}
                                                onMouseEnter={() => {
                                                    if (isLearn) {
                                                        setLearnOpen(true);
                                                        setToolsOpen(false);
                                                    } else {
                                                        setToolsOpen(true);
                                                        setLearnOpen(false);
                                                    }
                                                }}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                                    ? 'bg-accent-yellow/15 text-accent-yellow'
                                                    : 'text-foreground/80 hover:bg-foreground/5 hover:text-accent-yellow'
                                                    }`}
                                            >
                                                {item.name}
                                                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {dropdownOpen && (
                                                <div
                                                    className="absolute top-full mt-2 left-0 min-w-[220px] bg-card-bg border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200"
                                                    onMouseLeave={() => setDropdownOpen(false)}
                                                >
                                                    <div className="p-2">
                                                        {dropdownItems.map((dropdownItem, index) => (
                                                            <Link
                                                                key={dropdownItem.name}
                                                                href={dropdownItem.href}
                                                                onClick={() => setDropdownOpen(false)}
                                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${pathname === dropdownItem.href
                                                                    ? 'text-accent-yellow bg-accent-yellow/15'
                                                                    : 'text-foreground/90 hover:text-accent-yellow hover:bg-foreground/5'
                                                                    }`}
                                                                style={{ animationDelay: `${index * 30}ms` }}
                                                            >
                                                                <div className={`flex-shrink-0 transition-transform duration-200 ${pathname === dropdownItem.href ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                                    {navIcons[dropdownItem.name as keyof typeof navIcons]}
                                                                </div>
                                                                <span className="flex-1">{dropdownItem.name}</span>
                                                                {pathname === dropdownItem.href && (
                                                                    <svg className="w-3.5 h-3.5 text-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === item.href
                                            ? 'bg-accent-yellow/15 text-accent-yellow'
                                            : 'text-foreground/80 hover:bg-foreground/5 hover:text-accent-yellow'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="flex items-center gap-3">

                            {user && (
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-accent-yellow text-background rounded-full hover:bg-accent-yellow/90 transition-colors"
                                >
                                    <User size={14} />
                                    Profile
                                </Link>
                            )}
                            {!user && (
                                <Link
                                    href="/auth/signin"
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-accent-yellow text-background rounded-full hover:bg-accent-yellow/90 transition-colors"
                                >
                                    <User size={14} />
                                    Sign In
                                </Link>
                            )}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 rounded-full hover:bg-foreground/10 text-foreground/80 hover:text-accent-yellow transition-all"
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMobileOpen((s) => !s)}
                        className="md:hidden p-2 rounded-md bg-foreground/5 hover:bg-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/30"
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
                        <div className="rounded-xl bg-card-bg border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                            <nav className="flex flex-col p-3 gap-1.5">
                                {navItems.map((item) => {
                                    if (item.isDropdown) {
                                        const isLearn = item.dropdownType === 'learn';

                                        const dropdownOpen = isLearn ? mobileLearnOpen : mobileToolsOpen;
                                        const setDropdownOpen = isLearn ? setMobileLearnOpen : setMobileToolsOpen;
                                        const dropdownItems = isLearn ? learnItems : toolsItems;
                                        const isActive = isLearn ? isLearnActive : isToolsActive;
                                        const iconKey = isLearn ? 'Learning Paths' : 'Tools';

                                        return (
                                            <div key={item.name} className="rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                                                        ? 'bg-accent-yellow/15 text-accent-yellow'
                                                        : 'text-foreground/90 hover:bg-foreground/5 hover:text-accent-yellow'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`transition-transform duration-200 ${dropdownOpen ? 'scale-110' : ''}`}>
                                                            {navIcons[iconKey as keyof typeof navIcons]}
                                                        </div>
                                                        {item.name}
                                                    </div>
                                                    <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {dropdownOpen && (
                                                    <div className="mt-1 ml-4 mr-2 space-y-1 pb-2 animate-in slide-in-from-top-2 duration-200">
                                                        {dropdownItems.map((dropdownItem, index) => (
                                                            <Link
                                                                key={dropdownItem.name}
                                                                href={dropdownItem.href}
                                                                onClick={() => setMobileOpen(false)}
                                                                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${pathname === dropdownItem.href
                                                                    ? 'text-accent-yellow bg-accent-yellow/15'
                                                                    : 'text-foreground/70 hover:text-accent-yellow hover:bg-foreground/5'
                                                                    }`}
                                                                style={{ animationDelay: `${index * 30}ms` }}
                                                            >
                                                                <div className={`flex-shrink-0 transition-transform duration-200 ${pathname === dropdownItem.href ? 'scale-110' : ''}`}>
                                                                    {navIcons[dropdownItem.name as keyof typeof navIcons]}
                                                                </div>
                                                                <span className="flex-1">{dropdownItem.name}</span>
                                                                {pathname === dropdownItem.href && (
                                                                    <svg className="w-3.5 h-3.5 text-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === item.href
                                                ? 'bg-accent-yellow/15 text-accent-yellow'
                                                : 'text-foreground/90 hover:bg-foreground/5 hover:text-accent-yellow'
                                                }`}
                                        >
                                            <div className={`transition-transform duration-200 ${pathname === item.href ? 'scale-110' : ''}`}>
                                                {navIcons[item.name as keyof typeof navIcons]}
                                            </div>
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="border-t border-gray-700/50 px-4 py-3 bg-foreground/5">
                                <div className="flex items-center justify-between">
                                    <DigitalClock />
                                    <div className="flex items-center gap-2">
                                        {user && (
                                            <Link
                                                href="/profile"
                                                onClick={() => setMobileOpen(false)}
                                                className="p-1.5 rounded-full hover:bg-foreground/10 text-foreground/60 hover:text-accent-yellow transition-all"
                                                aria-label="Profile"
                                            >
                                                <User size={14} />
                                            </Link>
                                        )}
                                        {!user && (
                                            <Link
                                                href="/auth/signin"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-accent-yellow text-background rounded-full hover:bg-accent-yellow/90 transition-colors"
                                            >
                                                <User size={14} />
                                                Sign In
                                            </Link>
                                        )}
                                        {mounted && (
                                            <button
                                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                                className="p-2 rounded-full hover:bg-foreground/10 text-foreground/80 hover:text-accent-yellow transition-all"
                                                aria-label="Toggle Theme"
                                            >
                                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
