"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface CodeEditorProps {
    language: 'html' | 'css' | 'javascript';
    code: string;
    onChange: (value: string) => void;
    className?: string;
    fontSize?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    language,
    code,
    onChange,
    className,
    fontSize = 14,
}) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getExtensions = () => {
        switch (language) {
            case 'html':
                return [html()];
            case 'css':
                return [css()];
            case 'javascript':
                return [javascript({ jsx: true })];
            default:
                return [];
        }
    };

    return (
        <div className={`h-full w-full overflow-hidden ${className}`}>
            {mounted && (
                <CodeMirror
                    value={code}
                    height="100%"
                    theme={theme === 'light' ? 'light' : vscodeDark}
                    extensions={getExtensions()}
                    onChange={(value) => onChange(value)}
                    className="h-full"
                    style={{ fontSize: `${fontSize}px` }}
                    basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLine: true,
                    }}
                />
            )}
        </div>
    );
};
