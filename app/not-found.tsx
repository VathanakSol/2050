import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black">

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-2xl">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <h1 className="text-[150px] sm:text-[200px] font-black text-white leading-none tracking-tight">
                            404
                        </h1>
                        <div className="h-2 w-32 bg-accent-yellow mx-auto -mt-8"></div>
                    </div>

                    {/* Error Message */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="px-8 py-3 text-base font-bold bg-white text-[#10162F] hover:bg-accent-yellow transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#FFD300] hover:translate-x-0.5 hover:translate-y-0.5"
                        >
                            ← Back to Home
                        </Link>
                    </div>

                    {/* Suggested Links */}
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Popular Searches</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['React', 'Next.js', 'Docker', 'TypeScript', 'Prisma'].map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/?q=${encodeURIComponent(tag)}`}
                                    className="px-4 py-2 text-sm font-bold bg-[#1F2937] text-white border border-gray-700 hover:bg-white hover:text-[#10162F] hover:border-white transition-all duration-200"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 bg-[#0A0E1F] border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} NakTech Search.
                    </p>
                    <div className="flex gap-8 text-sm font-bold text-white">
                        <a href="#" className="hover:text-accent-yellow">Privacy Policy</a>
                        <a href="#" className="hover:text-accent-yellow">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
