'use client';

import { useState, useEffect } from 'react';
import { getPopularCourses } from '@/app/actions/ai-search';

interface Course {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    students: string;
    category: string;
    icon: string;
}

function CourseSkeleton() {
    return (
        <div className="w-full flex-shrink-0 px-2">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#10162F] p-4 md:p-5 rounded-xl border-2 border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 animate-pulse">
                    {/* Icon Skeleton */}
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gray-700 rounded-xl"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-grow space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-grow">
                                <div className="h-2.5 bg-gray-700 rounded w-20"></div>
                                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                            </div>
                            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="h-3 bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                        </div>

                        <div className="flex gap-3">
                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                            <div className="h-3 bg-gray-700 rounded w-20"></div>
                        </div>

                        <div className="h-9 bg-gray-700 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PopularCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const data = await getPopularCourses();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    useEffect(() => {
        if (!loading && courses.length > 0) {
            // Auto-scroll every 4 seconds
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % courses.length);
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [loading, courses.length]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner':
                return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'Intermediate':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'Advanced':
                return 'text-red-400 bg-red-400/10 border-red-400/30';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-[#0a0e1f] via-[#10162F] to-[#0a0e1f] border-b-2 border-accent-yellow/30 py-8 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, #FFD300 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animation: 'float 20s linear infinite'
                }}></div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 211, 0, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(255, 211, 0, 0.6); }
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-6">

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                        Follow Up Latest <span className="text-accent-yellow">Technologies</span>
                    </h2>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                        {loading
                            ? 'AI is curating the best courses for you...'
                            : 'Discover trending courses powered by AI recommendations. Start your learning journey today.'
                        }
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    <div className="overflow-hidden">
                        {loading ? (
                            <CourseSkeleton />
                        ) : (
                            <div
                                className="flex transition-transform duration-700 ease-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {courses.map((course) => (
                                    <div key={course.id} className="w-full flex-shrink-0 px-2">
                                        <div className="bg-[#1a1f3a] p-4 md:p-5 rounded-xl border-2 border-gray-700 hover:border-accent-yellow transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,211,0,0.2)] group">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {/* Icon Section */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 bg-accent-yellow/10 rounded-xl flex items-center justify-center text-3xl border-2 border-accent-yellow/30 group-hover:scale-110 transition-transform duration-300">
                                                        {course.icon}
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className="flex-grow">
                                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                                                        <div>
                                                            <span className="text-accent-yellow text-xs font-bold uppercase tracking-wider mb-1.5 block">
                                                                {course.category}
                                                            </span>
                                                            <h3 className="text-xl font-black text-white group-hover:text-accent-yellow transition-colors">
                                                                {course.title}
                                                            </h3>
                                                        </div>

                                                    </div>

                                                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                                                        {course.description}
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows - Only show when not loading */}
                    {!loading && courses.length > 0 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1))}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-accent-yellow transition-all z-10 hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev + 1) % courses.length)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-accent-yellow transition-all z-10 hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Indicators */}
                            <div className="flex justify-center gap-2 mt-5">
                                {courses.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`transition-all duration-300 rounded-full ${currentIndex === index
                                            ? 'w-8 h-2 bg-accent-yellow'
                                            : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                                            }`}
                                        aria-label={`Go to course ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
