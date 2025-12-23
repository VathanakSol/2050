'use client';

import { UserCount } from '@/components/UserCount';
import { Globe } from '@/components/ui/Globe';

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent-yellow/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <UserCount />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Join with our <span className="text-accent-yellow">Community</span>
                    </h1>
                    <p className="text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed">
                        Join a global network of forward-thinking developers building the future of the web.
                    </p>
                </div>

                {/* Globe Section */}
                <div className="relative flex justify-center items-center mt-16 mb-16">
                    <div className="relative w-full max-w-[600px] h-[600px]">
                        <Globe className="opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-accent-yellow dark:text-white/90">
                                    2050
                                </h2>
                                <p className="text-sm md:text-base text-black dark:text-white/70">
                                    Future Dev Platform
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
