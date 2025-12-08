import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}

interface ImageValue {
  asset?: {
    _ref: string;
  };
  alt?: string;
}

interface CodeValue {
  filename?: string;
  code: string;
}

interface PortableTextChild {
  children?: React.ReactNode;
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
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-6 relative h-64 w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-[#10162F]/30 bg-gray-50 dark:bg-[#10162F]/20">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Lesson Image"}
            fill
            className="object-contain"
          />
        </div>
      );
    },
    code: ({ value }: { value: CodeValue }) => {
      return (
        <div className="my-5 rounded-lg overflow-hidden border border-gray-200 dark:border-[#10162F] bg-white dark:bg-[#10162F] shadow-md">
          {value.filename && (
            <div className="px-4 py-2 bg-gray-100 dark:bg-[#0a0d1f] border-b border-gray-200 dark:border-[#1a1f3a] text-xs font-mono text-gray-600 dark:text-[#FFD300] font-semibold">
              {value.filename}
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-sm font-mono leading-[1.6] text-gray-800 dark:text-gray-100">
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: PortableTextChild) => (
      <h1 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-white tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: PortableTextChild) => (
      <h2 className="text-xl font-bold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-[#10162F] text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextChild) => (
      <h3 className="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    normal: ({ children }: PortableTextChild) => (
      <p className="mb-4 leading-[1.7] text-[15px] text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    blockquote: ({ children }: PortableTextChild) => (
      <blockquote className="border-l-3 border-[#FFD300] pl-4 py-2 my-5 bg-[#FFD300]/5 dark:bg-[#FFD300]/10 italic text-gray-800 dark:text-gray-200 text-sm">
        {children}
      </blockquote>
    ),
  },
};

export default async function LessonPage({ params }: PageProps) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLesson(lessonSlug);
  const course = await getCourseModules(courseSlug);

  if (!lesson)
    return (
      <div className="container mx-auto py-20 text-center text-gray-600 dark:text-gray-400 text-base">
        Lesson not found
      </div>
    );

  // Flatten lessons to find prev/next
  const allLessons =
    course?.modules?.flatMap(
      (m: { lessons: { title: string; slug: { current: string } }[] }) =>
        m.lessons
    ) || [];
  const currentIndex = allLessons.findIndex(
    (l: { slug: { current: string } }) => l.slug.current === lessonSlug
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
<article>
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 px-4 mb-6 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-[#10162F] border border-gray-200 dark:border-[#10162F] rounded-lg hover:border-[#FFD300] dark:hover:border-[#FFD300] hover:text-[#FFD300] dark:hover:text-[#FFD300] transition-all duration-300 shadow-sm hover:shadow-md group"
      >
        <span className="text-base group-hover:transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
        <span>Back</span>
      </Link>
      <header className="mb-8 pb-6 border-b border-gray-200 dark:border-[#10162F]">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
          {lesson.title}
        </h1>
        {lesson.summary && (
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-[#FFD300]/10 dark:bg-[#FFD300]/5 px-4 py-3 border-l-3 border-[#FFD300] font-normal leading-relaxed">
            {lesson.summary}
          </p>
        )}
      </header>

      {lesson.videoUrl && (
        <div className="mb-6 max-w-3xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-[#10162F] bg-black">
            <iframe
              src={lesson.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        </div>
      )}

      <div className="prose prose-base text-gray-900 dark:text-white dark:prose-invert max-w-none dark:prose-pre:bg-[#10162F] prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-[#FFD300] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-[#FFD300] prose-code:bg-gray-100 dark:prose-code:bg-[#10162F]/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs">
        <PortableText value={lesson.content} components={ptComponents} />
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#10162F] flex justify-between items-center gap-4">
        {prevLesson ? (
          <Link
            href={`/learn/${courseSlug}/${prevLesson.slug.current}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-[#10162F] border border-gray-200 dark:border-[#10162F] hover:border-[#FFD300] dark:hover:border-[#FFD300] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span className="text-lg p-2 rounded-full bg-gray-100 dark:bg-[#0a0d1f] text-gray-600 dark:text-gray-300 group-hover:bg-[#FFD300] group-hover:text-[#10162F] transition-all duration-300">
              ←
            </span>
            <div className="text-left">
              <span className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-0.5">
                Previous
              </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#FFD300] dark:group-hover:text-[#FFD300] transition-colors line-clamp-1">
                {prevLesson.title}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/learn/${courseSlug}/${nextLesson.slug.current}`}
            className="group flex items-center gap-3 rounded-lg bg-white dark:bg-[#10162F] border border-gray-200 dark:border-[#10162F] hover:border-[#FFD300] dark:hover:border-[#FFD300] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="text-right flex items-center gap-2 px-4">
              <span className="text-lg p-1 group-hover:text-accent-yellow rounded-full dark:bg-[#0a0d1f] text-gray-600 dark:text-gray-300 transition-all duration-300">
                  →
                </span>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#FFD300] dark:group-hover:text-[#FFD300] transition-colors line-clamp-1">
                {nextLesson.title}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
