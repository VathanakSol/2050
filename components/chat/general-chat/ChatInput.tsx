'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from '../code-fixer/FileUpload';
import { Paperclip } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string, file?: { name: string; content: string; language: string }) => void;
    disabled?: boolean;
    showFileUpload?: boolean;
}

export function ChatInput({ onSend, disabled, showFileUpload = false }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [showUploader, setShowUploader] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; language: string } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input, uploadedFile || undefined);
            setInput('');
            setUploadedFile(null);
            setShowUploader(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {/* File Upload Section */}
            {showFileUpload && showUploader && (
                <div className="mb-2">
                    <FileUpload
                        onFileSelect={(file) => {
                            setUploadedFile(file);
                            setShowUploader(false);
                        }}
                        onClear={() => {
                            setUploadedFile(null);
                            setShowUploader(false);
                        }}
                        currentFile={uploadedFile}
                    />
                </div>
            )}

            {/* Uploaded File Display */}
            {uploadedFile && !showUploader && (
                <div className="mb-2">
                    <FileUpload
                        onFileSelect={() => { }}
                        onClear={() => setUploadedFile(null)}
                        currentFile={uploadedFile}
                    />
                </div>
            )}

            <div className="relative">
                <div className="relative flex items-end gap-2 bg-background border-2 border-foreground p-2 shadow-[4px_4px_0px_0px_var(--color-card-bg)]">
                    {showFileUpload && (
                        <button
                            type="button"
                            onClick={() => setShowUploader(!showUploader)}
                            className={`p-2 transition-colors ${showUploader || uploadedFile
                                    ? 'bg-accent-yellow text-foreground'
                                    : 'bg-card-bg text-foreground/70 hover:bg-foreground/10'
                                }`}
                            title="Attach file"
                        >
                            <Paperclip size={20} />
                        </button>
                    )}

                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={uploadedFile ? "Describe what you want to fix..." : "Ask something about code..."}
                        disabled={disabled}
                        className="w-full bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[200px] py-2 px-2 text-foreground placeholder-foreground/50 font-mono text-sm"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={disabled || !input.trim()}
                        className="p-2 bg-card-bg text-foreground hover:bg-accent-yellow hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    );
}
