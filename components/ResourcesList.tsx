'use client';

import React, { useState } from 'react';
import { ResourceCard } from '@/components/ResourceCard';
import { SearchBar } from '@/components/SearchBar';

interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    type: string;
    pricing: string;
    level: string;
}

interface ResourcesListProps {
    initialResources: Resource[];
}

export function ResourcesList({ initialResources }: ResourcesListProps) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setIsLoading(false);
        }, 500); // Simulate network delay

        return () => clearTimeout(timer);
    }, [query]);

    const filteredResources = initialResources.filter((resource) => {
        const lowerQuery = debouncedQuery.toLowerCase();
        return (
            resource.title.toLowerCase().includes(lowerQuery) ||
            resource.description.toLowerCase().includes(lowerQuery) ||
            resource.category.toLowerCase().includes(lowerQuery)
        );
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl sm:text-5xl font-black text-[#10162F] mb-4 tracking-tight">
                    <span className="text-accent-yellow">Learning Resources</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Curated collection of the best tools, courses, and platforms to level up your skills.
                </p>

                <SearchBar value={query} onChange={setQuery} />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-full flex flex-col bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_#10162F] p-6 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="mb-4 h-8 w-3/4 bg-gray-200 rounded"></div>
                            <div className="flex-grow space-y-2 mb-6">
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                            </div>
                            <div className="pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                    {filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}

            {!isLoading && filteredResources.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No resources found matching "{query}".</p>
                </div>
            )}
        </div>
    );
}
