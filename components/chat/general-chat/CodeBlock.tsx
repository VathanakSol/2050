'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download } from 'lucide-react';
import { detectLanguage } from '@/lib/languageDetector';

interface CodeBlockProps {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    fileName?: string;
}

export function CodeBlock({ code, language, showLineNumbers = true, fileName }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const downloadCode = () => {
        const langInfo = detectLanguage({ code, explicitLang: language });
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `code.${langInfo.extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const langInfo = detectLanguage({ code, explicitLang: language });

    return (
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-[#1E1E1E] my-4 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{langInfo.icon}</span>
                    <span className="text-xs font-mono text-gray-400">
                        {langInfo.name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={downloadCode}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-accent-mint hover:bg-gray-700/50 rounded transition-all"
                        title="Download code"
                    >
                        <Download size={14} />
                        <span>Export</span>
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-all"
                    >
                        {isCopied ? (
                            <>
                                <Check size={14} className="text-accent-mint" />
                                <span className="text-accent-mint">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="relative">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        backgroundColor: '#1E1E1E',
                    }}
                    showLineNumbers={showLineNumbers}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: '#6e7681',
                        textAlign: 'right',
                    }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
