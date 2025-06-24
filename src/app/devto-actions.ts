// Server actions for fetching Dev.to articles
'use server';

export async function fetchAllArticles() {
  const res = await fetch('https://dev.to/api/articles?per_page=201', {
    headers: { 'accept': 'application/vnd.forem.api-v1+json' },
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function fetchUserArticles(username: string) {
  const res = await fetch(`https://dev.to/api/articles?username=${username}`, {
    headers: { 'accept': 'application/vnd.forem.api-v1+json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch user articles');
  return res.json();
}

export async function fetchLatestUserArticles(username: string, perPage = 110, page = 1) {
  const res = await fetch(`https://dev.to/api/articles/latest/?username=${username}&per_page=${perPage}&page=${page}`, {
    headers: { 'accept': 'application/vnd.forem.api-v1+json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch latest user articles');
  return res.json();
}
