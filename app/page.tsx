'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import mockData from '@/data/mockData.json';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];

    const lowerQuery = searchQuery.toLowerCase();
    return mockData.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black">
      {/* Header */}
      <header className="w-full py-5 px-4 sm:px-6 lg:px-8 bg-[#10162F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#10162F] flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_#FFD300]">
              N
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              NakTech
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-white">
            <a href="#" className="hover:text-accent-yellow transition-colors">Catalog</a>
            <a href="#" className="hover:text-accent-yellow transition-colors">Resources</a>
            <a href="#" className="hover:text-accent-yellow transition-colors">Community</a>
            <a href="#" className="hover:text-accent-yellow transition-colors">Pricing</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="w-full max-w-3xl text-center mb-12">
          {!searchQuery && (
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">
              Find your <span className="text-accent-mint">tech</span> stack.
            </h2>
          )}

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {!searchQuery && (
            <div className="mt-10">
              <p className="text-gray-400 mb-4 font-mono text-sm uppercase tracking-widest">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'Next.js', 'Tailwind', 'TypeScript'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-6 py-2 text-sm font-bold bg-[#1F2937] text-white border border-gray-700 hover:bg-white hover:text-[#10162F] hover:border-white transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#FFD300]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="w-full animate-fade-in-up">
            <SearchResults results={filteredResults} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#0A0E1F] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} NakTech Search.
          </p>
          <div className="flex gap-8 text-sm font-bold text-white">
            <a href="#" className="hover:text-accent-yellow">Privacy Policy</a>
            <a href="#" className="hover:text-accent-yellow">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
