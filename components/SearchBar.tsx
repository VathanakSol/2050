'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    value: string;
    onChange?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    const [query, setQuery] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            // "/" key (only if not already in an input/textarea)
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleChange = (newValue: string) => {
        setQuery(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onChange) {
            if (query.trim()) {
                router.push(`/?q=${encodeURIComponent(query)}`);
            } else {
                router.push('/');
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
            <form onSubmit={handleSubmit}>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="search"
                        className="block w-full p-4 pl-12 pr-24 text-base text-gray-900 bg-white border-2 border-gray-200 focus:border-accent-yellow outline-none transition-all shadow-[4px_4px_0px_0px_#e0e0e0] focus:shadow-[4px_4px_0px_0px_#FFD300] [&::-webkit-search-cancel-button]:appearance-none"
                        placeholder="Search NakTech..."
                        value={query}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {/* Shortcut hint - hidden when focused */}
                    {!isFocused && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-500 bg-gray-100 border border-gray-300 rounded">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
