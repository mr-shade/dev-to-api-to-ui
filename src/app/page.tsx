import { fetchAllArticles, fetchUserArticles, fetchLatestUserArticles } from "./devto-actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DEV.to Clone – Minimal Medium-like Blog UI",
  description: "A beautiful, SEO-optimized, minimalistic Medium-like UI for DEV.to articles.",
  openGraph: {
    title: "DEV.to Clone – Minimal Medium-like Blog UI",
    description: "A beautiful, SEO-optimized, minimalistic Medium-like UI for DEV.to articles.",
    url: "https://yourdomain.com/",
    siteName: "DEV.to Clone",
    images: [
      {
        url: "/public/cover.png",
        width: 1200,
        height: 630,
        alt: "DEV.to Clone Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEV.to Clone – Minimal Medium-like Blog UI",
    description: "A beautiful, SEO-optimized, minimalistic Medium-like UI for DEV.to articles.",
    images: ["/public/cover.png"],
  },
};

async function getAllPosts() {
  // Fetch from all endpoints and merge
  const [all, anita, anitaLatest] = await Promise.all([
    fetchAllArticles(),
    fetchUserArticles("anitaolsen"),
    fetchLatestUserArticles("anitaolsen", 110, 1),
  ]);
  // Ensure all are arrays
  const allArr = Array.isArray(all) ? all : [];
  const anitaArr = Array.isArray(anita) ? anita : [];
  const anitaLatestArr = Array.isArray(anitaLatest) ? anitaLatest : [];
  // Merge and deduplicate by id
  const map = new Map();
  [...allArr, ...anitaArr, ...anitaLatestArr].forEach((a: any) => map.set(a.id, a));
  return Array.from(map.values());
}

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">DEV.to Clone</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 border border-neutral-200 dark:border-neutral-800 transition hover:shadow-lg">
            <Link href={post.url} target="_blank" rel="noopener noreferrer" className="block group">
              {post.cover_image && (
                <div className="mb-4 aspect-[2.4/1] overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Image src={post.cover_image} alt={post.title} width={800} height={330} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2 group-hover:underline">{post.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2">{post.description}</p>
              <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                <Image src={post.user.profile_image_90 || post.user.profile_image} alt={post.user.name} width={32} height={32} className="rounded-full" />
                <span>{post.user.name}</span>
                <span>·</span>
                <span>{post.readable_publish_date}</span>
                <span>·</span>
                <span>{post.reading_time_minutes} min read</span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
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
