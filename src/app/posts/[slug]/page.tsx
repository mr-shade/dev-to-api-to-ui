import { fetchAllArticles, fetchUserArticles, fetchLatestUserArticles } from "../../devto-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = await fetchAllArticles();
  const post = Array.isArray(posts) ? posts.find((p: any) => p.slug === params.slug) : null;
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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const posts = await fetchAllArticles();
  const post = Array.isArray(posts) ? posts.find((p: any) => p.slug === params.slug) : null;
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <article className="prose dark:prose-invert max-w-none">
        {post.cover_image && (
          <Image src={post.cover_image} alt={post.title} width={800} height={330} className="rounded-lg mb-6 w-full object-cover" />
        )}
        <h1>{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          <Image src={post.user.profile_image_90 || post.user.profile_image} alt={post.user.name} width={32} height={32} className="rounded-full" />
          <Link href={`/authors/${post.user.username}`}>{post.user.name}</Link>
          <span>·</span>
          <span>{post.readable_publish_date}</span>
          <span>·</span>
          <span>{post.reading_time_minutes} min read</span>
        </div>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">{post.description}</p>
        <div className="flex gap-2 mb-6 flex-wrap">
          {post.tag_list?.map((tag: string) => (
            <span key={tag} className="bg-neutral-100 dark:bg-neutral-800 text-xs px-2 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Read on DEV.to</a>
      </article>
    </main>
  );
}
