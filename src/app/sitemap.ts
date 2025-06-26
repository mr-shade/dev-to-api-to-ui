import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com/", lastModified: new Date().toISOString() },
    { url: "https://example.com/tags", lastModified: new Date().toISOString() },
    { url: "https://example.com/videos", lastModified: new Date().toISOString() },
    { url: "https://example.com/pod", lastModified: new Date().toISOString() },
    { url: "https://example.com/authors", lastModified: new Date().toISOString() },
    { url: "https://example.com/orgs", lastModified: new Date().toISOString() },
    { url: "https://example.com/posts", lastModified: new Date().toISOString() },
    { url: "https://example.com/tags", lastModified: new Date().toISOString() },
  ];
}