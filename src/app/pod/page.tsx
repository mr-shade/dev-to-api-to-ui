import { fetchPodcastEpisodes } from "../devto-actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts - DEV Community",
  description: "Listen to programming podcasts on DEV Community",
};

export default async function PodcastsPage() {
  const podcasts = await fetchPodcastEpisodes(undefined, 1, 50).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Podcasts</h1>
        <p className="text-gray-600">
          Discover programming podcasts and episodes shared by the DEV community.
        </p>
      </div>

      {Array.isArray(podcasts) && podcasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((episode: any) => (
            <div key={episode.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {episode.image_url && (
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={episode.image_url}
                    alt={episode.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-y-[8px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <Link href={episode.path} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                    {episode.title}
                  </h3>
                </Link>
                {episode.podcast && (
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{episode.podcast.title}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Episode {episode.id}</span>
                  <span>🎙️ Podcast</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No podcast episodes available at the moment.</p>
        </div>
      )}
    </div>
  );
}
