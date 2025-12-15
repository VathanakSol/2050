"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { CodeEditor } from './CodeEditor';
import { ResultPreview } from './ResultPreview';
import { ConsolePanel } from './ConsolePanel';
import { Code, FileCode, Play, LayoutTemplate } from 'lucide-react';

interface LogEntry {
    type: 'log' | 'error' | 'warn';
    message: string[];
    timestamp: string;
}

export const IdeLayout = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [htmlCode, setHtmlCode] = useState('');
    const [cssCode, setCssCode] = useState('');
    const [jsCode, setJsCode] = useState('');

    const [isAutoRun, setIsAutoRun] = useState(false);
    const [runId, setRunId] = useState(0);

    const [debouncedHtml, setDebouncedHtml] = useState(htmlCode);
    const [debouncedCss, setDebouncedCss] = useState(cssCode);
    const [debouncedJs, setDebouncedJs] = useState(jsCode);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAutoRun) return;

        const timer = setTimeout(() => {
            setLogs([]); // Clear logs before new run
            setRunId(prev => prev + 1); // Force remount
            setDebouncedHtml(htmlCode);
            setDebouncedCss(cssCode);
            setDebouncedJs(jsCode);
        }, 800);

        return () => clearTimeout(timer);
    }, [htmlCode, cssCode, jsCode, isAutoRun]);

    const handleManualRun = () => {
        setLogs([]); // Clear logs before new run
        setRunId(prev => prev + 1); // Force remount
        setDebouncedHtml(htmlCode);
        setDebouncedCss(cssCode);
        setDebouncedJs(jsCode);
    };

    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html');
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const handleConsoleLog = React.useCallback((type: 'log' | 'error' | 'warn', message: any[]) => {
        setLogs(prev => [...prev, {
            type,
            message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    }, []);

    const clearConsole = () => setLogs([]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white overflow-hidden transition-colors">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#161b22] border-b border-gray-300 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                        2050 IDE
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0d1117] rounded-md p-1 border border-gray-300 dark:border-gray-700">
                        <label className="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isAutoRun}
                                onChange={(e) => setIsAutoRun(e.target.checked)}
                                className="w-3 h-3 accent-blue-500 rounded"
                            />
                            <span className={isAutoRun ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}>Auto Run</span>
                        </label>
                    </div>

                    <button
                        onClick={handleManualRun}
                        disabled={isAutoRun}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${isAutoRun
                            ? 'bg-gray-300 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 dark:shadow-green-900/20'
                            }`}
                        title={isAutoRun ? "Disable Auto Run to use Manual Run" : "Run Code (Ctrl+Enter)"}
                    >
                        <Play size={14} fill="currentColor" />
                        Run
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Editor Section */}
                <div className="w-1/2 flex flex-col border-r border-gray-300 dark:border-gray-800 min-w-0">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 dark:bg-[#0d1117] border-b border-gray-300 dark:border-gray-800 shrink-0">
                        <button
                            onClick={() => setActiveTab('html')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'html'
                                ? 'border-orange-500 text-orange-500 dark:text-orange-400 bg-white dark:bg-[#1f2428]'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#161b22]'
                                }`}
                        >
                            <LayoutTemplate size={16} /> HTML
                        </button>
                        <button
                            onClick={() => setActiveTab('css')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'css'
                                ? 'border-blue-500 text-blue-500 dark:text-blue-400 bg-white dark:bg-[#1f2428]'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#161b22]'
                                }`}
                        >
                            <FileCode size={16} /> CSS
                        </button>
                        <button
                            onClick={() => setActiveTab('javascript')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'javascript'
                                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-white dark:bg-[#1f2428]'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#161b22]'
                                }`}
                        >
                            <Code size={16} /> JavaScript
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative min-h-0">
                        {mounted && activeTab === 'html' && (
                            <CodeEditor
                                language="html"
                                code={htmlCode}
                                onChange={setHtmlCode}
                            />
                        )}
                        {mounted && activeTab === 'css' && (
                            <CodeEditor
                                language="css"
                                code={cssCode}
                                onChange={setCssCode}
                            />
                        )}
                        {mounted && activeTab === 'javascript' && (
                            <CodeEditor
                                language="javascript"
                                code={jsCode}
                                onChange={setJsCode}
                            />
                        )}
                    </div>
                </div>

                {/* Preview & Console Section */}
                <div className="w-1/2 flex flex-col h-full min-w-0">
                    {/* Preview */}
                    <div className="flex-1 bg-white relative min-h-0 overflow-hidden">

                        <ResultPreview
                            key={runId}
                            htmlCode={debouncedHtml}
                            cssCode={debouncedCss}
                            jsCode={debouncedJs}
                            onConsoleLog={handleConsoleLog}
                        />
                    </div>

                    {/* Console */}
                    <div className="h-48 border-t border-gray-300 dark:border-gray-800 shrink-0">
                        <ConsolePanel logs={logs} onClear={clearConsole} />
                    </div>
                </div>
            </div>
        </div>
    );
};
