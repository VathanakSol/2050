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
            <div className="text-center text-gray-400 mt-8">
                <p>No results found. Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {results.map((result) => (
                <div key={result.id} className="group relative p-6 bg-white text-gray-900 border-l-4 border-accent-yellow hover:translate-x-1 transition-transform duration-200 ease-out">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-800">
                            {result.category}
                        </span>
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-gray-500 hover:text-accent-blue truncate max-w-[200px]">
                            {result.url}
                        </a>
                    </div>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 group-hover:underline decoration-accent-yellow decoration-2 underline-offset-4">
                            {result.title}
                        </h5>
                    </a>
                    <p className="font-normal text-gray-700 leading-relaxed">
                        {result.description}
                    </p>
                </div>
            ))}
        </div>
    );
};
