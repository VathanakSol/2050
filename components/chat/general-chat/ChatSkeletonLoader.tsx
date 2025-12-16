import React from 'react';

interface ChatSkeletonLoaderProps {
    model: 'general' | 'code-fixer';
}

export function ChatSkeletonLoader({ model }: ChatSkeletonLoaderProps) {
    return (
        <div className="flex w-full justify-start mb-6">
            <div className="w-full p-4 rounded-lg border bg-card-bg text-foreground border-foreground/20 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-foreground/20">
                    <div className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></div>
                    <span className="text-xs font-bold opacity-70 uppercase tracking-wider">
                        {model === 'code-fixer' ? 'Code Fixer' : 'Gemini AI'}
                    </span>
                </div>

                {/* Skeleton Loading Animation */}
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-foreground/20 rounded-md w-full"></div>
                    <div className="h-4 bg-foreground/20 rounded-md w-11/12"></div>
                    <div className="h-4 bg-foreground/20 rounded-md w-4/5"></div>
                    <div className="h-4 bg-foreground/20 rounded-md w-full"></div>
                    <div className="h-4 bg-foreground/20 rounded-md w-3/4"></div>
                </div>

                {/* Typing Indicator */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-foreground/20">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-foreground/60 italic">
                        {model === 'code-fixer' ? 'Fixing code...' : 'Generating response...'}
                    </span>
                </div>
            </div>
        </div>
    );
}
