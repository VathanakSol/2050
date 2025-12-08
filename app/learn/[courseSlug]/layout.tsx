
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import CourseSidebar from "@/components/layout/CourseSidebar";

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

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseSlug: string }>;
}

async function getCourse(slug: string): Promise<Course | null> {
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
    return client.fetch<Course | null>(query, { slug });
}

export default async function CourseLayout({ children, params }: LayoutProps) {
    const { courseSlug } = await params;
    const course = await getCourse(courseSlug);

    if (!course) {
        return notFound();
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-950">
            <CourseSidebar course={course} courseSlug={courseSlug} />
            
            {/* Main Content Area */}
            <main className="flex-1 container mx-auto min-w-0">
                <div className="py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
