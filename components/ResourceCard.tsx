import React from 'react';

interface ResourceProps {
    resource: {
        id: string;
        title: string;
        description: string;
        url: string;
        category: string;
        type: string;
        pricing: string;
        level: string;
    };
}

export function ResourceCard({ resource }: ResourceProps) {
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#FFD300] hover:-translate-y-1 transition-all duration-200 group"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-xs font-bold bg-[#10162F] text-white uppercase tracking-wider">
                    {resource.category}
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-accent-yellow text-black border border-black uppercase tracking-wider">
                    {resource.pricing}
                </span>
            </div>

            <h3 className="text-xl font-black text-[#10162F] mb-2 group-hover:text-blue-600 transition-colors">
                {resource.title}
            </h3>

            <p className="text-gray-600 mb-6 line-clamp-3">
                {resource.description}
            </p>

            <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 text-gray-600 rounded">
                    {resource.type}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-200 text-gray-600 rounded">
                    {resource.level}
                </span>
            </div>
        </a>
    );
}
