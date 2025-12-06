
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseSlug: string }>;
}

async function getCourse(slug: string) {
    const query = `*[_type == "course" && slug.current == $slug][0]{
    title,
    slug,
    modules[]{
      _id,
      title,
      lessons[]->{
        _id,
        title,
        slug
      }
    }
  }`;
    return client.fetch(query, { slug });
}

export default async function CourseLayout({ children, params }: LayoutProps) {
    const { courseSlug } = await params;
    const course = await getCourse(courseSlug);

    if (!course) {
        return notFound();
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-950">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/learn" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
                        ← Back to Courses
                    </Link>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                </div>
                <nav className="p-4">
                    {course.modules?.filter((m: any) => m).map((module: any, idx: number) => (
                        <div key={module._id || idx} className="mb-6">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 ml-2">
                                {module.title}
                            </h3>
                            <ul className="space-y-1">
                                {module.lessons?.filter((l: any) => l).map((lesson: any) => (
                                    <li key={lesson._id}>
                                        {/* Check active state in the Lesson Page component or using client component for nav if needed.
                         For now, simple links.
                      */}
                                        <Link
                                            href={`/learn/${courseSlug}/${lesson.slug.current}`}
                                            className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                        >
                                            {lesson.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <div className="max-w-4xl mx-auto px-4 py-8 lg:px-12 lg:py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
