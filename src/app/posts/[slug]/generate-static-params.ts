import { fetchAllArticles } from "../../devto-actions";

export default async function generateStaticParams() {
    const posts = await fetchAllArticles();
    if (!Array.isArray(posts)) return [];
    return posts.map((post: any) => ({ slug: post.slug }));
}
