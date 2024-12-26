"use client";

import "./globals.css"
import Link from "next/link";
import { GiSoccerKick } from 'react-icons/gi'
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname().split("/")[1];
  const pathWords = pathname.split("-");
  const title = pathWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Home";

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <link rel="ico" href="/favicon.ico"/>
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10">
            <nav className="w-full border-b border-gray-700">
              <div className="flex py-4 px-4 space-x-6">
                <div className="font-bold text-xl">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <GiSoccerKick className="w-5 h-5" color="limegreen"/>
                    <span>highlight oasis</span>
                  </Link>
                </div>
                <div className="flex flex-row space-x-4 underline-offset-8">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`decoration-green-400 ${pathname === "" ? "underline" : "hover:underline"}`}>Home</p>
                  </Link>
                  <Link
                    href="/premier-league"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`decoration-green-400 ${pathname === "premier-league" ? "underline" : "hover:underline"}`}>Premier League</p>
                  </Link>
                  <Link
                    href="/UCL"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`decoration-green-400 ${pathname === "UCL" ? "underline" : "hover:underline"}`}>UCL</p>
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="text-center p-6">
            <p>&copy; 2024 Joshua Zheng. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
