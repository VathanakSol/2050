'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { ChatWindow } from '@/components/chat/general-chat/ChatWindow';
import { getFeatureFlag } from '@/lib/featureFlags';

export default function ChatPage() {
    const [isEnabledUI, setIsEnabledUI] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsEnabledUI(getFeatureFlag('features_enabled'));
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <>
            {isEnabledUI ? <ChatFeature /> : <ComingSoon />}
        </>
    );
}

function ChatFeature() {
    return (
        <>
            < div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black" >

                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
                    <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl sm:text-5xl font-black text-[#10162F] mb-4 tracking-tight">
                                <span className="text-accent-yellow">Developer Chat</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Your AI pair programmer. Ask questions, debug code, and brainstorm ideas.
                            </p>
                        </div>

                        <ChatWindow />
                    </div>
                </main>

                <Footer />
            </div >
        </>
    )
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
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
                    SOMETHING <br />
                    <span className="text-accent-yellow drop-shadow-sm">EPIC</span> IS <br />
                    <span className="text-accent-yellow">BREWING</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
                    Our <span className="text-accent-mint font-bold">AI Chat</span> is getting a major upgrade.
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
