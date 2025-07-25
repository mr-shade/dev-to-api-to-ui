import { fetchAllArticles, fetchArticleByPath, fetchCommentsByArticle } from "../../devto-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await props.params;
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

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
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
  
  // Fetch comments
  const comments = await fetchCommentsByArticle(fullPost.id.toString()).catch(() => []);
  
  const tags = normalizeTags(fullPost.tag_list, fullPost.tags);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="bg-card rounded-xl shadow-subtle overflow-hidden">
        {fullPost.cover_image && (
          <Image 
            src={fullPost.cover_image} 
            alt={fullPost.title} 
            width={800} 
            height={400} 
            className="w-full h-80 object-cover"
          />
        )}
        
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl">
            <Image
              src={fullPost.user.profile_image_90 || fullPost.user.profile_image}
              alt={fullPost.user.name}
              width={56}
              height={56}
              className="rounded-full border-2 border-white shadow-sm"
            />
            <div className="space-y-1">
              <Link
                href={`/authors/${fullPost.user.username}`}
                className="text-lg font-medium text-gray-900 hover:text-[var(--primary)] transition-colors"
              >
                {fullPost.user.name}
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{fullPost.readable_publish_date}</span>
                <span className="text-gray-300">•</span>
                <span>{fullPost.reading_time_minutes} min read</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{fullPost.title}</h1>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/t/${tag}`}
                  className="px-3 py-1.5 text-sm bg-[var(--primary)]/10 text-[var(--primary)] rounded-full hover:bg-[var(--primary)]/20 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Article Content */}
          {fullPost.body_html && (
            <div className="space-y-8">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900
                  prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-[var(--primary)] prose-blockquote:bg-gray-50/50
                  prose-code:before:hidden prose-code:after:hidden
                  prose-pre:bg-[#1a1d24] prose-pre:rounded-xl"
                dangerouslySetInnerHTML={{ __html: fullPost.body_html }}
              />
            </div>
          )}

          {/* Article Stats */}
          <div className="flex items-center justify-between py-6 border-t border-gray-200/50">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-lg">❤️</span>
                <span className="font-medium">{fullPost.public_reactions_count} reactions</span>
              </div>
              <div className="h-4 w-px bg-gray-200/50" />
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="font-medium">{fullPost.comments_count} comments</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors text-gray-600">
                <span className="text-xl">📖</span>
              </button>
              <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors text-gray-600">
                <span className="text-xl">🔗</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      {Array.isArray(comments) && comments.length > 0 && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Discussion ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.map((comment: any) => (
              <div key={comment.id_code} className="bg-card rounded-xl p-6 shadow-subtle">
                <div className="flex items-start gap-4">
                  <Image
                    src={comment.user.profile_image_90 || comment.user.profile_image}
                    alt={comment.user.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/authors/${comment.user.username}`}
                        className="font-medium text-gray-900 hover:text-[var(--primary)] transition-colors"
                      >
                        {comment.user.name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div
                      className="prose prose-sm max-w-none text-gray-700
                        prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{ __html: comment.body_html }}
                    />
                    {/* Nested comments */}
                    {comment.children && comment.children.length > 0 && (
                      <div className="ml-6 mt-4 space-y-4">
                        {comment.children.map((child: any) => (
                          <div key={child.id_code} className="flex items-start space-x-3">
                            <Image
                              src={child.user.profile_image_90 || child.user.profile_image}
                              alt={child.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Link href={`/authors/${child.user.username}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
                                  {child.user.name}
                                </Link>
                                <span className="text-xs text-gray-500">
                                  {new Date(child.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div 
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: child.body_html }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Metadata */}
      <div className="mt-12 bg-card rounded-xl p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Details</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">ID:</span>
            <span className="font-mono text-gray-700">{fullPost.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Published:</span>
            <time className="text-gray-700">
              {new Date(fullPost.published_at).toLocaleDateString()}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Language:</span>
            <span className="text-gray-700">{fullPost.language || "English"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Type:</span>
            <span className="text-gray-700 capitalize">{fullPost.type_of}</span>
          </div>
        </dl>
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <Link
            href={fullPost.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium inline-flex items-center gap-2"
          >
            <span>View original on DEV Community</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
