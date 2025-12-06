
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    image: any;
    modules: any[];
}

async function getCourses() {
    const query = `*[_type == "course"]{
    _id,
    title,
    slug,
    description,
    image,
    modules[]{
      lessons[]->{
        slug
      }
    }
  }`;
    return client.fetch(query);
}

export default async function LearnPage() {
    const courses: Course[] = await getCourses();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Learning Paths</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    // Find the first lesson to link to
                    const firstModule = course.modules?.[0];
                    const firstLesson = firstModule?.lessons?.[0];
                    const linkHref = firstLesson
                        ? `/learn/${course.slug.current}/${firstLesson.slug.current}`
                        : `/learn/${course.slug.current}`;

                    return (
                        <Link href={linkHref} key={course._id} className="group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                                <div className="relative h-48 w-full overflow-hidden">
                                    {course.image && (
                                        <Image
                                            src={urlFor(course.image).url()}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3">
                                        {course.description}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                            Start Learning
                                        </span>
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
