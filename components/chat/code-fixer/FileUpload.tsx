'use client';

import React, { useRef, useState, DragEvent } from 'react';
import { detectLanguageFromExtension } from '@/lib/languageDetector';

interface FileUploadProps {
    onFileSelect: (file: { name: string; content: string; language: string }) => void;
    onClear: () => void;
    currentFile?: { name: string; content: string; language: string } | null;
}

const ALLOWED_EXTENSIONS = [
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'hpp', 'cs',
    'go', 'rs', 'php', 'rb', 'swift', 'kt', 'html', 'css', 'scss', 'json',
    'xml', 'yaml', 'yml', 'sql', 'sh', 'bash', 'md'
];

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function FileUpload({ onFileSelect, onClear, currentFile }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 1MB';
        }

        // Check file extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
            return `File type .${ext} is not supported. Supported types: ${ALLOWED_EXTENSIONS.join(', ')}`;
        }

        return null;
    };

    const handleFile = async (file: File) => {
        setError('');

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const content = await file.text();
            const langInfo = detectLanguageFromExtension(file.name);

            onFileSelect({
                name: file.name,
                content,
                language: langInfo?.id || 'text'
            });
        } catch (err) {
            setError('Failed to read file');
            console.error('File read error:', err);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    if (currentFile) {
        return (
            <div className="flex items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">📎</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">
                            {currentFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {(currentFile.content.length / 1024).toFixed(1)} KB • {currentFile.language}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClear}
                    className="px-2 py-1 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all"
                    title="Remove file"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging
                        ? 'border-accent-yellow bg-accent-yellow/10 scale-105'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <div>
                        <p className="text-sm font-bold text-gray-300">
                            {isDragging ? 'Drop file here' : 'Drop code file or click to browse'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Max 1MB • Supported: {ALLOWED_EXTENSIONS.slice(0, 8).join(', ')}, ...
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-500 rounded text-xs text-red-400">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
