import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ResponsiveAd } from '@/components/ads'
import { adsenseConfig } from '@/config/adsense'

// SEO Metadata for Blog Page
export const metadata: Metadata = {
    title: 'Developer Blog | Latest Tech News, Tutorials & Programming Insights',
    description: 'Explore the latest technology news, programming tutorials, web development tips, and AI insights. Stay updated with expert articles on coding, software development, and tech trends by Developer 2050.',
    keywords: [
        'developer blog',
        'programming tutorials',
        'web development',
        'technology news',
        'coding tips',
        'software development',
        'AI and machine learning',
        'tech articles',
        'programming blog',
        'developer resources',
        'JavaScript tutorials',
        'React tutorials',
        'Next.js blog',
        'tech insights',
        'developer 2050'
    ],
    authors: [{ name: 'Developer 2050' }],
    creator: 'Developer 2050',
    publisher: 'Developer 2050',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://naktech.vercel.app/blog',
        siteName: 'Developer 2050',
        title: 'Developer Blog | Latest Tech News & Programming Tutorials',
        description: 'Discover cutting-edge technology insights, programming tutorials, and web development tips. Join thousands of developers staying ahead with Developer 2050.',
        images: [
            {
                url: 'https://utfs.io/a/30qinxb2cu/v2QQauFkR64MFttuSo6kuIYcCWOXQ4ENVn2BJAxpq7i6hd9L',
                width: 1200,
                height: 630,
                alt: 'Developer 2050 Blog - Tech News and Tutorials',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@developer2050',
        creator: '@developer2050',
        title: 'Developer Blog | Latest Tech News & Programming Tutorials',
        description: 'Explore the latest in tech, programming, web development, and AI. Expert insights and tutorials for developers.',
        images: ['https://utfs.io/a/30qinxb2cu/v2QQauFkR64MFttuSo6kuIYcCWOXQ4ENVn2BJAxpq7i6hd9L'],
    },
    alternates: {
        canonical: 'https://naktech.vercel.app/blog',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'Technology',
}

// Revalidate every 60 seconds
export const revalidate = 60

async function getPosts() {
    const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    category,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
  }`
    return client.fetch(query)
}

function getRelativeTime(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? 'last minute' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return diffInHours === 1 ? 'last hour' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
        return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
    } else if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? 'last week' : `${diffInWeeks} weeks ago`;
    } else if (diffInMonths < 12) {
        return diffInMonths === 1 ? 'last month' : `${diffInMonths} months ago`;
    } else {
        return diffInYears === 1 ? 'last year' : `${diffInYears} years ago`;
    }
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="mx-auto container px-4 py-8 max-w-5xl">
            <h1 className="text-3xl text-accent-yellow font-bold mb-8 border-b pb-4">Latest News</h1>
            
            {/* Header Ad */}
            {adsenseConfig.enabled && adsenseConfig.adSlots.header && (
                <ResponsiveAd 
                    dataAdClient={adsenseConfig.publisherId}
                    dataAdSlot={adsenseConfig.adSlots.header}
                    className="mb-6"
                />
            )}
            
            <div className="flex flex-col gap-6">

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {posts.map((post: any, index: number) => (
                    <div key={post._id}>
                        {/* Show ad after every 3rd post */}
                        {index > 0 && index % 3 === 0 && adsenseConfig.enabled && adsenseConfig.adSlots.inArticle && (
                            <ResponsiveAd 
                                dataAdClient={adsenseConfig.publisherId}
                                dataAdSlot={adsenseConfig.adSlots.inArticle}
                                className="my-6"
                            />
                        )}
                        <Link href={`/blog/${post.slug.current}`} className="group block">
                        <div className="flex flex-col border-2 border-red-500 md:flex-row gap-5 items-start pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            {post.mainImage && (
                                <div className="relative w-full md:w-[200px] h-[130px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={urlFor(post.mainImage).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform border-2 rounded-lg duration-300"
                                    />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col pt-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-accent-yellow px-2 text-white py-1 text-xs">
                                        {post.category.toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold mb-2 text-accent-yellow dark:text-gray-100 transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <div className="flex items-center text-gray-500 text-xs mt-auto">
                                    <span className="font-medium mr-2">Developer 2050</span>
                                    <span>•</span>
                                    <span className="ml-2 text-gray-400 text-xs">
                                        {getRelativeTime(post.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        </Link>
                    </div>
                ))}
            </div>
            
            {/* Footer Ad */}
            {adsenseConfig.enabled && adsenseConfig.adSlots.footer && (
                <ResponsiveAd 
                    dataAdClient={adsenseConfig.publisherId}
                    dataAdSlot={adsenseConfig.adSlots.footer}
                    className="mt-8"
                />
            )}
            {posts.length === 0 && (
                <div className="text-center text-gray-500 mt-12 py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-lg">No posts found.</p>
                    <p className="text-sm mt-2">Go to <Link href="/studio" className="text-blue-500 hover:underline">/studio</Link> to create one!</p>
                </div>
            )}
        </div>
    )
}
