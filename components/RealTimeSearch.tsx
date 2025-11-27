'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { searchInRealTime } from '@/app/actions/db';
import { getTechNews, NewsItem } from '@/app/actions/news';
import { getMotivationalQuote } from '@/app/actions/quote';
import { getAIAnswer } from '@/app/actions/ai-search';
import { Footer } from '@/components/layout/Footer';
import { getFeatureFlag } from '@/lib/featureFlags';

interface Result {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function RealTimeSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsSource, setNewsSource] = useState<'hn' | 'devto' | 'reddit' | 'github'>('hn');
    const [newsCategory, setNewsCategory] = useState<'latest' | 'top' | 'show' | 'ask'>('latest');
    const [isNewsLoading, setIsNewsLoading] = useState(false);
    const [quote, setQuote] = useState<string>('');
    const [isQuoteLoading, setIsQuoteLoading] = useState(true);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'results' | 'ai'>('results');

    // Check if AI features are enabled via beta flag
    const isAIEnabled = getFeatureFlag('features_enabled');

    useEffect(() => {
        const fetchQuote = async () => {
            setIsQuoteLoading(true);
            const motivationalQuote = await getMotivationalQuote();
            setQuote(motivationalQuote);
            setIsQuoteLoading(false);
        };
        fetchQuote();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            setIsNewsLoading(true);
            const newsItems = await getTechNews(newsSource, newsCategory);
            setNews(newsItems);
            setIsNewsLoading(false);
        };
        fetchNews();
    }, [newsSource, newsCategory]);

    useEffect(() => {
        // Debounce search - wait 500ms after user stops typing
        const timeoutId = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                if (isAIEnabled) {
                    setIsAiLoading(true);
                    setAiAnswer(null);
                }

                try {
                    // Run search and optionally AI answer in parallel
                    const promises: Promise<unknown>[] = [searchInRealTime(query)];
                    if (isAIEnabled) {
                        promises.push(getAIAnswer(query));
                    }

                    const results = await Promise.all(promises);
                    const searchResults = results[0] as Result[];
                    const aiResponse = isAIEnabled ? (results[1] as string) : null;

                    setResults(searchResults);
                    if (isAIEnabled) {
                        setAiAnswer(aiResponse);
                    }

                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                    if (isAIEnabled) {
                        setIsAiLoading(false);
                    }
                }
            } else {
                setResults([]);
                setAiAnswer(null);
                setIsLoading(false);
                setIsAiLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, isAIEnabled]);

    return (
        <div className="min-h-screen flex flex-col bg-[#10162F] font-sans text-foreground selection:bg-accent-yellow selection:text-black relative overflow-hidden">

            {/* Motivational Quote Banner */}
            <div className="w-full bg-linear-to-r from-accent-yellow/10 via-accent-yellow/5 to-transparent border-b border-accent-yellow/20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {isQuoteLoading ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-6 w-3/4 max-w-2xl bg-gray-800/50 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-3 animate-fade-in-up">
                            <span className="text-accent-yellow text-xl">✨</span>
                            <p className="text-gray-300 text-md font-medium text-center italic">
                                &quot;{quote}&quot;
                            </p>
                            <span className="text-accent-yellow text-xl">✨</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow flex flex-col px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Column: Search & Results */}
                    <div className="flex-grow lg:w-2/3">
                        <div className="text-center mb-8">
                            {!query && (
                                <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">
                                    Find your <span className="text-accent-yellow">tech</span> stack.
                                </h2>
                            )}
                            <SearchBar value={query} onChange={setQuery} />
                        </div>

                        {!query && (
                            <div className="mt-6 mb-12">
                                <p className="text-gray-400 mb-4 font-mono text-sm uppercase tracking-widest text-center ">Popular Searches</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {['React', 'Next.js', 'Tailwind', 'TypeScript', 'Database', 'Testing'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-6 py-2 text-sm font-bold bg-[#1F2937] text-white border border-gray-700 hover:bg-white hover:text-[#10162F] hover:border-white transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#FFD300]"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {query && (
                            <div className="w-full space-y-6">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-800 mb-6">
                                    <button
                                        onClick={() => setActiveTab('results')}
                                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'results' ? 'border-accent-yellow text-accent-yellow' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Search Results
                                    </button>
                                    {isAIEnabled && (
                                        <button
                                            onClick={() => setActiveTab('ai')}
                                            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'border-accent-yellow text-accent-yellow' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                        >
                                            AI Insight
                                            {isAiLoading && <div className="w-2 h-2 bg-accent-yellow rounded-full animate-pulse"></div>}
                                        </button>
                                    )}
                                </div>

                                {/* AI Answer Section */}
                                {activeTab === 'ai' && (
                                    <div className="w-full bg-[#111] border border-accent-yellow/30 rounded-lg p-6 shadow-[0_0_15px_rgba(255,211,0,0.1)] animate-fade-in-up min-h-[200px]">
                                        <div className="flex items-center gap-2 mb-4">

                                            <h3 className="text-accent-yellow font-bold uppercase tracking-wider text-sm">Power By Gemini</h3>
                                        </div>
                                        {isAiLoading ? (
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
                                                <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse"></div>
                                                <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse"></div>
                                            </div>
                                        ) : aiAnswer ? (
                                            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({ node, ...props }) => (
                                                            <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent-yellow hover:underline decoration-accent-yellow/50 underline-offset-4 transition-all" />
                                                        ),
                                                        ul: ({ node, ...props }) => (
                                                            <ul {...props} className="list-disc list-inside space-y-1 my-2 marker:text-accent-yellow" />
                                                        ),
                                                        ol: ({ node, ...props }) => (
                                                            <ol {...props} className="list-decimal list-inside space-y-1 my-2 marker:text-accent-yellow" />
                                                        ),
                                                        h3: ({ node, ...props }) => (
                                                            <h3 {...props} className="text-lg font-bold text-white mt-4 mb-2 tracking-tight" />
                                                        ),
                                                        code: ({ node, className, children, ...props }) => {
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const isInline = !match && !String(children).includes('\n');
                                                            return isInline ? (
                                                                <code {...props} className="bg-gray-800 text-accent-yellow px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700">
                                                                    {children}
                                                                </code>
                                                            ) : (
                                                                <code {...props} className={className}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {aiAnswer}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 italic">No AI insight available for this query.</div>
                                        )}
                                    </div>
                                )}

                                {/* Search Results Section */}
                                {activeTab === 'results' && (
                                    <>
                                        {isLoading ? (
                                            <div className="w-full">
                                                <div className="mb-4 text-gray-400 text-sm animate-pulse">
                                                    Searching...
                                                </div>
                                                <div className="space-y-4">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="relative p-6 bg-white/5 border-l-4 border-gray-700 animate-pulse">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="h-5 w-20 bg-gray-700 rounded"></div>
                                                                <div className="h-4 w-32 bg-gray-700 rounded"></div>
                                                            </div>
                                                            <div className="mb-2 h-7 w-3/4 bg-gray-600 rounded"></div>
                                                            <div className="space-y-2">
                                                                <div className="h-4 w-full bg-gray-700 rounded"></div>
                                                                <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="animate-fade-in-up">
                                                <SearchResults results={results} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Tech News */}
                    <div className="lg:w-1/3 w-full">
                        <div className="sticky top-8">
                            <div className="flex flex-col gap-4 mb-6 border-b border-gray-800 pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-accent-yellow tracking-tight">Tech News</h3>
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <button
                                        onClick={() => { setNewsSource('hn'); setNewsCategory('latest'); }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${newsSource === 'hn' ? 'bg-accent-yellow text-black' : 'bg-[#111] text-gray-400 hover:text-white border border-gray-800'}`}
                                    >
                                        Hacker
                                    </button>
                                    <button
                                        onClick={() => { setNewsSource('devto'); setNewsCategory('latest'); }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${newsSource === 'devto' ? 'bg-accent-yellow text-black' : 'bg-[#111] text-gray-400 hover:text-white border border-gray-800'}`}
                                    >
                                        Dev
                                    </button>
                                    <button
                                        onClick={() => { setNewsSource('reddit'); setNewsCategory('latest'); }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${newsSource === 'reddit' ? 'bg-accent-yellow text-black' : 'bg-[#111] text-gray-400 hover:text-white border border-gray-800'}`}
                                    >
                                        Reddit
                                    </button>
                                    <button
                                        onClick={() => { setNewsSource('github'); setNewsCategory('latest'); }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${newsSource === 'github' ? 'bg-accent-yellow text-black' : 'bg-[#111] text-gray-400 hover:text-white border border-gray-800'}`}
                                    >
                                        GitHub
                                    </button>
                                </div>

                                {(newsSource === 'hn' || newsSource === 'devto' || newsSource === 'reddit') && (
                                    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {['latest', 'top'].map((cat) => (
                                            <button
                                                key={cat}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                onClick={() => setNewsCategory(cat as any)}
                                                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border transition-all whitespace-nowrap ${newsCategory === cat ? 'border-accent-yellow text-accent-yellow bg-accent-yellow/10' : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isNewsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-16 bg-[#111] border border-gray-800 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {news.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block bg-[#111] border border-gray-800 hover:border-accent-yellow transition-all duration-200 hover:translate-x-1 overflow-hidden"
                                        >

                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h4 className="font-medium text-gray-300 group-hover:text-accent-yellow transition-colors line-clamp-2 text-sm">
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 shrink-0">
                                                        {item.source === 'Hacker News' ? 'HN' :
                                                            item.source === 'Dev.to' ? 'DEV' :
                                                                item.source === 'Reddit' ? 'RD' : 'GH'} ↗
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
