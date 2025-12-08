
import { client } from "@/sanity/lib/client";
import CourseList from "@/components/CourseList";

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
        <div className="container mx-auto px-6 py-8">
            <CourseList courses={courses} />
        </div>
    );
}
