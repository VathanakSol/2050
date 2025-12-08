"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { LayoutGrid, List } from "lucide-react";

interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    image: any;
    modules: any[];
}

interface CourseListProps {
    courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-accent-yellow dark:text-white">Learning Content</h1>
                <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${viewMode === "grid"
                            ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all ${viewMode === "list"
                            ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                        aria-label="List view"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div
                className={`grid gap-4 ${viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                    }`}
            >
                {courses.map((course) => {
                    const firstModule = course.modules?.[0];
                    const firstLesson = firstModule?.lessons?.[0];
                    const linkHref = firstLesson
                        ? `/learn/${course.slug.current}/${firstLesson.slug.current}`
                        : `/learn/${course.slug.current}`;

                    return (
                        <Link href={linkHref} key={course._id} className="group h-full block">
                            <div
                                className={`bg-white dark:bg-zinc-900 border-2 border-black hover:border-accent-yellow dark:border-white shadow-[6px_6px_0px_0px_#FFD300] dark:shadow-[6px_6px_0px_0px_#FFD300] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#FFD300] dark:hover:shadow-[4px_4px_0px_0px_#FFD300] transition-all duration-200 h-full flex ${viewMode === "list" ? "flex-row" : "flex-col"
                                    }`}
                            >
                                <div
                                    className={`relative border-b-2 border-black dark:border-white ${viewMode === "list" ? "w-48 shrink-0 border-r-2 border-b-0" : "h-40 w-full"
                                        }`}
                                >
                                    {course.image ? (
                                        <Image
                                            src={urlFor(course.image).url()}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-mono text-sm">
                                            NO IMAGE
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                                Course
                                            </span>
                                            <span className="inline-block bg-[#FFD300] text-black border border-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                                Free
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2 text-blue-600 dark:text-blue-400 leading-tight group-hover:underline decoration-2">
                                            {course.title}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 font-medium leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
