"use client";

import React, { useState } from "react";
import {
    Play,
    Plus,
    Trash2,
    Loader2,
    Clock,
    Database,
    Globe,
    AlertTriangle,
    Wifi,
    WifiOff,
    Shield,
    Server,
    RefreshCw
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";

interface KeyValuePair {
    id: string;
    key: string;
    value: string;
}

interface ApiResponse {
    status: number;
    statusText: string;
    data: string | null;
    time: number;
    size: number;
    headers: Record<string, string>;
}

interface ErrorState {
    type: 'network' | 'timeout' | 'cors' | 'server' | 'validation' | 'unknown';
    message: string;
    details?: string;
    suggestion?: string;
}

export default function ApiClientPage() {
    const { theme } = useTheme();
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
    const [params, setParams] = useState<KeyValuePair[]>([{ id: uuidv4(), key: "", value: "" }]);
    const [headers, setHeaders] = useState<KeyValuePair[]>([
        { id: uuidv4(), key: "", value: "" }
    ]);
    const [body, setBody] = useState("{\n  \n}");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("params");
    const [error, setError] = useState<ErrorState | null>(null);

    // Helper to update key-value pairs
    const updatePair = (
        setList: React.Dispatch<React.SetStateAction<KeyValuePair[]>>,
        id: string,
        field: "key" | "value",
        newValue: string
    ) => {
        setList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: newValue } : item))
        );
    };

    const addPair = (setList: React.Dispatch<React.SetStateAction<KeyValuePair[]>>) => {
        setList((prev) => [...prev, { id: uuidv4(), key: "", value: "" }]);
    };

    const removePair = (
        setList: React.Dispatch<React.SetStateAction<KeyValuePair[]>>,
        id: string
    ) => {
        setList((prev) => prev.filter((item) => item.id !== id));
    };

    // Helper to manage headers based on method
    const handleMethodChange = (newMethod: string) => {
        setMethod(newMethod);
        
        // Auto-manage Content-Type header based on method
        if (["POST", "PUT", "PATCH"].includes(newMethod)) {
            // Add Content-Type if not present for methods that typically need it
            const hasContentType = headers.some(h => h.key.toLowerCase() === "content-type");
            if (!hasContentType) {
                const emptyHeaderIndex = headers.findIndex(h => !h.key && !h.value);
                if (emptyHeaderIndex >= 0) {
                    // Use existing empty header
                    updatePair(setHeaders, headers[emptyHeaderIndex].id, "key", "Content-Type");
                    updatePair(setHeaders, headers[emptyHeaderIndex].id, "value", "application/json");
                } else {
                    // Add new header
                    setHeaders(prev => [...prev, { id: uuidv4(), key: "Content-Type", value: "application/json" }]);
                }
            }
        }
    };

    const handleSend = async () => {
        setIsLoading(true);
        setError(null);
        setResponse(null);
        const startTime = performance.now();

        try {
            // Construct URL with params
            const urlObj = new URL(url);
            params.forEach((p) => {
                if (p.key) urlObj.searchParams.append(p.key, p.value);
            });

            // Construct Headers - be more careful about which headers to include
            const headersObj: HeadersInit = {};
            headers.forEach((h) => {
                if (h.key && h.value) {
                    // For GET requests, avoid adding Content-Type header unless necessary
                    if (method === "GET" && h.key.toLowerCase() === "content-type") {
                        return; // Skip Content-Type for GET requests
                    }
                    headersObj[h.key] = h.value;
                }
            });

            const options: RequestInit = {
                method,
                mode: 'cors', // Explicitly set CORS mode
                credentials: 'omit', // Don't send credentials to avoid preflight
            };

            // Only add headers if we have any
            if (Object.keys(headersObj).length > 0) {
                options.headers = headersObj;
            }

            // Only add body for methods that support it
            if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && body.trim()) {
                options.body = body;
                // Ensure Content-Type is set for requests with body
                if (!options.headers) options.headers = {};
                if (!Object.keys(options.headers).some(key => key.toLowerCase() === 'content-type')) {
                    (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
                }
            }

            const res = await fetch(urlObj.toString(), options);
            const endTime = performance.now();

            const blob = await res.blob();
            const text = await blob.text();
            let data = text;

            // Try to format JSON
            try {
                const json = JSON.parse(text);
                data = JSON.stringify(json, null, 2);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // Not JSON, keep as text
            }

            const resHeaders: Record<string, string> = {};
            res.headers.forEach((val, key) => {
                resHeaders[key] = val;
            });

            setResponse({
                status: res.status,
                statusText: res.statusText,
                data,
                time: Math.round(endTime - startTime),
                size: blob.size,
                headers: resHeaders,
            });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMessage = err.message || "Something went wrong";
            let errorState: ErrorState;

            // Categorize different types of errors
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorState = {
                    type: 'network',
                    message: 'Network Connection Failed',
                    details: 'Unable to reach the server. Please check your internet connection.',
                    suggestion: 'Verify the URL is correct and your network connection is stable.'
                };
            } else if (errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin')) {
                errorState = {
                    type: 'cors',
                    message: 'CORS Policy Violation',
                    details: 'The server has blocked this request due to CORS policy. This often happens when the server receives an OPTIONS preflight request but doesn&apos;t handle it properly.',
                    suggestion: 'For FastAPI: Add CORS middleware to your server. For GET requests: Remove unnecessary headers like Content-Type to avoid preflight requests.'
                };
            } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
                errorState = {
                    type: 'timeout',
                    message: 'Request Timeout',
                    details: 'The server took too long to respond.',
                    suggestion: 'Try again or check if the server is experiencing high load.'
                };
            } else if (errorMessage.includes('SSL') || errorMessage.includes('certificate')) {
                errorState = {
                    type: 'server',
                    message: 'SSL Certificate Error',
                    details: 'There is an issue with the server\'s SSL certificate.',
                    suggestion: 'Verify the URL uses HTTPS correctly or contact the server administrator.'
                };
            } else if (errorMessage.includes('Invalid URL') || errorMessage.includes('malformed')) {
                errorState = {
                    type: 'validation',
                    message: 'Invalid URL Format',
                    details: 'The provided URL is not properly formatted.',
                    suggestion: 'Check the URL format and ensure it includes the protocol (http:// or https://).'
                };
            } else {
                errorState = {
                    type: 'unknown',
                    message: 'Request Failed',
                    details: errorMessage,
                    suggestion: 'Please try again or check your request configuration.'
                };
            }

            setError(errorState);
        } finally {
            setIsLoading(false);
        }
    };

    const editorTheme = theme === "dark" || theme === "system" ? vscodeDark : vscodeLight;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F1419] text-[#10162F] dark:text-gray-100 transition-colors duration-200 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-[#10162F] rounded-lg shadow-xl border-2 border-[#10162F] dark:border-gray-700 overflow-hidden">
                    {/* Header Section */}
                    <div className="border-b-2 border-[#10162F] dark:border-gray-700 p-6 bg-gradient-to-r from-white to-gray-50 dark:from-[#10162F] dark:to-[#1a2040]">
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-accent-yellow dark:text-white mb-2">Mini Postman</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Test and debug your API endpoints with ease</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select
                                    value={method}
                                    onChange={(e) => handleMethodChange(e.target.value)}
                                    className="appearance-none bg-white dark:bg-[#1D233D] border-2 border-[#10162F] dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-sm font-bold text-[#10162F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A10E5] shadow-lg hover:shadow-xl transition-all cursor-pointer min-w-[120px]"
                                >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#10162F] dark:text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                                className="flex-1 bg-white dark:bg-[#1D233D] border-2 border-[#10162F] dark:border-gray-600 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3A10E5] text-[#10162F] dark:text-white shadow-lg hover:shadow-xl transition-all min-w-0"
                            />

                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-[#FFD300] to-[#FFC700] hover:from-[#FFC700] hover:to-[#FFB700] text-[#10162F] border-2 border-[#10162F] dark:border-[#FFD300] px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 whitespace-nowrap"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                                Send
                            </button>
                        </div>

                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        {/* Left Panel: Request Configuration */}
                        <div className="bg-white dark:bg-[#1a2040] ml-6 rounded-lg border-2 border-[#10162F] dark:border-gray-600 overflow-hidden shadow-lg">
                            <div className="flex border-b-2 border-[#10162F] dark:border-gray-600 bg-gradient-to-r from-[#FFF0E5] to-[#FFE4CC] dark:from-[#1a2040] dark:to-[#243055]">
                                {["params", "headers", "body"].map((tab) => (
                                    <button
                                        key={tab}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-6 py-4 text-sm font-bold capitalize border-r-2 border-[#10162F] dark:border-gray-600 transition-all relative ${activeTab === tab
                                            ? "bg-white dark:bg-[#243055] text-[#3A10E5] dark:text-[#FFD300] shadow-lg"
                                            : "bg-transparent text-[#10162F] dark:text-gray-400 hover:bg-white/70 dark:hover:bg-[#243055]/50"
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3A10E5] dark:bg-[#FFD300]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="h-96 overflow-y-auto bg-white dark:bg-[#1D233D]">
                        {activeTab === "params" && (
                            <ParamsEditor
                                title="Query Params"
                                items={params}
                                onAdd={() => addPair(setParams)}
                                onUpdate={(id, field, val) => updatePair(setParams, id, field, val)}
                                onRemove={(id) => removePair(setParams, id)}
                            />
                        )}
                        {activeTab === "headers" && (
                            <ParamsEditor
                                title="Headers"
                                items={headers}
                                onAdd={() => addPair(setHeaders)}
                                onUpdate={(id, field, val) => updatePair(setHeaders, id, field, val)}
                                onRemove={(id) => removePair(setHeaders, id)}
                            />
                        )}
                                {activeTab === "body" && (
                                    <div className="h-full flex flex-col">
                                        <CodeMirror
                                            value={body}
                                            height="100%"
                                            theme={editorTheme}
                                            extensions={[javascript()]}
                                            onChange={(value) => setBody(value)}
                                            className="flex-1 text-sm bg-transparent"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Response */}
                        <div className="bg-white dark:bg-[#1a2040] mr-6 rounded-lg border-2 border-[#10162F] dark:border-gray-600 overflow-hidden shadow-lg">
                            {response ? (
                                <>
                                    <div className="border-b-2 border-[#10162F] dark:border-gray-600 p-3 bg-gradient-to-r from-white to-gray-50 dark:from-[#1a2040] dark:to-[#243055]">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`text-sm font-bold px-4 rounded-full border-2 ${response.status >= 200 && response.status < 300 ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600' :
                                                    response.status >= 400 ? 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600' : 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600'
                                                    }`}>
                                                    {response.status} {response.statusText}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                                                    <span className="font-mono font-medium text-blue-700 dark:text-blue-300">{response.time}ms</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                    <Database size={14} className="text-purple-600 dark:text-purple-400" />
                                                    <span className="font-mono font-medium text-purple-700 dark:text-purple-300">{(response.size / 1024).toFixed(2)} KB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-96 overflow-auto bg-gray-50 dark:bg-[#151b33]">
                                        <CodeMirror
                                            value={response.data || ""}
                                            height="100%"
                                            theme={editorTheme}
                                            extensions={[javascript()]}
                                            editable={false}
                                            className="h-full text-sm"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center text-[#10162F] dark:text-gray-400 p-8 text-center">
                                {isLoading ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-[#3A10E5] dark:border-[#FFD300] border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#3A10E5]/30 dark:border-b-[#FFD300]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-lg tracking-wide text-[#3A10E5] dark:text-[#FFD300]">SENDING REQUEST</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait...</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <ErrorDisplay error={error} onRetry={handleSend} />
                                ) : (
                                    <div className="flex flex-col items-center gap-6 opacity-60">
                                        <div className="w-24 h-24 bg-gradient-to-br from-[#FFF0E5] to-[#FFE4CC] dark:from-[#1D233D] dark:to-[#243055] border-2 border-[#10162F] dark:border-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Globe size={40} className="text-[#3A10E5] dark:text-[#FFD300]" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-lg mb-2">Ready to Send Request</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Configure your request and click Send</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ErrorDisplay({ error, onRetry }: { error: ErrorState; onRetry: () => void }) {
    const getErrorIcon = () => {
        switch (error.type) {
            case 'network':
                return <WifiOff size={24} className="text-red-500" />;
            case 'cors':
                return <Shield size={24} className="text-orange-500" />;
            case 'timeout':
                return <Clock size={24} className="text-yellow-500" />;
            case 'server':
                return <Server size={24} className="text-purple-500" />;
            case 'validation':
                return <AlertTriangle size={24} className="text-blue-500" />;
            default:
                return <AlertTriangle size={24} className="text-red-500" />;
        }
    };

    const getErrorColors = () => {
        switch (error.type) {
            case 'network':
                return {
                    border: 'border-red-400 dark:border-red-500',
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    text: 'text-red-700 dark:text-red-300',
                    accent: 'bg-red-500'
                };
            case 'cors':
                return {
                    border: 'border-orange-400 dark:border-orange-500',
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    text: 'text-orange-700 dark:text-orange-300',
                    accent: 'bg-orange-500'
                };
            case 'timeout':
                return {
                    border: 'border-yellow-400 dark:border-yellow-500',
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    text: 'text-yellow-700 dark:text-yellow-300',
                    accent: 'bg-yellow-500'
                };
            case 'server':
                return {
                    border: 'border-purple-400 dark:border-purple-500',
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    text: 'text-purple-700 dark:text-purple-300',
                    accent: 'bg-purple-500'
                };
            case 'validation':
                return {
                    border: 'border-blue-400 dark:border-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-700 dark:text-blue-300',
                    accent: 'bg-blue-500'
                };
            default:
                return {
                    border: 'border-red-400 dark:border-red-500',
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    text: 'text-red-700 dark:text-red-300',
                    accent: 'bg-red-500'
                };
        }
    };

    const colors = getErrorColors();

    return (
        <div className="max-w-lg mx-auto w-full">
            <div className={`border-2 ${colors.border} ${colors.bg} rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300`}>
                {/* Error Header */}
                <div className={`${colors.accent} p-4`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            {getErrorIcon()}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">{error.message}</h3>
                            <p className="text-white/80 text-sm capitalize">{error.type} Error</p>
                        </div>
                    </div>
                </div>

                {/* Error Content */}
                <div className="p-6 space-y-4">
                    {/* Error Details */}
                    <div className={`${colors.text}`}>
                        <p className="font-medium text-base leading-relaxed">{error.details}</p>
                    </div>

                    {/* Suggestion */}
                    {error.suggestion && (
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">💡</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggestion:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{error.suggestion}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={onRetry}
                            className="flex-1 bg-gradient-to-r from-[#3A10E5] to-[#5B21B6] hover:from-[#2D0BB8] hover:to-[#4C1D95] text-white px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                        <button
                            onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', '_blank')}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all"
                        >
                            <Wifi size={16} />
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Technical Details (Collapsible) */}
                <details className="border-t border-gray-200 dark:border-gray-600">
                    <summary className="px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        Technical Details
                    </summary>
                    <div className="px-6 pb-4">
                        <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm">
                            <div className="text-gray-400 mb-2">Error Type:</div>
                            <div className="text-red-400 mb-3">{error.type}</div>
                            <div className="text-gray-400 mb-2">Raw Message:</div>
                            <div className="text-gray-300 break-all">{error.details}</div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}

function ParamsEditor({
    title,
    items,
    onAdd,
    onUpdate,
    onRemove
}: {
    title: string,
    items: KeyValuePair[],
    onAdd: () => void,
    onUpdate: (id: string, field: "key" | "value", val: string) => void,
    onRemove: (id: string) => void
}) {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#10162F] dark:text-gray-200 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#3A10E5] dark:bg-[#FFD300] rounded-full"></div>
                    {title}
                </h3>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#3A10E5] to-[#5B21B6] dark:from-[#FFD300] dark:to-[#FFC700] text-white dark:text-[#10162F] rounded-lg hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all text-sm font-medium"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    Add {title.slice(0, -1)}
                </button>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 group items-start p-3 bg-gray-50 dark:bg-[#0f1419] rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#3A10E5] dark:hover:border-[#FFD300] transition-all">
                        <div className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                            <input
                                type="text"
                                placeholder="Key"
                                value={item.key}
                                onChange={(e) => onUpdate(item.id, "key", e.target.value)}
                                className="w-full sm:flex-1 bg-white dark:bg-[#1a2040] border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm font-mono text-[#10162F] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3A10E5] dark:focus:ring-[#FFD300] focus:border-transparent transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={item.value}
                                onChange={(e) => onUpdate(item.id, "value", e.target.value)}
                                className="w-full sm:flex-1 bg-white dark:bg-[#1a2040] border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm font-mono text-[#10162F] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3A10E5] dark:focus:ring-[#FFD300] focus:border-transparent transition-all"
                            />
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#0f1419]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Plus size={20} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No {title.toLowerCase()} added</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click &quot;Add {title.slice(0, -1)}&quot; to get started</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
