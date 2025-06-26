import { fetchVideoArticles } from "../devto-actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos - DEV Community",
  description: "Watch programming videos on DEV Community",
};

export default async function VideosPage() {
  const videos = await fetchVideoArticles(1, 50).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Videos</h1>
        <p className="text-gray-600">
          Explore programming videos shared by the DEV community.
        </p>
      </div>

      {Array.isArray(videos) && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {video.cloudinary_video_url && (
                <div className="aspect-video bg-gray-100 relative">
                  <Image
                    src={video.cloudinary_video_url}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <Link href={video.path} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
                {video.user && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>By {video.user.name || `User ${video.user_id}`}</span>
                    {video.video_duration_in_minutes && (
                      <>
                        <span>•</span>
                        <span>{video.video_duration_in_minutes}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos available at the moment.</p>
        </div>
      )}
    </div>
  );
}
