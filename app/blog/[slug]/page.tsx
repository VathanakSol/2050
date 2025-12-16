import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

// Revalidate every 60 seconds
export const revalidate = 60

async function getPost(slug: string) {
    const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    mainImage,
    publishedAt,
    category,
    body,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "..."
  }`
    return client.fetch(query, { slug })
}

// Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        return {
            title: 'Post Not Found | Developer 2050',
            description: 'The requested blog post could not be found.',
        }
    }

    const publishedTime = new Date(post.publishedAt).toISOString()
    const postUrl = `${siteConfig.url}/blog/${slug}`
    const imageUrl = post.mainImage
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : siteConfig.ogImage

    // Clean excerpt for description
    const description = post.excerpt || `Read about ${post.title} on Developer 2050 blog. Expert insights on ${post.category}.`

    return {
        title: `${post.title} | Developer 2050 Blog`,
        description: description,
        keywords: [
            post.title,
            post.category,
            'developer blog',
            'programming tutorial',
            'tech article',
            'web development',
            'coding tips',
            'software development',
            'developer 2050',
        ],
        authors: [{ name: 'Developer 2050' }],
        creator: 'Developer 2050',
        publisher: 'Developer 2050',
        category: post.category,
        openGraph: {
            type: 'article',
            locale: 'en_US',
            url: postUrl,
            siteName: 'Developer 2050',
            title: post.title,
            description: description,
            publishedTime: publishedTime,
            authors: ['Developer 2050'],
            tags: [post.category, 'technology', 'programming', 'development'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: siteConfig.twitter.cardType,
            site: siteConfig.twitter.handle,
            creator: siteConfig.twitter.handle,
            title: post.title,
            description: description,
            images: [imageUrl],
        },
        alternates: {
            canonical: postUrl,
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
        other: {
            // JSON-LD Structured Data for Rich Snippets
            'script:ld+json': JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                image: imageUrl,
                datePublished: publishedTime,
                dateModified: publishedTime,
                author: {
                    '@type': 'Person',
                    name: 'Developer 2050',
                    url: siteConfig.url,
                },
                publisher: {
                    '@type': 'Organization',
                    name: siteConfig.name,
                    logo: {
                        '@type': 'ImageObject',
                        url: siteConfig.ogImage,
                    },
                },
                description: description,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': postUrl,
                },
                articleSection: post.category,
                keywords: `${post.category}, programming, web development, technology`,
            }),
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen max-w-5xl mx-auto bg-white dark:bg-[#0F1530] transition-colors duration-300">
            {/* Hero Section */}
            <div className="w-full flex flex-col md:flex-row h-auto md:h-[400px]">
                {/* Left: Image */}
                <div className="w-full md:w-1/2 relative h-[250px] md:h-full bg-gray-200 dark:bg-gray-800">
                    {post.mainImage ? (
                        <Image
                            src={urlFor(post.mainImage).url()}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                            No Image
                        </div>
                    )}
                    <Link
                        href="/blog"
                        className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 dark:bg-white/20 dark:hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300"
                    >
                        &larr; Back
                    </Link>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-[#10162F] p-6 md:p-10 flex flex-col justify-between text-gray-900 dark:text-white relative transition-colors duration-300">
                    {/* Top Row: Category & Socials */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs py-1 px-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-[#FFD300] font-bold tracking-[0.2em] uppercase border border-yellow-200 dark:border-yellow-700/50 transition-colors duration-300">
                            {post.category.toUpperCase()}
                        </span>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <Link href="https://youtube.com/@naktech-kh">
                                <button className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:opacity-75 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                                        <path fill="currentColor" d="m163.33 123l-48-32a6 6 0 0 0-9.33 5v64a6 6 0 0 0 9.33 5l48-32a6 6 0 0 0 0-10M118 148.79v-41.58L149.18 128ZM232.4 70a22 22 0 0 0-13.28-15C185 41.79 130.27 42 128 42s-57-.21-91.16 13A22 22 0 0 0 23.6 70c-2.55 9.89-5.6 28-5.6 58s3.05 48.11 5.6 58a22 22 0 0 0 13.28 15C71 214.21 125.72 214 128 214h.71c6.91 0 58-.44 90.45-13a22 22 0 0 0 13.28-15c2.55-9.87 5.6-27.93 5.6-58S235 79.89 232.4 70m-11.62 113a10 10 0 0 1-6 6.86c-32 12.33-86.2 12.14-86.78 12.14s-54.71.2-86.75-12.17a10 10 0 0 1-6-6.86C32.84 173.78 30 156.78 30 128s2.84-45.78 5.22-55a10 10 0 0 1 6-6.86C72.06 54.26 123.53 54 127.76 54h.24c.54 0 54.71-.2 86.75 12.17a10 10 0 0 1 6 6.86c2.38 9.19 5.22 26.19 5.22 55s-2.81 45.75-5.19 54.97" />
                                    </svg>
                                </button>
                            </Link>
                            <Link href="https://naktech.vercel.app">
                                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:opacity-75 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" d="M2 12h20m-6 0c0 1.313-.104 2.614-.305 3.827c-.2 1.213-.495 2.315-.867 3.244c-.371.929-.812 1.665-1.297 2.168c-.486.502-1.006.761-1.531.761s-1.045-.259-1.53-.761c-.486-.503-.927-1.24-1.298-2.168c-.372-.929-.667-2.03-.868-3.244A23.6 23.6 0 0 1 8 12c0-1.313.103-2.614.304-3.827s.496-2.315.868-3.244c.371-.929.812-1.665 1.297-2.168C10.955 2.26 11.475 2 12 2s1.045.259 1.53.761c.486.503.927 1.24 1.298 2.168c.372.929.667 2.03.867 3.244C15.897 9.386 16 10.687 16 12Z" opacity=".5" />
                                            <path d="M22 12a10 10 0 1 1-20.001 0A10 10 0 0 1 22 12Z" />
                                        </g>
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="mt-auto border-t border-gray-200 dark:border-white/20 pt-6 transition-colors duration-300">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-yellow-600 dark:text-[#FFD300] font-semibold">Developer 2050</span>
                            <span className="text-gray-600 dark:text-gray-300">
                                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })} • {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-yellow-400 dark:bg-[#FFD300] mt-16 transition-colors duration-300"></div>
            {/* Content Body */}
            <div className="container mx-auto px-4 md:px-8 text-gray-900 dark:text-white transition-colors duration-300">
                <div className="prose dark:prose-invert mx-auto max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-7
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-li:marker:text-yellow-500 dark:prose-li:marker:text-[#FFD300]
                    prose-img:rounded-2xl prose-img:shadow-xl
                    prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                ">
                    <PortableText
                        value={post.body}
                        components={{
                            types: {
                                image: ({ value }) => {
                                    if (!value?.asset?._ref) {
                                        return null
                                    }
                                    return (
                                        <figure className="my-10 md:my-12">
                                            <div className="relative w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group  transition-all duration-500">
                                                {/* Aspect ratio container */}
                                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>




                                                    {/* Image */}
                                                    <Image
                                                        src={urlFor(value).quality(100).url()}
                                                        alt={value.alt || 'Blog post image'}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                                                        className="object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>

                                            {/* Caption */}
                                            {value.alt && (
                                                <figcaption className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 italic px-4 transition-colors duration-300">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="w-8 h-[1px] bg-yellow-400/50 dark:bg-accent-yellow/50"></span>
                                                        {value.alt}
                                                        <span className="w-8 h-[1px] bg-yellow-400/50 dark:bg-accent-yellow/50"></span>
                                                    </span>
                                                </figcaption>
                                            )}
                                        </figure>
                                    )
                                }
                            },
                            block: {
                                h2: ({ children }) => (
                                    <h2 className="text-xl md:text-3xl font-black mt-16 mb-6 text-yellow-600 dark:text-[#FFD300] relative group inline-block transition-colors duration-300">
                                        <span className="relative z-10">{children}</span>
                                        <span className="absolute -bottom-2 left-0 w-20 h-1 bg-yellow-400 dark:bg-white rounded-full group-hover:w-full transition-all duration-500 ease-out"></span>
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-lg md:text-xl font-extrabold mt-10 mb-4 text-yellow-600 dark:text-[#FFD300] flex items-center gap-3 transition-colors duration-300">
                                        <span className="w-2 h-6 bg-yellow-400 dark:bg-white rounded-sm transition-colors duration-300"></span>
                                        {children}
                                    </h3>
                                ),
                                blockquote: ({ children }) => (
                                    <div className="relative my-8 pl-6 md:pl-10 border-l-4 border-yellow-400 dark:border-[#FFD300] transition-colors duration-300">
                                        <div className="absolute -top-4 -left-3 bg-white dark:bg-[#0F1530] p-2 transition-colors duration-300">
                                            <svg className="w-6 h-6 text-yellow-600 dark:text-[#FFD300] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91198 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                            </svg>
                                        </div>
                                        <blockquote className="text-lg md:text-xl italic text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                                            {children}&quot;
                                        </blockquote>
                                    </div>
                                ),
                                normal: ({ children }) => (
                                    <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-300">
                                        {children}
                                    </p>
                                ),
                            },
                            list: {
                                bullet: ({ children }) => (
                                    <ul className="space-y-2 my-4 pl-4">
                                        {children}
                                    </ul>
                                ),
                                number: ({ children }) => (
                                    <ol className="space-y-2 my-4 pl-4 list-decimal marker:text-yellow-600 dark:marker:text-[#FFD300] marker:font-bold text-gray-700 dark:text-gray-300 text-base transition-colors duration-300">
                                        {children}
                                    </ol>
                                ),
                            },
                            listItem: {
                                bullet: ({ children }) => (
                                    <li className="flex items-start gap-3 text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                        <span className="mt-2.5 w-1.5 h-1.5 bg-yellow-500 dark:bg-[#FFD300] rounded-full shrink-0 transition-colors duration-300" />
                                        <span>{children}</span>
                                    </li>
                                ),
                            }
                        }}
                    />
                </div>
            </div>
        </article>
    )
}
