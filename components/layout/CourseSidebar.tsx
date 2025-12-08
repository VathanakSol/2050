"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Lesson {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
}

interface Module {
    _id: string;
    title: string;
    lessons?: Lesson[];
}

interface Course {
    title: string;
    slug: {
        current: string;
    };
    modules?: Module[];
}

interface CourseSidebarProps {
    course: Course;
    courseSlug: string;
}

export default function CourseSidebar({ course, courseSlug }: CourseSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-full lg:w-72 border-r border-gray-200 dark:border-[#10162F] bg-white dark:bg-[#0a0d1f] shrink-0 h-screen sticky top-0 overflow-y-auto shadow-sm">
            <div className="p-5 border-b border-gray-200 dark:border-[#10162F]/50">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mt-2">{course.title}</h2>
            </div>
            <nav className="p-3">
                {course.modules?.filter((m): m is Module => !!m).map((module, idx) => (
                    <div key={module._id || idx} className="mb-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 px-2">
                            {module.title}
                        </h3>
                        <ul className="space-y-0.5">
                            {module.lessons?.filter((l): l is Lesson => !!l).map((lesson) => {
                                const lessonPath = `/learn/${courseSlug}/${lesson.slug.current}`;
                                const isActive = pathname === lessonPath;
                                
                                return (
                                    <li key={lesson._id}>
                                        <Link
                                            href={lessonPath}
                                            className={`group block px-3 py-2 text-sm font-medium transition-all duration-200 border-l-3 rounded-r ${
                                                isActive
                                                    ? "bg-[#FFD300]/20 dark:bg-[#FFD300]/20 text-gray-900 dark:text-white border-[#FFD300] shadow-sm font-semibold"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-[#FFD300]/10 dark:hover:bg-[#FFD300]/10 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-[#FFD300] hover:shadow-sm"
                                            }`}
                                        >
                                            <span className="line-clamp-2">{lesson.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
