'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { DiffView } from '../code-fixer/DiffView';

interface ChatMessageProps {
    role: 'user' | 'model';
    content: string;
    model?: 'general' | 'code-fixer';
    metadata?: {
        originalCode?: string;
        fixedCode?: string;
        language?: string;
        fileName?: string;
    };
}


export function ChatMessage({ role, content, model = 'general', metadata }: ChatMessageProps) {
    const isUser = role === 'user';
    const isCodeFixer = model === 'code-fixer';
    const hasDiff = metadata?.originalCode && metadata?.fixedCode;

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[85%] p-4 rounded-lg border-2 shadow-sm ${isUser
                    ? 'bg-accent-yellow text-[#10162F] border-black'
                    : isCodeFixer
                        ? 'bg-[#10162F] text-gray-100 border-accent-yellow shadow-[4px_4px_0px_0px_#FFD300]'
                        : 'bg-[#1F2937] text-gray-100 border-gray-700'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-opacity-30 border-current">
                    <div className={`w-2 h-2 rounded-full ${isCodeFixer ? 'bg-accent-yellow' : 'bg-current'}`}></div>
                    <span className={`text-xs font-bold opacity-70 uppercase tracking-wider ${isCodeFixer ? 'text-accent-yellow' : ''}`}>
                        {isUser ? 'You' : isCodeFixer ? '🛠️ Code Fixer' : '🤖 Gemini AI'}
                    </span>
                </div>

                {/* Content */}
                {isUser ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                        {content}
                    </pre>
                ) : (
                    <>
                        {/* Render DiffView if we have original and fixed code */}
                        {hasDiff && metadata.originalCode && metadata.fixedCode && (
                            <DiffView
                                originalCode={metadata.originalCode}
                                fixedCode={metadata.fixedCode}
                                language={metadata.language}
                                fileName={metadata.fileName}
                            />
                        )}

                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeString = String(children).replace(/\n$/, '');
                                        const isInline = !className;

                                        return !isInline && match ? (
                                            <CodeBlock
                                                code={codeString}
                                                language={match[1]}
                                                showLineNumbers={true}
                                            />
                                        ) : (
                                            <code
                                                className="bg-gray-800 px-1.5 py-0.5 rounded text-accent-mint font-mono text-xs"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl font-black text-accent-yellow mb-3 mt-4">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-xl font-bold text-accent-mint mb-2 mt-3">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-lg font-bold text-white mb-2 mt-2">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="ml-4 text-gray-300">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-accent-yellow pl-4 italic text-gray-400 my-3">
                                            {children}
                                        </blockquote>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-bold text-accent-yellow">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-accent-mint">{children}</em>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-accent-mint underline hover:text-accent-yellow transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
