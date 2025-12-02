'use client';

import React, { useState } from 'react';
import { parseDiff, Diff, Hunk, tokenize } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { detectLanguage } from '@/lib/languageDetector';

interface DiffViewProps {
    originalCode: string;
    fixedCode: string;
    language?: string;
    fileName?: string;
}

export function DiffView({ originalCode, fixedCode, language, fileName }: DiffViewProps) {
    const [viewType, setViewType] = useState<'split' | 'unified'>('split');

    // Detect language if not provided
    const detectedLang = language || detectLanguage({
        code: fixedCode,
        filename: fileName
    }).id;

    // Generate unified diff format
    const generateUnifiedDiff = () => {
        const header = `--- ${fileName || 'original'}\n+++ ${fileName || 'fixed'}\n`;
        const originalLines = originalCode.split('\n');
        const fixedLines = fixedCode.split('\n');

        let diff = header;
        let lineNum = 0;

        // Simple line-by-line diff
        const maxLines = Math.max(originalLines.length, fixedLines.length);

        for (let i = 0; i < maxLines; i++) {
            const origLine = originalLines[i];
            const fixLine = fixedLines[i];

            if (origLine !== fixLine) {
                if (origLine !== undefined) {
                    diff += `-${origLine}\n`;
                }
                if (fixLine !== undefined) {
                    diff += `+${fixLine}\n`;
                }
            } else if (origLine !== undefined) {
                diff += ` ${origLine}\n`;
            }
            lineNum++;
        }

        return diff;
    };

    const diffText = generateUnifiedDiff();

    // Parse diff for react-diff-view
    let files;
    try {
        files = parseDiff(diffText);
    } catch (error) {
        console.error('Error parsing diff:', error);
        // Fallback to side-by-side text display
        return <SimpleDiffView originalCode={originalCode} fixedCode={fixedCode} language={detectedLang} />;
    }

    const renderFile = () => {
        if (!files || files.length === 0) {
            return <SimpleDiffView originalCode={originalCode} fixedCode={fixedCode} language={detectedLang} />;
        }

        return files.map((file, index) => {
            const tokens = tokenize(file.hunks);

            return (
                <div key={index} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
                    <Diff
                        viewType={viewType}
                        diffType={file.type}
                        hunks={file.hunks}
                        tokens={tokens}
                    >
                        {(hunks) => hunks.map(hunk => (
                            <Hunk key={hunk.content} hunk={hunk} />
                        ))}
                    </Diff>
                </div>
            );
        });
    };

    return (
        <div className="diff-view-container my-4">
            {/* Header with controls */}
            <div className="flex items-center justify-between mb-3 p-3 bg-gray-800 rounded-t-lg border border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Code Comparison
                    </span>
                    {fileName && (
                        <span className="text-xs text-gray-500">• {fileName}</span>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setViewType('split')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all ${viewType === 'split'
                            ? 'bg-accent-yellow text-black'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Split
                    </button>
                    <button
                        onClick={() => setViewType('unified')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all ${viewType === 'unified'
                            ? 'bg-accent-yellow text-black'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Unified
                    </button>

                    <button
                        onClick={() => {
                            const blob = new Blob([fixedCode], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName || `fixed_code.${detectedLang === 'typescript' ? 'ts' : detectedLang}`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1 text-xs font-bold rounded bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-1"
                    >
                        <span>⬇</span>
                        Export Fixed
                    </button>
                </div>
            </div>

            {/* Diff content */}
            {renderFile()}
        </div>
    );
}

// Simple fallback diff view
function SimpleDiffView({ originalCode, fixedCode, language }: { originalCode: string; fixedCode: string; language: string }) {
    return (
        <div className="grid grid-cols-2 gap-4 my-4">
            <div className="border-2 border-red-500 rounded-lg overflow-hidden">
                <div className="bg-red-900/30 px-3 py-2 border-b border-red-500">
                    <span className="text-xs font-bold text-red-400">ORIGINAL</span>
                </div>
                <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-300 text-sm">
                    <code>{originalCode}</code>
                </pre>
            </div>

            <div className="border-2 border-green-500 rounded-lg overflow-hidden">
                <div className="bg-green-900/30 px-3 py-2 border-b border-green-500">
                    <span className="text-xs font-bold text-green-400">FIXED</span>
                </div>
                <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-300 text-sm">
                    <code>{fixedCode}</code>
                </pre>
            </div>
        </div>
    );
}
