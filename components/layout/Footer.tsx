import React from 'react';

export function Footer() {
    return (
        <footer className="w-full py-8 bg-[#0A0E1F] border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-white">
                    <span className="mx-2 border-2 border-accent-yellow px-4 py-1 font-bold rounded-xl">2050 Developer Platform</span>
                </p>
                <div className="flex gap-8 text-sm font-bold text-white">
                    <a href="/privacy" className="hover:text-accent-yellow">Privacy Policy</a>
                    <a href="#" className="hover:text-accent-yellow">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
