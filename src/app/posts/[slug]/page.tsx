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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {fullPost.cover_image && (
          <Image 
            src={fullPost.cover_image} 
            alt={fullPost.title} 
            width={800} 
            height={400} 
            className="w-full h-80 object-cover"
          />
        )}
        
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Image 
              src={fullPost.user.profile_image_90 || fullPost.user.profile_image} 
              alt={fullPost.user.name} 
              width={48} 
              height={48} 
              className="rounded-full"
            />
            <div>
              <Link href={`/authors/${fullPost.user.username}`} className="font-medium text-gray-900 hover:text-blue-600">
                {fullPost.user.name}
              </Link>
              <div className="text-sm text-gray-500">
                Posted on {fullPost.readable_publish_date} • {fullPost.reading_time_minutes} min read
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{fullPost.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/t/${tag}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Article Content */}
          {fullPost.body_html && (
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: fullPost.body_html }} 
            />
          )}

          {/* Article Stats */}
          <div className="flex items-center justify-between py-6 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 text-gray-600">
                ❤️ <span>{fullPost.public_reactions_count} reactions</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                💬 <span>{fullPost.comments_count} comments</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded">📖</button>
              <button className="p-2 hover:bg-gray-100 rounded">🔗</button>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      {Array.isArray(comments) && comments.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Discussion ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.map((comment: any) => (
              <div key={comment.id_code} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <Image
                    src={comment.user.profile_image_90 || comment.user.profile_image}
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Link href={`/authors/${comment.user.username}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {comment.user.name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none text-gray-700"
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
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Article Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>ID: {fullPost.id}</div>
          <div>Published: {fullPost.published_at}</div>
          <div>Created: {fullPost.created_at}</div>
          <div>Edited: {fullPost.edited_at || "Never"}</div>
          <div>Language: {fullPost.language || "en"}</div>
          <div>Type: {fullPost.type_of}</div>
        </div>
        <div className="mt-2">
          <Link href={fullPost.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View original on DEV.to →
          </Link>
        </div>
      </div>
    </div>
  );
}
