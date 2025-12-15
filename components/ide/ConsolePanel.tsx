"use client";

import React, { useEffect, useRef } from 'react';
import { Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface LogEntry {
    type: 'log' | 'error' | 'warn';
    message: string[];
    timestamp: string;
}

interface ConsolePanelProps {
    logs: LogEntry[];
    onClear: () => void;
}

interface GroupedLog extends LogEntry {
    count: number;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs, onClear }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Group consecutive identical logs (but only if they have the same timestamp to prevent grouping across executions)
    const groupedLogs = React.useMemo(() => {
        const groups: GroupedLog[] = [];
        logs.forEach((log) => {
            const lastGroup = groups[groups.length - 1];
            const isIdentical = lastGroup &&
                lastGroup.type === log.type &&
                lastGroup.timestamp === log.timestamp &&
                JSON.stringify(lastGroup.message) === JSON.stringify(log.message);

            if (isIdentical) {
                lastGroup.count += 1;
            } else {
                groups.push({ ...log, count: 1 });
            }
        });
        return groups;
    }, [logs]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [groupedLogs]); // Scroll when GROUPS change

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1e1e1e] text-gray-800 dark:text-[#d4d4d4] font-mono text-[13px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-200 dark:bg-[#252526] border-b border-gray-300 dark:border-[#333]">
                <span className="font-semibold text-xs text-gray-600 dark:text-[#858585] tracking-wide select-none">CONSOLE</span>
                <button
                    onClick={onClear}
                    className="p-1 hover:bg-gray-300 dark:hover:bg-[#333] rounded transition-colors text-gray-600 dark:text-[#858585] hover:text-gray-800 dark:hover:text-[#d4d4d4]"
                    title="Clear Console"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {groupedLogs.length === 0 && (
                    <div className="p-4 text-gray-500 dark:text-[#666] italic text-center text-xs select-none">
                        Console is empty
                    </div>
                )}
                <div className="flex flex-col">
                    {groupedLogs.map((log, index) => (
                        <div
                            key={`${log.timestamp}-${log.type}-${index}`}
                            className={`flex items-start gap-2 px-3 py-1 border-b group ${log.type === 'error'
                                ? 'bg-red-50 dark:bg-[#291415] text-red-600 dark:text-[#f48771] border-red-200 dark:border-[#5c2c2e]'
                                : log.type === 'warn'
                                    ? 'bg-yellow-50 dark:bg-[#332b00] text-yellow-700 dark:text-[#cca700] border-yellow-200 dark:border-[#665500]'
                                    : 'hover:bg-gray-100 dark:hover:bg-[#2a2d2e] border-gray-200 dark:border-[#2a2a2a]'
                                }`}
                        >
                            {/* Icon Column */}
                            <span className="mt-0.5 flex-shrink-0 opacity-80">
                                {log.type === 'error' && <AlertCircle size={13} fill="currentColor" className="text-red-600 dark:text-[#f48771]" strokeWidth={1} />}
                                {log.type === 'warn' && <AlertTriangle size={13} fill="currentColor" className="text-yellow-700 dark:text-[#cca700]" strokeWidth={1} />}
                                {log.type === 'log' && <div className="w-[13px]" />} {/* Spacer for alignment */}
                            </span>

                            {/* Content Column */}
                            <div className="flex-1 break-words whitespace-pre-wrap leading-relaxed flex items-start gap-2">
                                <span className="flex-1">
                                    {log.message.map((part, i) => (
                                        <span key={i} className={typeof part === 'string' ? '' : 'text-blue-400 dark:text-[#9cdcfe]'}>
                                            {part}
                                            {i < log.message.length - 1 ? ' ' : ''}
                                        </span>
                                    ))}
                                </span>

                                {/* Count Badge */}
                                {log.count > 1 && (
                                    <span className="flex-shrink-0 bg-gray-300 dark:bg-[#333] text-gray-800 dark:text-[#d4d4d4] text-[10px] font-bold px-1.5 rounded-full border border-gray-400 dark:border-[#444] select-none shadow-sm">
                                        {log.count}
                                    </span>
                                )}
                            </div>

                            {/* Timestamp */}
                            <span className="text-[10px] text-gray-500 dark:text-[#666] flex-shrink-0 select-none opacity-0 group-hover:opacity-100 transition-opacity ml-2 pt-0.5">
                                {log.timestamp}
                            </span>
                        </div>
                    ))}
                </div>
                <div ref={bottomRef} className="pb-2" />
            </div>
        </div>
    );
};
