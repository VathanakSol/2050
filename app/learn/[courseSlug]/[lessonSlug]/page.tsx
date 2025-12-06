
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        courseSlug: string;
        lessonSlug: string;
    }>;
}

async function getLesson(slug: string) {
    const query = `*[_type == "lesson" && slug.current == $slug][0]{
    title,
    content,
    videoUrl,
    summary
  }`;
    return client.fetch(query, { slug });
}

async function getCourseModules(courseSlug: string) {
    const query = `*[_type == "course" && slug.current == $courseSlug][0]{
        modules[]{
            lessons[]->{
                title,
                slug
            }
        }
    }`;
    return client.fetch(query, { courseSlug });
}


const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <div className="my-8 relative h-96 w-full rounded-lg overflow-hidden">
                    <Image
                        src={urlFor(value).url()}
                        alt={value.alt || 'Lesson Image'}
                        fill
                        className="object-contain"
                    />
                </div>
            );
        },
        code: ({ value }: any) => {
            return (
                <div className="my-6 rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] text-gray-100 shadow-md">
                    {value.filename && (
                        <div className="px-4 py-2 bg-[#2d2d2d] border-b border-gray-700 text-xs font-mono text-gray-400">
                            {value.filename}
                        </div>
                    )}
                    <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                        <code>{value.code}</code>
                    </pre>
                </div>
            )
        }
    },
    block: {
        h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
        normal: ({ children }: any) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
        blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 italic">{children}</blockquote>
    }
};

export default async function LessonPage({ params }: PageProps) {
    const { courseSlug, lessonSlug } = await params;
    const lesson = await getLesson(lessonSlug);
    const course = await getCourseModules(courseSlug);

    if (!lesson) return <div>Lesson not found</div>;

    // Flatten lessons to find prev/next
    const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || [];
    const currentIndex = allLessons.findIndex((l: any) => l.slug.current === lessonSlug);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return (
        <article className="max-w-none">
            <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                    {lesson.title}
                </h1>
                {lesson.summary && (
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                        {lesson.summary}
                    </p>
                )}
            </header>

            {lesson.videoUrl && (
                <div className="mb-8 aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-black">
                    {/* Simple iframe for standard providers, or verify provider first. 
                   Assuming YouTube/Vimeo generic embed for demonstration or would need a proper player component.
                   For now, treating as a direct link or we could check if it's embeddable.
               */}
                    <iframe
                        src={lesson.videoUrl.replace("watch?v=", "embed/")}
                        className="w-full h-full"
                        allowFullScreen
                        title={lesson.title}
                    />
                </div>
            )}

            <div className="prose dark:prose-invert max-w-none dark:prose-pre:bg-[#1e1e1e]">
                <PortableText value={lesson.content} components={ptComponents} />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm font-medium">
                {prevLesson ? (
                    <Link href={`/learn/${courseSlug}/${prevLesson.slug.current}`} className="group flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                        <span className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">←</span>
                        <div className="text-left">
                            <span className="block text-xs uppercase tracking-wider text-gray-400">Previous</span>
                            <span className="block text-lg">{prevLesson.title}</span>
                        </div>
                    </Link>
                ) : <div />}

                {nextLesson ? (
                    <Link href={`/learn/${courseSlug}/${nextLesson.slug.current}`} className="group flex items-center text-right text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                        <div className="text-right">
                            <span className="block text-xs uppercase tracking-wider text-gray-400">Next</span>
                            <span className="block text-lg">{nextLesson.title}</span>
                        </div>
                        <span className="ml-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">→</span>
                    </Link>
                ) : <div />}
            </div>
        </article>
    );
}
