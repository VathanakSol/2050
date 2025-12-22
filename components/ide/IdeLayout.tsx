"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { CodeEditor } from './CodeEditor';
import { ResultPreview } from './ResultPreview';
import { ConsolePanel } from './ConsolePanel';
import {
    Code,
    FileCode,
    Play,
    LayoutTemplate,
    Save,
    FolderOpen,
    Download,
    RotateCcw,
    BookTemplate,
    Wand2,
    Copy,
    Check,
    Settings,
    Library,
    Columns,
    Rows,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { codeTemplates, CodeTemplate } from './templates';

interface LogEntry {
    type: 'log' | 'error' | 'warn';
    message: string[];
    timestamp: string;
}

const PRESET_LIBS = [
    { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com' },
    { name: 'Font Awesome', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
    { name: 'Google Fonts: Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' },
    { name: 'Animate.css', url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' },
    { name: 'Lodash', url: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js' },
    { name: 'Axios', url: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js' },
];

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

    const [showTemplates, setShowTemplates] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showLoadDialog, setShowLoadDialog] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showLibraries, setShowLibraries] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [savedProjects, setSavedProjects] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Simple toast notification state
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // New features state
    const [layout, setLayout] = useState<'split' | 'stack'>('split');
    const [fontSize, setFontSize] = useState(14);
    const [externalLibs, setExternalLibs] = useState<string[]>([]);
    const [newLibUrl, setNewLibUrl] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadSavedProjectsList();

        // Load last project if exists
        const lastProject = localStorage.getItem('ide_last_project');
        if (lastProject) {
            const project = JSON.parse(lastProject);
            setHtmlCode(project.html || '');
            setCssCode(project.css || '');
            setJsCode(project.js || '');
        }
    }, []);

    useEffect(() => {
        if (!isAutoRun) return;

        const timer = setTimeout(() => {
            setLogs([]);
            setRunId(prev => prev + 1);
            setDebouncedHtml(htmlCode);
            setDebouncedCss(cssCode);
            setDebouncedJs(jsCode);
        }, 800);

        return () => clearTimeout(timer);
    }, [htmlCode, cssCode, jsCode, isAutoRun]);

    // Auto-save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('ide_last_project', JSON.stringify({
                html: htmlCode,
                css: cssCode,
                js: jsCode
            }));
        }, 1000);

        return () => clearTimeout(timer);
    }, [htmlCode, cssCode, jsCode]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Enter to run
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleManualRun();
            }
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                setShowSaveDialog(true);
            }
            // Ctrl/Cmd + O to open
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                setShowLoadDialog(true);
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, []);

    const handleManualRun = () => {
        setLogs([]);
        setRunId(prev => prev + 1);
        setDebouncedHtml(htmlCode);
        setDebouncedCss(cssCode);
        setDebouncedJs(jsCode);
    };

    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html');
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const handleConsoleLog = useCallback((type: 'log' | 'error' | 'warn', message: any[]) => {
        setLogs(prev => [...prev, {
            type,
            message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    }, []);

    const clearConsole = () => setLogs([]);

    const loadSavedProjectsList = () => {
        const projects = Object.keys(localStorage)
            .filter(key => key.startsWith('ide_project_'))
            .map(key => key.replace('ide_project_', ''));
        setSavedProjects(projects);
    };

    const saveProject = () => {
        if (!projectName.trim()) return;

        const project = {
            html: htmlCode,
            css: cssCode,
            js: jsCode,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(`ide_project_${projectName}`, JSON.stringify(project));
        loadSavedProjectsList();
        setShowSaveDialog(false);
        setProjectName('');
        showToast('Project saved successfully!');
    };

    const loadProject = (name: string) => {
        const projectData = localStorage.getItem(`ide_project_${name}`);
        if (projectData) {
            const project = JSON.parse(projectData);
            setHtmlCode(project.html || '');
            setCssCode(project.css || '');
            setJsCode(project.js || '');
            setShowLoadDialog(false);
        }
    };

    const deleteProject = (name: string) => {
        localStorage.removeItem(`ide_project_${name}`);
        loadSavedProjectsList();
    };

    const loadTemplate = (template: CodeTemplate) => {
        setHtmlCode(template.html);
        setCssCode(template.css);
        setJsCode(template.js);
        setShowTemplates(false);
    };

    const resetCode = () => {
        if (confirm('Are you sure you want to clear all code?')) {
            setHtmlCode('');
            setCssCode('');
            setJsCode('');
        }
    };

    const downloadProject = () => {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2050 IDE Project</title>
    <style>
${cssCode}
    </style>
</head>
<body>
${htmlCode}
    <script>
${jsCode}
    </script>
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async () => {
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2050 IDE Project</title>
    <style>
${cssCode}
    </style>
</head>
<body>
${htmlCode}
    <script>
${jsCode}
    </script>
</body>
</html>`;

        await navigator.clipboard.writeText(fullHtml);
        setCopied(true);
        showToast('HTML copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white overflow-hidden transition-colors">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#161b22] border-b border-gray-300 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                        2050 IDE
                    </h1>

                    {/* Main Tools Group */}
                    <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-800 pr-2">
                        <button
                            onClick={() => setShowTemplates(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Code Templates"
                        >
                            <BookTemplate size={16} className="text-accent-yellow" />
                            Templates
                        </button>

                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Save Project (Ctrl+S)"
                        >
                            <Save size={16} />
                            Save
                        </button>

                        <button
                            onClick={() => setShowLoadDialog(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Load Project (Ctrl+O)"
                        >
                            <FolderOpen size={16} />
                            Load
                        </button>
                    </div>

                    {/* Developer Features Group */}
                    <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-800 pr-2">
                        <button
                            onClick={() => setLayout(l => l === 'split' ? 'stack' : 'split')}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title={`Switch to ${layout === 'split' ? 'Stack' : 'Split'} Layout`}
                        >
                            {layout === 'split' ? <Rows size={16} /> : <Columns size={16} />}
                        </button>

                        <button
                            onClick={() => setShowLibraries(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Manage External Libraries"
                        >
                            <Library size={16} />
                            Libs
                        </button>

                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Settings"
                        >
                            <Settings size={16} />
                        </button>
                    </div>

                    {/* Export/Actions Group */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={downloadProject}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title="Download as HTML"
                        >
                            <Download size={16} />
                        </button>

                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>

                        <button
                            onClick={resetCode}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Clear All Code"
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-3 text-sm cursor-pointer select-none group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isAutoRun}
                                    onChange={(e) => setIsAutoRun(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-11 h-5.5 rounded-full transition-all duration-300 ease-in-out ${isAutoRun
                                    ? 'bg-accent-yellow shadow-sm'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-all duration-300 ease-in-out ${isAutoRun ? 'translate-x-5' : 'translate-x-0.5'
                                        } mt-0.5`}></div>
                                </div>
                            </div>
                            <span className={`font-medium transition-all duration-200 ${isAutoRun
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                                }`}>
                                Auto Run
                            </span>
                        </label>
                    </div>
                    <button
                        onClick={handleManualRun}
                        disabled={isAutoRun}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isAutoRun
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                            : 'bg-accent-yellow text-white shadow-lg dark:shadow-green-900/30 hover:cursor-pointer dark:hover:shadow-green-900/40 transform hover:scale-105 active:scale-95'
                            }`}
                        title={isAutoRun ? "Disable Auto Run to use Manual Run" : "Run Code (Ctrl+Enter)"}
                    >
                        <Play size={16} fill="currentColor" />
                        Run Code
                    </button>
                </div>
            </div>

            <div className={`flex flex-1 overflow-hidden min-h-0 ${layout === 'stack' ? 'flex-col' : 'flex-row'}`}>
                {/* Editor Section */}
                <div className={`${layout === 'stack' ? 'h-1/2 w-full' : 'w-1/2'} flex flex-col border-r dark:border-gray-800 transition-all duration-300 min-w-0 ${isFullscreen ? 'hidden' : ''}`}>
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
                    <div className="flex-1 relative min-h-0 overflow-hidden">
                        {mounted && activeTab === 'html' && (
                            <CodeEditor
                                language="html"
                                code={htmlCode}
                                onChange={setHtmlCode}
                                fontSize={fontSize}
                            />
                        )}
                        {mounted && activeTab === 'css' && (
                            <CodeEditor
                                language="css"
                                code={cssCode}
                                onChange={setCssCode}
                                fontSize={fontSize}
                            />
                        )}
                        {mounted && activeTab === 'javascript' && (
                            <CodeEditor
                                language="javascript"
                                code={jsCode}
                                onChange={setJsCode}
                                fontSize={fontSize}
                            />
                        )}
                    </div>
                </div>

                {/* Preview & Console Section */}
                <div className={`flex-1 flex flex-col h-full min-w-0 ${isFullscreen ? 'fixed inset-0 z-[100] bg-white dark:bg-[#0d1117] h-screen w-screen' : ''}`}>
                    {/* Preview Toolbar (only in fullscreen) */}
                    {isFullscreen && (
                        <div className="bg-gray-100 dark:bg-[#161b22] px-4 py-2 flex items-center justify-between border-b dark:border-gray-800">
                            <span className="font-bold">Live Preview</span>
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                            >
                                <Minimize2 size={20} />
                            </button>
                        </div>
                    )}
                    {/* Preview */}
                    <div className="flex-1 bg-white relative min-h-0 overflow-hidden">
                        <ResultPreview
                            key={runId}
                            htmlCode={debouncedHtml}
                            cssCode={debouncedCss}
                            jsCode={debouncedJs}
                            externalLibs={externalLibs}
                            onConsoleLog={handleConsoleLog}
                        />
                    </div>

                    {/* Console */}
                    {!isFullscreen && (
                        <div className={`${layout === 'stack' ? 'h-32' : 'h-48'} border-t border-gray-300 dark:border-gray-800 shrink-0`}>
                            <ConsolePanel logs={logs} onClear={clearConsole} />
                        </div>
                    )}
                </div>
            </div>

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTemplates(false)}>
                    <div className="bg-white dark:bg-[#161b22] rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-[#161b22] border-b border-gray-300 dark:border-gray-800 p-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Wand2 size={24} className="text-accent-yellow" />
                                Code Templates
                            </h2>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {codeTemplates.map((template, index) => (
                                <div
                                    key={index}
                                    onClick={() => loadTemplate(template)}
                                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-accent-yellow dark:hover:border-accent-yellow cursor-pointer transition-all hover:shadow-lg"
                                >
                                    <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSaveDialog(false)}>
                    <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Save Project</h2>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
                            onKeyPress={(e) => e.key === 'Enter' && saveProject()}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveProject}
                                disabled={!projectName.trim()}
                                className="px-4 py-2 bg-accent-yellow text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Dialog */}
            {showLoadDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLoadDialog(false)}>
                    <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Load Project</h2>
                        {savedProjects.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No saved projects yet</p>
                        ) : (
                            <div className="space-y-2">
                                {savedProjects.map((name, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-accent-yellow dark:hover:border-accent-yellow transition-all"
                                    >
                                        <button
                                            onClick={() => loadProject(name)}
                                            className="flex-1 text-left font-medium"
                                        >
                                            {name}
                                        </button>
                                        <button
                                            onClick={() => deleteProject(name)}
                                            className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
                    <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Settings size={24} />
                                Editor Settings
                            </h2>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">×</button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Font Size: {fontSize}px
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    step="1"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-yellow"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>12px</span>
                                    <span>24px</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t dark:border-gray-800">
                                <p className="text-sm text-gray-500 mb-2">More settings coming soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Libraries Modal */}
            {showLibraries && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLibraries(false)}>
                    <div className="bg-white dark:bg-[#161b22] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Library size={24} className="text-accent-yellow" />
                                External Libraries
                            </h2>
                            <button onClick={() => setShowLibraries(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">×</button>
                        </div>

                        <div className="flex-1 overflow-auto space-y-6 pr-2">
                            {/* Add Custom Library */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Custom CDN URL (.js or .css)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newLibUrl}
                                        onChange={(e) => setNewLibUrl(e.target.value)}
                                        placeholder="https://cdn.example.com/lib.js"
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            if (newLibUrl.trim()) {
                                                setExternalLibs([...externalLibs, newLibUrl.trim()]);
                                                setNewLibUrl('');
                                            }
                                        }}
                                        className="px-4 py-2 bg-accent-yellow text-white rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Preset Libraries */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Presets</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PRESET_LIBS.map((lib: { name: string; url: string }, i: number) => (
                                        <button
                                            key={i}
                                            disabled={externalLibs.includes(lib.url)}
                                            onClick={() => setExternalLibs([...externalLibs, lib.url])}
                                            className="px-3 py-2 text-sm text-left border border-gray-300 dark:border-gray-700 rounded-lg hover:border-accent-yellow dark:hover:border-accent-yellow disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${externalLibs.includes(lib.url) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            {lib.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Libraries */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Libraries ({externalLibs.length})</label>
                                {externalLibs.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No external libraries added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {externalLibs.map((url, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                                                <span className="truncate flex-1 mr-2 text-gray-600 dark:text-gray-400">{url}</span>
                                                <button
                                                    onClick={() => setExternalLibs(externalLibs.filter(l => l !== url))}
                                                    className="text-red-500 hover:text-red-600 p-1"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Toasts */}
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900 dark:bg-accent-yellow'
                    } text-white`}>
                    {toast.type === 'error' ? <RotateCcw size={20} /> : <Check size={20} />}
                    <span className="font-semibold">{toast.message}</span>
                </div>
            )}
        </div>
    );
};
