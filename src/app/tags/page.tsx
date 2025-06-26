import { fetchTags, fetchAllArticles } from "../devto-actions";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags - DEV Community",
  description: "Browse tags and topics on DEV Community",
};

export default async function TagsPage() {
  const [tags, popularArticles] = await Promise.all([
    fetchTags(1, 100).catch(() => []),
    fetchAllArticles(1, 20).catch(() => []),
  ]);

  // Get popular tags from articles
  const tagCounts = new Map<string, number>();
  if (Array.isArray(popularArticles)) {
    popularArticles.forEach((article: any) => {
      const articleTags = Array.isArray(article.tag_list) 
        ? article.tag_list 
        : typeof article.tag_list === 'string' 
          ? article.tag_list.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [];
      
      articleTags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
  }

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
        <p className="text-gray-600">
          Follow tags to curate your personal DEV experience! 
          Follow a tag to improve the relevance of what appears in your feed.
        </p>
      </div>

      {/* Popular Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Tags</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/t/${tag}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-medium">#{tag}</span>
                <span className="text-sm text-gray-500">{count} posts</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/t/${tag.name}`}
                className="block p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span className="text-blue-600">#{tag.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
