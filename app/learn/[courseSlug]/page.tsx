
// This page acts as the default view when hitting /learn/[courseSlug]
// We can redirect to the first lesson or show a course summary.

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ courseSlug: string }>;
}

async function getCourse(slug: string) {
    const query = `*[_type == "course" && slug.current == $slug][0]{
      title,
      description,
      image,
      modules[]{
        lessons[]->{
          slug
        }
      }
    }`;
    return client.fetch(query, { slug });
}

export default async function CourseOverviewPage({ params }: PageProps) {
    const { courseSlug } = await params;
    const course = await getCourse(courseSlug);

    if (!course) return <div>Course not found</div>;

    // Optional: Redirect to first lesson automatically
    // const firstLesson = course.modules?.[0]?.lessons?.[0];
    // if (firstLesson) {
    //     redirect(`/learn/${params.courseSlug}/${firstLesson.slug.current}`);
    // }

    return (
        <div className="space-y-8">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                {course.image && (
                    <Image
                        src={urlFor(course.image).url()}
                        alt={course.title}
                        fill
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center shadow-sm">{course.title}</h1>
                </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">{course.description}</p>
            </div>

            <div className="flex justify-center pt-8">
                {(() => {
                    const firstLesson = course.modules?.[0]?.lessons?.[0];
                    if (firstLesson) {
                        return (
                            <Link
                                href={`/learn/${courseSlug}/${firstLesson.slug.current}`}
                                className="px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg"
                            >
                                Start Learning Now
                            </Link>
                        )
                    }
                    return <p className="text-gray-500">Coming soon - no lessons yet.</p>
                })()}
            </div>
        </div>
    );
}
