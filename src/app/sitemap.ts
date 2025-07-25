import { MetadataRoute } from 'next'
import { 
  fetchAllArticles,
  fetchTags,
  fetchVideoArticles,
  fetchPodcastEpisodes,
  fetchUsers
} from './devto-actions'

const BASE_URL = 'https://example.com' // Replace with your actual domain

interface Post {
  slug: string
  published_at?: string
}

interface Tag {
  name: string
}

interface User {
  username: string
  updated_at?: string
}

interface Video {
  slug: string
  published_at?: string
}

interface Podcast {
  slug: string
  published_at?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [posts, tags, users, videos, podcasts] = await Promise.all([
      fetchAllArticles(1, 1000).catch(() => []) as Promise<Post[]>,
      fetchTags(1, 1000).catch(() => []) as Promise<Tag[]>,
      fetchUsers(1, 1000).catch(() => []) as Promise<User[]>,
      fetchVideoArticles(1, 1000).catch(() => []) as Promise<Video[]>,
      fetchPodcastEpisodes(undefined, 1, 1000).catch(() => []) as Promise<Podcast[]>
    ])

    const staticPages = [
      { url: BASE_URL, lastModified: new Date(), priority: 1 },
      { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.5 },
      { url: `${BASE_URL}/tags`, lastModified: new Date(), priority: 0.8 },
      { url: `${BASE_URL}/videos`, lastModified: new Date(), priority: 0.8 },
      { url: `${BASE_URL}/pod`, lastModified: new Date(), priority: 0.8 },
    ]

    const dynamicEntries = [
      ...posts.map(post => ({
        url: `${BASE_URL}/posts/${post.slug}`,
        lastModified: new Date(post.published_at || Date.now()),
        priority: 0.8,
      })),
      ...tags.map(tag => ({
        url: `${BASE_URL}/t/${tag.name}`,
        lastModified: new Date(),
        priority: 0.6,
      })),
      ...users.map(user => ({
        url: `${BASE_URL}/authors/${user.username}`,
        lastModified: new Date(user.updated_at || Date.now()),
        priority: 0.7,
      })),
      ...videos.map(video => ({
        url: `${BASE_URL}/videos/${video.slug}`,
        lastModified: new Date(video.published_at || Date.now()),
        priority: 0.7,
      })),
      ...podcasts.map(podcast => ({
        url: `${BASE_URL}/pod/${podcast.slug}`,
        lastModified: new Date(podcast.published_at || Date.now()),
        priority: 0.7,
      }))
    ]

    return [...staticPages, ...dynamicEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return []
  }
}