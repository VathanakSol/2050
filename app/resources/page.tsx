import { getResources } from '@/app/actions/resources';
import { ResourcesList } from '@/components/ResourcesList';
import { PopularCourses } from '@/components/PopularCourses';

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black">
            {/* Popular Courses Section */}
            <PopularCourses />

            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
                <ResourcesList initialResources={resources} />
            </main>

        </div>
    );
}
