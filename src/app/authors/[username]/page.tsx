import { fetchUserArticles } from "../../devto-actions";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const posts = await fetchUserArticles(params.username);
    const user = Array.isArray(posts) && posts.length > 0 ? posts[0].user : null;
    if (!user) return {};
    return {
        title: `${user.name} (@${user.username}) – DEV.to Author`,
        description: `Articles by ${user.name} (@${user.username}) on DEV.to.`,
        openGraph: {
            title: `${user.name} (@${user.username}) – DEV.to Author`,
            description: `Articles by ${user.name} (@${user.username}) on DEV.to.`,
            images: user.profile_image ? [{ url: user.profile_image }] : [],
            type: "profile",
        },
        twitter: {
            card: "summary",
            title: `${user.name} (@${user.username}) – DEV.to Author`,
            description: `Articles by ${user.name} (@${user.username}) on DEV.to.`,
            images: user.profile_image ? [user.profile_image] : [],
        },
    };
}

export default async function AuthorPage({ params }: { params: { username: string } }) {
    const posts = await fetchUserArticles(params.username);
    if (!Array.isArray(posts) || posts.length === 0) return <div className="text-center py-20">No articles found for this author.</div>;
    const user = posts[0].user;
    return (
        <main className="mx-auto max-w-2xl px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Image src={user.profile_image_90 || user.profile_image} alt={user.name} width={64} height={64} className="rounded-full" />
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-neutral-500">@{user.username}</p>
                    {user.website_url && <a href={user.website_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Website</a>}
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            <ul className="space-y-6">
                {posts.map((post: any) => (
                    <li key={post.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5 border border-neutral-200 dark:border-neutral-800 transition hover:shadow-lg">
                        <Link href={`/posts/${post.slug}`} className="block group">
                            <h3 className="text-lg font-semibold group-hover:underline mb-1">{post.title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-300 mb-1 line-clamp-2">{post.description}</p>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {post.tag_list?.map((tag: string) => (
                                    <span key={tag} className="bg-neutral-100 dark:bg-neutral-800 text-xs px-2 py-1 rounded-full">#{tag}</span>
                                ))}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
