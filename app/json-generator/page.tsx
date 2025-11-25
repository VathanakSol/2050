'use client';

import { useState, useEffect } from 'react';
import { generateRequestBody } from '../actions/json-generator';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Link from 'next/link';
import { BetaToggle } from '@/components/BetaToggle';
import { getFeatureFlag } from '@/lib/featureFlags';

export default function JsonGenerator() {
    const [isEnabledUI, setIsEnabledUI] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsEnabledUI(getFeatureFlag('features_enabled'));
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <BetaToggle />
            {isEnabledUI ? <JsonGeneratorFeature /> : <ComingSoon />}
        </>
    );
}

function JsonGeneratorFeature() {
    const [body, setBody] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingBody, setGeneratingBody] = useState(false);

    const handleGenerateBody = async () => {
        if (!aiPrompt) return;
        setGeneratingBody(true);
        try {
            const generated = await generateRequestBody(aiPrompt);
            setBody(generated);
        } catch (e) {
            alert('Failed to generate body');
        } finally {
            setGeneratingBody(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#10162F] text-white font-sans selection:bg-[#FFD300] selection:text-black p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center space-y-4">
                    <div className="inline-block bg-[#FFD300] text-[#10162F] px-4 py-1 font-black text-sm uppercase tracking-widest transform -rotate-2 border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF]">
                        AI Powered
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                        JSON <span className="text-accent-yellow">GENERATOR</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Describe your data structure in plain English, and let our AI construct the perfect JSON for you.
                    </p>
                </header>

                <div className="bg-[#1F2937] p-6 md:p-8 border-2 border-white shadow-[8px_8px_0px_0px_#00FFF0] relative">
                    {/* Decorative corner squares */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#FFD300] border-2 border-white"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFD300] border-2 border-white"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FFD300] border-2 border-white"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#FFD300] border-2 border-white"></div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-[#00FFF0] uppercase tracking-wider mb-3">
                            Describe Data Structure
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="E.g. 'A list of 5 users with names, emails, and random roles'"
                                className="flex-1 bg-[#10162F] text-white p-4 border-2 border-gray-600 focus:border-[#FFD300] outline-none transition-colors font-mono text-sm placeholder-gray-600"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateBody()}
                            />
                            <button
                                onClick={handleGenerateBody}
                                disabled={generatingBody || !aiPrompt}
                                className="bg-[#FFD300] text-[#10162F] px-8 py-4 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                            >
                                {generatingBody ? 'Processing...' : 'Generate JSON'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="block text-sm font-bold text-[#00FFF0] uppercase tracking-wider">
                                Output
                            </label>
                            {body && (
                                <button
                                    onClick={() => { navigator.clipboard.writeText(body) }}
                                    className="text-xs font-mono text-gray-400 hover:text-white underline decoration-dashed"
                                >
                                    Copy to Clipboard
                                </button>
                            )}
                        </div>
                        <div className="relative group border-2 border-gray-600 focus-within:border-[#FFD300] transition-colors bg-[#10162F] h-[500px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00FFF0] to-[#3B00B9] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                            {body ? (
                                <SyntaxHighlighter
                                    language="json"
                                    style={atomOneDark}
                                    customStyle={{
                                        background: 'transparent',
                                        padding: '1.5rem',
                                        height: '100%',
                                        margin: 0,
                                        fontSize: '0.875rem',
                                        lineHeight: '1.6',
                                    }}
                                    wrapLongLines={true}
                                >
                                    {body}
                                </SyntaxHighlighter>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 font-mono text-sm p-6">
                                    Your generated JSON will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">
                        NakTech Systems - v1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}

function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#3B00B9 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>

            <div className="max-w-3xl text-center space-y-4 relative z-10">
                {/* Icon */}
                <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1F2937] mx-auto -rotate-6 border-4 border-accent-mint shadow-[8px_8px_0px_0px_#FFD300] flex items-center justify-center transition-transform hover:rotate-0 duration-300">
                        <span className="text-4xl md:text-5xl">🚀</span>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
                    SOMETHING <br />
                    <span className="text-accent-yellow drop-shadow-sm">EPIC</span> IS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-mint to-accent-blue">BREWING</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
                    Our <span className="text-accent-mint font-bold">JSON Generator</span> is getting a major upgrade.
                    Stay tuned for a smarter, faster coding experience.
                </p>

                {/* CTA Button */}
                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-accent-yellow text-[#10162F] font-black text-lg uppercase tracking-widest hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#FFFFFF] transition-all border-2 border-white"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>


        </div>
    )
} 
