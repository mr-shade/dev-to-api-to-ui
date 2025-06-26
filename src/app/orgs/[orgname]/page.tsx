import { fetchOrganization, fetchOrganizationUsers, fetchOrganizationArticles } from "../../devto-actions";
import Image from "next/image";
import Link from "next/link";

interface Organization {
  name: string;
  username: string;
  profile_image: string;
  url?: string;
  summary?: string;
}

export default async function OrgPage({ params }: { params: Promise<{ orgname: string }> }) {
  const { orgname } = await params;
  const [org, users, articles] = await Promise.all([
    fetchOrganization(orgname),
    fetchOrganizationUsers(orgname),
    fetchOrganizationArticles(orgname),
  ]);

  const organization = org as Organization;
  if (!organization || !organization.name) return <div className="text-center py-20">Organization not found.</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        {organization.profile_image && (
          <Image src={organization.profile_image} alt={organization.name} width={72} height={72} className="rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <p className="text-neutral-500">@{organization.username}</p>
          {organization.url && (
            <a href={organization.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              {organization.url}
            </a>
          )}
          {organization.summary && <p className="mt-2 text-neutral-700 dark:text-neutral-300">{organization.summary}</p>}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>
      <ul className="flex flex-wrap gap-4 mb-8">
        {Array.isArray(users) && users.map((user: any) => (
          <li key={user.id} className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded px-3 py-2">
            <Image src={user.profile_image_90 || user.profile_image} alt={user.name} width={32} height={32} className="rounded-full" />
            <Link href={`/authors/${user.username}`} className="font-medium hover:underline">{user.name}</Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-4">Articles</h2>
      <ul className="space-y-6">
        {Array.isArray(articles) && articles.map((post: any) => (
          <li key={post.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow p-5 border border-neutral-200 dark:border-neutral-800 transition hover:shadow-lg">
            <Link href={`/posts/${post.slug}`} className="block group">
              <h3 className="text-lg font-semibold group-hover:underline mb-1">{post.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-1 line-clamp-2">{post.description}</p>
              <div className="flex gap-2 flex-wrap mt-2">
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
