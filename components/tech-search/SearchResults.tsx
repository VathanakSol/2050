import React from 'react';

interface Result {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
}

interface SearchResultsProps {
    results: Result[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                    <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No matches found</h3>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Found
                    <span className="inline-flex bg-yellow-500 dark:bg-accent-yellow items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800 dark:text-white">
                        {results.length}
                    </span>
                    results
                </h2>
            </div>

            <div className="space-y-4">
                {results.map((result) => (
                    <div
                        key={result.id}
                        className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                                   border-l-4 border-l-accent-yellow shadow-sm hover:shadow-md dark:hover:border-gray-600
                                   transform hover:-translate-y-1 transition-all duration-200 ease-out"
                    >
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <span className="inline-flex items-center bg-yellow-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                    {result.category}
                                </span>
                                <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-gray-400 dark:text-gray-500 hover:text-accent-yellow dark:hover:text-accent-yellow truncate max-w-[200px]"
                                >
                                    {result.url}
                                </a>
                            </div>

                            <a href={result.url} target="_blank" rel="noopener noreferrer" className="block group-hover:underline decoration-accent-yellow decoration-2 underline-offset-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight font-sans">
                                    {result.title}
                                </h3>
                            </a>

                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                {result.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};