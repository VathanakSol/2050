'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
    role: 'user' | 'model';
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full gap-4 py-6 px-4 md:px-8 ${isUser ? 'bg-transparent' : 'bg-[#1A1F2E]'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isUser ? (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        U
                    </div>
                ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accent-mint to-accent-blue flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-[#10162F]">
                            <path d="M16.5 7.5h-9v9h9v-9z" />
                            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0 max-w-4xl">
                {/* Username */}
                <div className="mb-2">
                    <span className={`text-sm font-bold ${isUser ? 'text-accent-yellow' : 'text-accent-yellow'}`}>
                        {isUser ? 'You' : 'Gemini AI'}
                    </span>
                </div>

                {/* Message Body */}
                <div className={`prose prose-invert max-w-none ${isUser ? 'text-gray-200' : 'text-gray-300'}`}>
                    {isUser ? (
                        <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Headings
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-bold text-white mt-4 mb-2">{children}</h3>,

                                // Paragraphs
                                p: ({ children }) => <p className="text-base leading-relaxed text-gray-300 mb-4">{children}</p>,

                                // Lists
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,

                                // Links
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-yellow hover:text-accent-yellow underline decoration-1 underline-offset-2 transition-colors"
                                    >
                                        {children}
                                    </a>
                                ),

                                // Code blocks
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');

                                    if (!inline && match) {
                                        return <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />;
                                    }

                                    // Inline code
                                    return (
                                        <code
                                            className="bg-[#2D3748] text-accent-yellow px-1.5 py-0.5 rounded font-mono text-sm border border-gray-700"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },

                                // Blockquotes
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-accent-yellow bg-[#1A1F2E] pl-4 py-2 my-4 italic text-gray-400">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
}

// Code Block Component with Copy Button
function CodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-lg overflow-hidden my-4 border-2 border-gray-700 bg-[#1e1e1e] shadow-lg">
            {/* Code Header */}
            <div className="bg-[#2D3748] px-4 py-2 flex justify-between items-center border-b border-gray-700">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    padding: '1.25rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                }}
                showLineNumbers={true}
                wrapLongLines={false}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
