// Server actions for fetching Dev.to data using all available APIs
'use server';

// Articles APIs
export async function fetchAllArticles(page = 1, perPage = 30, tag?: string, username?: string, state?: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });
    if (tag) params.append('tag', tag);
    if (username) params.append('username', username);
    if (state) params.append('state', state);
    
    const res = await fetch(`https://dev.to/api/articles?${params}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
}

export async function fetchLatestArticles(page = 1, perPage = 30) {
    const res = await fetch(`https://dev.to/api/articles/latest?page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch latest articles');
    return res.json();
}

export async function fetchArticleById(id: number) {
    const res = await fetch(`https://dev.to/api/articles/${id}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch article by ID');
    return res.json();
}

export async function fetchArticleByPath(username: string, slug: string) {
    const res = await fetch(`https://dev.to/api/articles/${username}/${slug}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch article by path');
    return res.json();
}

export async function fetchUserArticles(username: string, page = 1, perPage = 30) {
    const res = await fetch(`https://dev.to/api/articles?username=${username}&page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch user articles');
    return res.json();
}

// Users APIs
export async function fetchUsers(page: number = 1, per_page: number = 1000) {
  const res = await fetch(`https://dev.to/api/users?page=${page}&per_page=${per_page}`, {
    headers: { 'accept': 'application/vnd.forem.api-v1+json' },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchUsers(page: number = 1, per_page: number = 1000) {
  const res = await fetch(`https://dev.to/api/users?page=${page}&per_page=${per_page}`, {
    headers: { 'accept': 'application/vnd.forem.api-v1+json' },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchUser(id: string) {
    const res = await fetch(`https://dev.to/api/users/${id}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
}

export async function fetchUserProfileImage(username: string) {
    const res = await fetch(`https://dev.to/api/profile_images/${username}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile image');
    return res.json();
}

// Comments APIs
export async function fetchCommentsByArticle(articleId: string) {
    const res = await fetch(`https://dev.to/api/comments?a_id=${articleId}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
}

export async function fetchCommentById(id: number) {
    const res = await fetch(`https://dev.to/api/comments/${id}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch comment');
    return res.json();
}

// Tags APIs
export async function fetchTags(page = 1, perPage = 20) {
    const res = await fetch(`https://dev.to/api/tags?page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
}

// Organizations APIs
export async function fetchOrganization(username: string) {
    const res = await fetch(`https://dev.to/api/organizations/${username}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch organization');
    return res.json();
}

export async function fetchOrganizationUsers(username: string, page = 1, perPage = 30) {
    const res = await fetch(`https://dev.to/api/organizations/${username}/users?page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch organization users');
    return res.json();
}

export async function fetchOrganizationArticles(username: string, page = 1, perPage = 30) {
    const res = await fetch(`https://dev.to/api/organizations/${username}/articles?page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch organization articles');
    return res.json();
}

// Video Articles APIs
export async function fetchVideoArticles(page = 1, perPage = 24) {
    const res = await fetch(`https://dev.to/api/videos?page=${page}&per_page=${perPage}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch video articles');
    return res.json();
}

// Podcast Episodes APIs
export async function fetchPodcastEpisodes(username?: string, page = 1, perPage = 30) {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });
    if (username) params.append('username', username);
    
    const res = await fetch(`https://dev.to/api/podcast_episodes?${params}`, {
        headers: { 'accept': 'application/vnd.forem.api-v1+json' },
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch podcast episodes');
    return res.json();
}
