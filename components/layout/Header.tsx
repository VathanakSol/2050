'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Resources', href: '/resources' },
        { name: 'AI Chat', href: '/chat' },
        { name: 'JSON Generator', href: '/json-generator' },
        { name: 'Upload', href: '/upload' },
        { name: 'About', href: '/about' },
    ];

    return (
        <header className="w-full py-5 px-4 sm:px-6 lg:px-8 bg-[#10162F] border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-[#10162F] flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_#FFD300]">
                        N
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
                            NakTech
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-black bg-[#FFD300] text-[#10162F] transform -rotate-6 border border-white shadow-[2px_2px_0px_0px_#FFFFFF]">
                            v1.0.1
                        </span>
                    </div>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-sans font-bold text-white">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`transition-colors ${pathname === item.href
                                ? 'text-accent-yellow'
                                : 'hover:text-accent-yellow'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
