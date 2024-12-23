"use client";

import "./globals.css"
import Link from "next/link";
import { GiSoccerKick } from 'react-icons/gi'
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const pathWords = pathname.slice(1).split("-");
  const title = pathWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Home";

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <link rel="ico" href="/favicon.ico"/>
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0">
            <nav className="w-full border-b border-gray-800">
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
                <div className="flex flex-row space-x-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`${pathname === "/" ? "underline underline-offset-8 decoration-green-400" : ""}`}>Home</p>
                  </Link>
                  <Link
                    href="/premier-league"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`${pathname === "/premier-league" ? "underline underline-offset-8 decoration-green-400" : ""}`}>Premier League</p>
                  </Link>
                  <Link
                    href="/UCL"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className={`${pathname === "/UCL" ? "underline underline-offset-8 decoration-green-400" : ""}`}>UCL</p>
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
