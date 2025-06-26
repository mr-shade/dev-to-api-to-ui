import { fetchAllArticles } from "../../devto-actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: { params: { tag: string } }): Promise<Metadata> {
  const { params } = props;
  const tag = await params.tag;
  
  return {
    title: `#${tag} - DEV Community`,
    description: `Articles tagged with #${tag} on DEV Community`,
  };
}

function normalizeTags(tagList: any): string[] {
  if (Array.isArray(tagList)) return tagList;
  if (typeof tagList === 'string') return tagList.split(',').map((t: string) => t.trim()).filter(Boolean);
  return [];
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

export default async function TagPage(props: { params: { tag: string } }) {
  const { params } = props;
  const tag = await params.tag;
  
  // Fetch articles and filter by tag
  const allArticles = await fetchAllArticles(1, 100).catch(() => []);
  
  const articles = Array.isArray(allArticles) 
    ? allArticles.filter((article: any) => {
        const articleTags = normalizeTags(article.tag_list);
        return articleTags.some((t: string) => t.toLowerCase() === tag.toLowerCase());
      })
    : [];

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">#{tag}</h1>
          <p className="text-gray-500">No articles found for this tag.</p>
          <Link href="/tags" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse all tags
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">#{tag}</h1>
        <p className="text-gray-600">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with #{tag}
        </p>
      </div>

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
                {normalizeTags(article.tag_list).slice(0, 4).map((articleTag: string) => (
                  <Link 
                    key={articleTag}
                    href={`/t/${articleTag}`}
                    className={`px-2 py-1 text-xs rounded hover:bg-gray-200 ${
                      articleTag.toLowerCase() === tag.toLowerCase()
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{articleTag}
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
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
