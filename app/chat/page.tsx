'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black dark:selection:text-foreground">
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
                    <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-4 tracking-tight">
                                <span className="text-accent-yellow">DEVELOPER CHAT</span>
                            </h1>
                            <p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Ask questions, fix or debug code, and brainstorm ideas.
                            </p>
                        </div>

                        <ChatWindow />
                    </div>
                </main>
            </div>
        </>
    )
}

function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(var(--color-accent-blue) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>

            <div className="max-w-3xl text-center space-y-4 relative z-10">
                
                {/* Main Heading */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-foreground">
                    COMING <br />
                    <span className="text-accent-yellow">SOON</span>
                </h1>

                {/* CTA Button */}
                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-accent-yellow text-black dark:text-foreground font-black text-lg uppercase tracking-widest hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px] shadow-foreground transition-all border-2 border-foreground"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
} 
