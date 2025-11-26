"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
            icon: "🎨",
            title: "Image Gallery",
            description: "Free stock photos powered by cloud storage. Upload and share your images with the community.",
            color: "accent-yellow",
        },
        {
            icon: "💬",
            title: "AI Chat Assistant",
            description: "Intelligent chat interface with AI-powered responses. Get help with coding and technical questions.",
            color: "accent-mint",
        },
        {
            icon: "🔍",
            title: "Smart Search",
            description: "Real-time search engine designed for developers. Find resources, documentation, and code snippets instantly.",
            color: "accent-blue",
        },
        {
            icon: "🚀",
            title: "Modern Architecture",
            description: "Built with Next.js 16, React 19, and cutting-edge web technologies for optimal performance.",
            color: "accent-yellow",
        },
    ];

    const techStack = [
        { name: "Next.js 16", category: "Framework" },
        { name: "React 19", category: "Library" },
        { name: "TypeScript", category: "Language" },
        { name: "Tailwind CSS", category: "Styling" },
        { name: "Prisma", category: "Database" },
        { name: "AWS S3", category: "Storage" },
        { name: "Google AI", category: "AI" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b-4 border-accent-yellow">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#3B00B9 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 relative z-10">
                    <div className="text-center space-y-4">
                        {/* Badge */}
                        <div className="inline-block">
                            <span className="bg-accent-mint/20 text-accent-mint px-4 py-2 rounded-full text-sm font-bold border-2 border-accent-mint/50 uppercase tracking-wider">
                                About NakTech Platform
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Building the{" "}
                            <span className="text-accent-yellow">
                                Future
                            </span>
                            <br />
                            of Developer Tools
                        </h1>

                        {/* Subheading */}
                        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            An <span className="text-accent-yellow font-bold">open-source platform</span> designed to empower developers
                            with intelligent tools, seamless workflows, and modern architecture.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 justify-center pt-4">
                            <Link
                                href="/upload"
                                className="bg-[#FFD300] text-[#10162F] px-6 py-3 text-sm font-black uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none transition-all"
                            >
                                Explore Gallery
                            </Link>
                            <Link
                                href="/chat"
                                className="bg-card-bg text-accent-mint px-6 py-3 text-sm font-black uppercase tracking-wider border-2 border-accent-mint shadow-[3px_3px_0px_0px_#00FFF0] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none transition-all"
                            >
                                Try AI Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-10 md:py-12 border-b-2 border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="inline-block">
                                <h2 className="text-2xl md:text-3xl font-black text-accent-yellow mb-2">
                                    Our Mission
                                </h2>
                                <div className="h-1 w-24 bg-accent-yellow rounded-full"></div>
                            </div>
                            <p className="text-base text-gray-300 leading-relaxed">
                                We believe in democratizing access to powerful developer tools. Our platform
                                combines cutting-edge AI technology with intuitive design to create an
                                ecosystem where developers can learn, build, and share.
                            </p>
                            <p className="text-base text-gray-300 leading-relaxed">
                                From image hosting to intelligent chat assistants, every feature is crafted
                                with <span className="text-accent-mint font-bold">developers in mind</span>,
                                ensuring a seamless and productive experience.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="bg-card-bg p-6 rounded-xl border-2 border-accent-blue/50 shadow-xl hover:shadow-accent-blue/20 transition-all duration-300">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">🎯</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Developer-First</h3>
                                            <p className="text-gray-400 text-sm">Built by devs, for devs</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-mint/20 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">⚡</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
                                            <p className="text-gray-400 text-sm">Optimized performance</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">🔓</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Open Source</h3>
                                            <p className="text-gray-400 text-sm">Community-driven development</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-10 md:py-12 border-b-2 border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black mb-3">
                            Platform{" "}
                            <span className="text-accent-yellow">
                                Features
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-xl mx-auto">
                            Discover the powerful tools and features that make NakTech the go-to platform for modern developers.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredFeature(index)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={`
                                    bg-card-bg p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                                    ${hoveredFeature === index
                                        ? `border-${feature.color} shadow-xl`
                                        : "border-gray-700 hover:border-gray-600"
                                    }
                                `}
                            >
                                <div className="space-y-3">
                                    <div className={`
                                        w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                                        transition-all duration-300
                                        ${hoveredFeature === index ? `bg-${feature.color}/20` : "bg-gray-700/50"}
                                    `}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-10 md:py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black mb-3">
                            Built with{" "}
                            <span className="text-accent-yellow">Modern Tech</span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-xl mx-auto">
                            Powered by industry-leading technologies to deliver exceptional performance and developer experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {techStack.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-card-bg border-2 border-gray-700 hover:border-accent-mint rounded-lg p-3 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-mint/20"
                            >
                                <div className="text-accent-yellow font-black text-sm mb-1">
                                    {tech.name}
                                </div>
                                <div className="text-gray-500 text-xs uppercase tracking-wider">
                                    {tech.category}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: "100%", label: "Open Source" },
                            { value: "24/7", label: "Availability" },
                            { value: "∞", label: "Possibilities" },
                            { value: "v0.1", label: "Version" },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-card-bg to-background border-2 border-accent-blue/30 rounded-xl p-4 text-center hover:border-accent-blue transition-all duration-300"
                            >
                                <div className="text-3xl md:text-4xl font-black text-accent-yellow mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 font-semibold uppercase tracking-wider text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-10 md:py-12 bg-gradient-to-r from-card-bg via-background to-card-bg border-t-4 border-accent-yellow">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-black">
                            Ready to{" "}
                            <span className="text-accent-yellow">
                                Get Started?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base max-w-xl mx-auto">
                            Join the community and start exploring powerful developer tools designed for the modern web.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center pt-3">
                            <Link
                                href="/"
                                className="bg-[#FFD300] text-[#10162F] px-6 py-3 text-sm font-black uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none transition-all inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
