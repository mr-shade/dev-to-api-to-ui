import { fetchAllArticles } from "../../devto-actions";

export default async function generateStaticParams() {
    const posts = await fetchAllArticles();
    if (!Array.isArray(posts)) return [];
    // Get unique usernames
    interface Post {
        user: {
            username: string;
        };
    }
    
    const usernames = Array.from(new Set(posts.map((post: Post) => post.user.username)));
    return usernames.map((username) => ({ username }));
}
