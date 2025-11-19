import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="search"
                    className="block w-full p-4 pl-12 text-base text-gray-900 bg-white border-2 border-transparent focus:border-accent-yellow outline-none transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] focus:shadow-[4px_4px_0px_0px_#FFD300]"
                    placeholder="Search NakTech..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                />
            </div>
        </div>
    );
};
