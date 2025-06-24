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
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight leading-tight">DEV.to Clone</h1>
      <p className="text-lg text-center text-neutral-500 mb-12 max-w-2xl mx-auto">A beautiful, SEO-optimized, minimalistic Medium-like UI for DEV.to articles. Browse posts and authors, all fetched live from the DEV.to API.</p>
      <ul className="space-y-10">
        {posts.map((post) => (
          <li key={post.id} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-800 transition hover:shadow-2xl flex flex-col sm:flex-row gap-8 items-center">
            {post.cover_image && (
              <div className="flex-shrink-0 w-full sm:w-64 aspect-[2.4/1] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Image src={post.cover_image} alt={post.title} width={400} height={170} className="object-cover w-full h-full" />
              </div>
            )}
            <div className="flex-1 w-full">
              <Link href={`/posts/${post.slug}`} className="block group">
                <h2 className="text-2xl font-bold mb-2 group-hover:underline leading-snug">{post.title}</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-2 line-clamp-2 text-base">{post.description}</p>
              </Link>
              <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                <Image src={post.user.profile_image_90 || post.user.profile_image} alt={post.user.name} width={32} height={32} className="rounded-full" />
                <Link href={`/authors/${post.user.username}`} className="hover:underline font-medium">{post.user.name}</Link>
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
            </div>
          </li>
        ))}
      </ul>
      {/* SEO: Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'DEV.to Clone',
        description: 'A beautiful, SEO-optimized, minimalistic Medium-like UI for DEV.to articles.',
        url: 'https://yourdomain.com/',
        blogPost: posts.map((post: any) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          image: post.cover_image,
          author: {
            '@type': 'Person',
            name: post.user.name,
            url: `https://yourdomain.com/authors/${post.user.username}`,
          },
          datePublished: post.published_timestamp,
          url: `https://yourdomain.com/posts/${post.slug}`,
        })),
      })}</script>
    </main>
  );
}
