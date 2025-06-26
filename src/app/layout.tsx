import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEV Community 👩‍💻👨‍💻",
  description: "We're a place where coders share, stay up-to-date and grow their careers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* Navigation Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">D</span>
                  </div>
                  <span className="font-bold text-xl hidden sm:block">DEV Community</span>
                </Link>
                <div className="hidden md:flex relative">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/tags" className="text-gray-600 hover:text-gray-900">Tags</Link>
                <Link href="/videos" className="text-gray-600 hover:text-gray-900">Videos</Link>
                <Link href="/pod" className="text-gray-600 hover:text-gray-900">Podcasts</Link>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md">Log in</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create account</button>
              </div>
            </div>
          </div>
        </header>
        
        {children}
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">D</span>
                  </div>
                  <span className="font-bold text-xl">DEV Community</span>
                </div>
                <p className="text-gray-600 text-sm">
                  A constructive and inclusive social network for software developers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
                  <li><Link href="/tags" className="hover:text-gray-900">Tags</Link></li>
                  <li><Link href="/videos" className="hover:text-gray-900">Videos</Link></li>
                  <li><Link href="/pod" className="hover:text-gray-900">Podcasts</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="https://docs.dev.to" className="hover:text-gray-900">API Docs</a></li>
                  <li><a href="https://github.com/forem/forem" className="hover:text-gray-900">GitHub</a></li>
                  <li><a href="https://dev.to/code-of-conduct" className="hover:text-gray-900">Code of Conduct</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="https://twitter.com/thepracticaldev" className="hover:text-gray-900">Twitter</a></li>
                  <li><a href="https://www.facebook.com/thepracticaldev" className="hover:text-gray-900">Facebook</a></li>
                  <li><a href="https://www.instagram.com/thepracticaldev" className="hover:text-gray-900">Instagram</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
              <p>Built with ❤️ using the DEV.to API. This is a clone for educational purposes.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
