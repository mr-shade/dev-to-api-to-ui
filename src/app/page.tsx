import { fetchAllArticles, fetchLatestArticles, fetchTags, fetchVideoArticles, fetchPodcastEpisodes } from "./devto-actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DEV Community 👩‍💻👨‍💻 | A constructive and inclusive social network for software developers",
  description: "We're a place where coders share, stay up-to-date and grow their careers.",
  openGraph: {
    title: "DEV Community 👩‍💻👨‍💻",
    description: "We're a place where coders share, stay up-to-date and grow their careers.",
    url: "https://dev.to",
    siteName: "DEV Community",
    images: [
      {
        url: "/dev-social-preview.png",
        width: 1200,
        height: 630,
        alt: "DEV Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEV Community 👩‍💻👨‍💻",
    description: "We're a place where coders share, stay up-to-date and grow their careers.",
    images: ["/dev-social-preview.png"],
  },
};

async function getHomePageData() {
  const [articles, latestArticles, tags, videos, podcasts] = await Promise.all([
    fetchAllArticles(1, 50).catch(() => []),
    fetchLatestArticles(1, 20).catch(() => []),
    fetchTags(1, 30).catch(() => []),
    fetchVideoArticles(1, 10).catch(() => []),
    fetchPodcastEpisodes(undefined, 1, 10).catch(() => []),
  ]);
  
  return {
    articles: Array.isArray(articles) ? articles : [],
    latestArticles: Array.isArray(latestArticles) ? latestArticles : [],
    tags: Array.isArray(tags) ? tags : [],
    videos: Array.isArray(videos) ? videos : [],
    podcasts: Array.isArray(podcasts) ? podcasts : [],
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function normalizeTags(tagList: any): string[] {
  if (Array.isArray(tagList)) return tagList;
  if (typeof tagList === 'string') return tagList.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

export default async function Home() {
  const { articles, latestArticles, tags, videos, podcasts } = await getHomePageData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            <nav className="space-y-1">
              <Link href="/" className="flex items-center px-3 py-2 text-gray-900 bg-blue-50 rounded-md">
                🏠 Home
              </Link>
              <Link href="/readinglist" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                📚 Reading List
              </Link>
              <Link href="/pod" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                🎙️ Podcasts
              </Link>
              <Link href="/videos" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                📹 Videos
              </Link>
              <Link href="/tags" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                🏷️ Tags
              </Link>
            </nav>
            
            {/* Popular Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
              <div className="space-y-2">
                {tags.slice(0, 10).map((tag: any) => (
                  <Link 
                    key={tag.id} 
                    href={`/t/${tag.name}`}
                    className="block text-gray-600 hover:text-blue-600 text-sm"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-7">
            {/* Feed Navigation */}
            <div className="flex space-x-6 border-b border-gray-200 mb-6">
              <button className="pb-3 border-b-2 border-blue-500 text-blue-600 font-medium">Relevant</button>
              <button className="pb-3 text-gray-500 hover:text-gray-700">Latest</button>
              <button className="pb-3 text-gray-500 hover:text-gray-700">Top</button>
            </div>

            {/* Article Feed */}
            <div className="space-y-4">
              {articles.map((article: any) => (
                <article key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {article.cover_image && (
                    <div className="aspect-[2.5/1] bg-gray-100">
                      <Image 
                        src={article.cover_image} 
                        alt={article.title}
                        width={800}
                        height={320}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Image 
                        src={article.user.profile_image_90 || article.user.profile_image}
                        alt={article.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <Link href={`/authors/${article.user.username}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {article.user.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {formatDate(article.published_timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/posts/${article.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {normalizeTags(article.tag_list).slice(0, 4).map((tag: string) => (
                        <Link 
                          key={tag}
                          href={`/t/${tag}`}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>❤️ {article.public_reactions_count} reactions</span>
                        <span>💬 {article.comments_count} comments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>{article.reading_time_minutes} min read</span>
                        <button className="p-1 hover:bg-gray-100 rounded">📖</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Help Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">DEV Community is a community of amazing developers</h3>
              <p className="text-sm text-gray-600 mb-3">
                We're a place where coders share, stay up-to-date and grow their careers.
              </p>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create account
                </button>
                <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                  Log in
                </button>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3"># trending on DEV</h3>
              <div className="space-y-3">
                {latestArticles.slice(0, 5).map((article: any) => (
                  <Link 
                    key={article.id}
                    href={`/posts/${article.slug}`}
                    className="block hover:bg-gray-50 p-2 rounded"
                  >
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1">
                      {article.comments_count} comments
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Videos */}
            {videos.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">🎥 Latest Videos</h3>
                <div className="space-y-3">
                  {videos.slice(0, 3).map((video: any) => (
                    <Link 
                      key={video.id}
                      href={video.path}
                      className="block hover:bg-gray-50 p-2 rounded"
                    >
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">
                        {video.video_duration_in_minutes}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
  );
}
