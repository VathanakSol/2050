'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { searchInRealTime } from '@/app/actions/db';
import { getTechNews, NewsItem } from '@/app/actions/news';
import { getMotivationalQuote } from '@/app/actions/quote';
import { getAIAnswer } from '@/app/actions/ai-search';
import { getFeatureFlag } from '@/lib/featureFlags';
import { CountdownBanner } from '@/components/CountdownBanner';

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


            {/* Countdown Banner */}
            <CountdownBanner />
            {/* Motivational Quote Banner */}
            <div className="w-full bg-[#10162F] border-y border-accent-yellow/20 relative z-10">
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
                            {/* Header Section */}
                            <div className="flex flex-col gap-3 mb-6 pb-4 border-b-2 border-accent-yellow/30">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                    <h3 className="text-xl font-black text-white tracking-tight">Tech News</h3>
                                </div>

                                {/* Source Buttons */}
                                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <button
                                        onClick={() => { setNewsSource('hn'); setNewsCategory('latest'); }}
                                        className={`px-4 py-2 text-xs font-bold rounded transition-all whitespace-nowrap min-w-fit ${newsSource === 'hn' ? 'bg-accent-yellow text-[#10162F] shadow-lg' : 'bg-[#0a0e1f] text-gray-400 hover:text-white'}`}
                                    >
                                        🔶 Hacker News
                                    </button>
                                    <button
                                        onClick={() => { setNewsSource('devto'); setNewsCategory('latest'); }}
                                        className={`px-4 py-2 text-xs font-bold rounded transition-all whitespace-nowrap min-w-fit ${newsSource === 'devto' ? 'bg-accent-yellow text-[#10162F] shadow-lg' : 'bg-[#0a0e1f] text-gray-400 hover:text-white'}`}
                                    >
                                        💻 Dev.to
                                    </button>
                                    <button
                                        onClick={() => { setNewsSource('github'); setNewsCategory('latest'); }}
                                        className={`px-4 py-2 text-xs font-bold rounded transition-all whitespace-nowrap min-w-fit ${newsSource === 'github' ? 'bg-accent-yellow text-[#10162F] shadow-lg' : 'bg-[#0a0e1f] text-gray-400 hover:text-white'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><g fill="none"><rect width="256" height="256" fill="#242938" rx="60" /><path fill="#fff" d="M128.001 30C72.779 30 28 74.77 28 130.001c0 44.183 28.653 81.667 68.387 94.89c4.997.926 6.832-2.169 6.832-4.81c0-2.385-.093-10.262-.136-18.618c-27.82 6.049-33.69-11.799-33.69-11.799c-4.55-11.559-11.104-14.632-11.104-14.632c-9.073-6.207.684-6.079.684-6.079c10.042.705 15.33 10.305 15.33 10.305c8.919 15.288 23.394 10.868 29.1 8.313c.898-6.464 3.489-10.875 6.349-13.372c-22.211-2.529-45.56-11.104-45.56-49.421c0-10.918 3.906-19.839 10.303-26.842c-1.039-2.519-4.462-12.69.968-26.464c0 0 8.398-2.687 27.508 10.25c7.977-2.215 16.531-3.326 25.03-3.364c8.498.038 17.06 1.149 25.051 3.365c19.087-12.939 27.473-10.25 27.473-10.25c5.443 13.773 2.019 23.945.98 26.463c6.412 7.003 10.292 15.924 10.292 26.842c0 38.409-23.394 46.866-45.662 49.341c3.587 3.104 6.783 9.189 6.783 18.519c0 13.38-.116 24.149-.116 27.443c0 2.661 1.8 5.779 6.869 4.797C199.383 211.64 228 174.169 228 130.001C228 74.771 183.227 30 128.001 30M65.454 172.453c-.22.497-1.002.646-1.714.305c-.726-.326-1.133-1.004-.898-1.502c.215-.512.999-.654 1.722-.311c.727.326 1.141 1.01.89 1.508m4.919 4.389c-.477.443-1.41.237-2.042-.462c-.654-.697-.777-1.629-.293-2.078c.491-.442 1.396-.235 2.051.462c.654.706.782 1.631.284 2.078m3.374 5.616c-.613.426-1.615.027-2.234-.863c-.613-.889-.613-1.955.013-2.383c.621-.427 1.608-.043 2.236.84c.611.904.611 1.971-.015 2.406m5.707 6.504c-.548.604-1.715.442-2.57-.383c-.874-.806-1.118-1.95-.568-2.555c.555-.606 1.729-.435 2.59.383c.868.804 1.133 1.957.548 2.555m7.376 2.195c-.242.784-1.366 1.14-2.499.807c-1.13-.343-1.871-1.26-1.642-2.052c.235-.788 1.364-1.159 2.505-.803c1.13.341 1.871 1.252 1.636 2.048m8.394.932c.028.824-.932 1.508-2.121 1.523c-1.196.027-2.163-.641-2.176-1.452c0-.833.939-1.51 2.134-1.53c1.19-.023 2.163.639 2.163 1.459m8.246-.316c.143.804-.683 1.631-1.864 1.851c-1.161.212-2.236-.285-2.383-1.083c-.144-.825.697-1.651 1.856-1.865c1.183-.205 2.241.279 2.391 1.097" /></g></svg>
                                            GitHub
                                        </span>
                                    </button>
                                </div>

                                {/* Category Buttons */}
                                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {['latest', 'top'].map((cat) => (
                                        <button
                                            key={cat}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onClick={() => setNewsCategory(cat as any)}
                                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border-2 transition-all whitespace-nowrap ${newsCategory === cat ? 'border-accent-yellow text-accent-yellow bg-accent-yellow/10 ' : 'border-gray-700 text-gray-500 hover:border-accent-yellow/50 hover:text-gray-300'}`}
                                        >
                                            {cat === 'latest' ? '🔥 ' : '⭐ '}{cat}
                                        </button>
                                    ))}
                                </div>

                            </div>

                            {/* News Items */}
                            {isNewsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-20 bg-gradient-to-r from-[#0a0e1f] to-[#111] border border-gray-800/50 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {news.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block bg-gradient-to-br from-[#0a0e1f] to-[#050810] border border-gray-800 hover:border-accent-yellow rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,211,0,0.15)] hover:-translate-y-0.5 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h4 className="font-semibold text-gray-300 group-hover:text-accent-yellow transition-colors line-clamp-2 text-sm leading-relaxed">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex flex-col items-end gap-1 shrink-0">

                                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-accent-yellow transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </div>
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

        </div>
    );
}
