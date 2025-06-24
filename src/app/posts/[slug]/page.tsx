import { fetchAllArticles, fetchArticleByPath } from "../../devto-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
    const { params } = props;
    const slug = await params.slug;
    const posts = await fetchAllArticles();
    const post = Array.isArray(posts) ? posts.find((p: any) => p.slug === slug) : null;
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            url: post.url,
            images: post.cover_image ? [{ url: post.cover_image }] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

function normalizeTags(tag_list: any, tags: any): string[] {
    if (Array.isArray(tag_list)) return tag_list;
    if (typeof tag_list === "string" && tag_list.length > 0) return tag_list.split(",").map((t) => t.trim()).filter(Boolean);
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string" && tags.length > 0) return tags.split(",").map((t) => t.trim()).filter(Boolean);
    return [];
}

export default async function PostPage(props: { params: { slug: string } }) {
    const { params } = props;
    const slug = await params.slug;
    const posts = await fetchAllArticles();
    const post = Array.isArray(posts) ? posts.find((p: any) => p.slug === slug) : null;
    if (!post) return notFound();
    // Parse username from post.path: /username/slug
    const username = post.path?.split("/")[1] || post.user?.username;
    let fullPost = post;
    if (username && slug) {
        try {
            fullPost = await fetchArticleByPath(username, slug);
        } catch (e) {
            // fallback to post
        }
    }
    const tags = normalizeTags(fullPost.tag_list, fullPost.tags);
    return (
        <main className="mx-auto max-w-2xl px-4 py-12">
            <article className="prose dark:prose-invert max-w-none">
                {fullPost.cover_image && (
                    <Image src={fullPost.cover_image} alt={fullPost.title} width={800} height={330} className="rounded-lg mb-6 w-full object-cover" />
                )}
                <h1>{fullPost.title}</h1>
                <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    <Image src={fullPost.user.profile_image_90 || fullPost.user.profile_image} alt={fullPost.user.name} width={32} height={32} className="rounded-full" />
                    <Link href={`/authors/${fullPost.user.username}`}>{fullPost.user.name}</Link>
                    <span>·</span>
                    <span>{fullPost.readable_publish_date}</span>
                    <span>·</span>
                    <span>{fullPost.reading_time_minutes} min read</span>
                </div>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">{fullPost.description}</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                    {tags.map((tag: string) => (
                        <span key={tag} className="bg-neutral-100 dark:bg-neutral-800 text-xs px-2 py-1 rounded-full">#{tag}</span>
                    ))}
                </div>
                {/* Render full HTML content if available */}
                {fullPost.body_html && (
                    <div className="mt-8" dangerouslySetInnerHTML={{ __html: fullPost.body_html }} />
                )}
                {/* Show additional article info from all APIs */}
                <div className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                    <div>ID: {fullPost.id}</div>
                    <div>Slug: {fullPost.slug}</div>
                    <div>Path: {fullPost.path}</div>
                    <div>Canonical URL: <a href={fullPost.canonical_url} className="underline" target="_blank" rel="noopener noreferrer">{fullPost.canonical_url}</a></div>
                    <div>Published: {fullPost.published_at}</div>
                    <div>Created: {fullPost.created_at}</div>
                    <div>Edited: {fullPost.edited_at || "-"}</div>
                    <div>Comments: {fullPost.comments_count}</div>
                    <div>Reactions: {fullPost.public_reactions_count}</div>
                    <div>Positive Reactions: {fullPost.positive_reactions_count}</div>
                    <div>Language: {fullPost.language}</div>
                </div>
                <a href={fullPost.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-8">Read on DEV.to</a>
            </article>
        </main>
    );
}
